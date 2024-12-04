//@ts-nocheck
import { getShiftEnd } from "@/lib/utils";
import {
  AttendanceSettingType,
  AttendanceType,
  CompanyType,
  EmployeeContractType,
  EmployeeRelationDataType,
  EmployeeType,
  ExchangeType,
  PromotionRequestType,
  SalaryIncrementType,
  SalaryType,
  ScheduleType,
  ShiftType,
} from "@/types";
import dayjs from "dayjs";

function getTotalDaysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

const getDaysInMonth = (month: number, year: number) => {
  return Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, i) => new Date(year, month - 1, i + 1)
  );
};

const filterItems = (
  employeeItems: EmployeeRelationDataType[],
  date: Date,
  employeeServiceDays = 0
) => {
  return employeeItems?.filter((empItem) => {
    return (
      ((empItem.id?.minimumWorkingDaysPerMonth
        ? empItem.id.minimumWorkingDaysPerMonth < employeeServiceDays
        : true) &&
        empItem.id?.frequency === "Monthly") ||
      (empItem.id?.frequency === "Yearly" &&
        new Date(
          empItem.createdDate ? empItem.createdDate : empItem.createdAt
        ).getMonth() === new Date(date).getMonth()) ||
      (empItem.id?.frequency === "Once" &&
        new Date(
          empItem.createdDate ? empItem.createdDate : empItem.createdAt
        ).getMonth() === new Date(date).getMonth() &&
        new Date(
          empItem.createdDate ? empItem.createdDate : empItem.createdAt
        ).getFullYear() === new Date(date).getFullYear())
    );
  });
};

export const calculateLateHours = (
  att: AttendanceType,
  schedule: ScheduleType
) => {
  if (schedule && att.checkIn?.time) {
    let from = new Date(att.date);
    const userattfrom = new Date(att.checkIn?.time);
    const [hours, minutes, seconds] = schedule.from.split(":").map(Number);
    from.setHours(hours, minutes, seconds);

    if (userattfrom.getTime() >= from.getTime())
      return (from.getTime() - userattfrom.getTime()) / 1000 / 60 / 60;
  }
  return 0;
};

export const calculateEarlyOutHours = (
  att: AttendanceType,
  schedule: ScheduleType
) => {
  const shiftEnd = schedule && getShiftEnd(schedule, att.date);
  if (shiftEnd && att.checkOut?.time) {
    const to = new Date(shiftEnd).getTime();
    const userAttTo = new Date(att.checkOut?.time).getTime();
    if (userAttTo < to) return (userAttTo - to) / 1000 / 60 / 60;
  }
  return 0;
};

export const calculateSalary = ({
  employee,
  date,
  exchanges = [],
  attendances = [],
  company,
  attendanceSetting,
  shifts,
  salaryIncrements,
  promotions = [],
  contracts = [],
}: {
  employee: EmployeeType;
  date: Date;
  exchanges: ExchangeType[];
  attendances: AttendanceType[];
  company: CompanyType;
  attendanceSetting: AttendanceSettingType;
  shifts: ShiftType[];
  salaryIncrements: SalaryIncrementType[];
  promotions: PromotionRequestType[];
  contracts: EmployeeContractType[];
}): SalaryType => {
  const {
    _id,
    position,
    salary,
    safeEarlyOut,
    serviceHourPerDay,
    safeLate,
    currency,
    allowances: employeeAllowances,
    deductions: employeeDeductions,
    department,
    useFlexibleWorkingHour,
  } = employee;

  let userSalary = salary ? salary : 0;
  let perDay = 0;
  let perHour = 0;
  let late = 0;
  let lateAmount = 0;
  let earlyOut = 0;
  let earlyOutAmount = 0;
  let totalEarning = 0;
  let employeeServiceHours = 0;
  let needWorkingHours = 0;
  let employeeServiceDays = 0;
  let leaveDays = 0;
  let overtime = 0;
  let offDays = 0;
  let overtimeAmount = 0;
  let absences = 0;
  let leaveDayAmount = 0;

  let count = 0;
  let attendanceSafeLateCount = 0;
  let attendanceSafeEarlyOutCount = 0;

  const empIncrements = salaryIncrements.filter(
    (i) => i.employee.toString() === _id.toString()
  );

  const empPromotions = promotions.filter(
    (i) => i.employee.toString() === _id.toString()
  );

  const empContracts = contracts.filter(
    (i) => i.employee.toString() === _id.toString()
  );

  const combinedData = [...empIncrements, ...empPromotions, ...empContracts];

  combinedData.sort(
    (a, b) =>
      new Date(b.date || b.startDate).getTime() -
      new Date(a.date || a.startDate).getTime()
  );

  const hasIncreaseSalary = combinedData[0];
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth();
  const totalDays = getTotalDaysInMonth(month + 1, year);
  const allDays = getDaysInMonth(month + 1, year);

  const attendanceMap = new Map();
  attendances.forEach((attendance) => {
    const dateKey = dayjs(attendance.date).format("YYYY-MM-DD");
    if (!attendanceMap.has(attendance.employee.toString())) {
      attendanceMap.set(attendance.employee.toString(), new Map());
    }
    attendanceMap.get(attendance.employee.toString()).set(dateKey, attendance);
  });

  const shiftMap = new Map();
  shifts.forEach((shift) => {
    const dateKey = dayjs(shift.date).format("YYYY-MM-DD");
    if (!shiftMap.has(shift.employee.toString())) {
      shiftMap.set(shift.employee.toString(), new Map());
    }
    shiftMap.get(shift.employee.toString()).set(dateKey, shift);
  });

  allDays.forEach((date) => {
    const dateKey = dayjs(date).format("YYYY-MM-DD");
    const attendance = attendanceMap.get(employee._id.toString())?.get(dateKey);
    const shift = shiftMap.get(employee._id.toString())?.get(dateKey);

    count += 1;
    if (attendance?.status === "Absence" || !attendance) absences += 1;
    if (attendance) {
      const needToIncreaseSalary =
        hasIncreaseSalary &&
        new Date(attendance.date).getTime() >
          new Date(
            hasIncreaseSalary.date || hasIncreaseSalary.startDate
          ).getTime();

      if (needToIncreaseSalary) {
        userSalary = hasIncreaseSalary.amount || hasIncreaseSalary.newSalary;
        perDay = userSalary / totalDays;
      } else {
        perDay = salary / totalDays;
      }

      perHour = perDay / serviceHourPerDay;

      //service hours

      const serviceDay =
        shift?.schedule &&
        attendance.checkIn?.time &&
        attendance.checkOut?.time &&
        !attendance.leave;

      if (attendance.status === "Off") {
        offDays += 1;
        // add daily salary
        totalEarning += perDay;
      } else if (serviceDay) {
        employeeServiceDays += 1;
        // add daily salary
        totalEarning += perDay;
      }

      if (attendance.overtime) {
        overtime += attendance.overtime;
        overtimeAmount += overtime * (perHour * company.overtimeRate);
      }

      if (attendance.leave) {
        leaveDays += 1;
        const salaryAdjustmentMap = {
          Paid: perDay,
          Unpaid: -perDay,
          HalfPaid: perDay / 2,
        };

        const salaryAdjustment = attendance.leave.paidType
          ? salaryAdjustmentMap[attendance.leave.paidType]
          : 0;

        leaveDayAmount += salaryAdjustment;

        // add daily salary
        if (salaryAdjustment > 0) totalEarning += salaryAdjustment;
      }

      //checking employeeServiceHourPerDay
      let employeeServiceHourPerDay = 0;

      if (
        shift?.schedule &&
        attendance.checkIn?.time &&
        attendance.checkOut?.time
      ) {
        employeeServiceHourPerDay =
          (attendance.checkIn?.time && attendance.checkOut?.time
            ? new Date(attendance.checkOut?.time).getTime() -
              new Date(attendance.checkIn?.time).getTime()
            : 0) /
          1000 /
          60 /
          60;

        const needWorkingHourPerDay = serviceHourPerDay * 1;
        employeeServiceHours += employeeServiceHourPerDay;
        needWorkingHours += needWorkingHourPerDay;
      }

      //checking late
      if (serviceDay && attendanceSetting && !safeLate) {
        const {
          allowMinutesPerMonth: lateAllowMinutesPerMonth = 30,
          allowMinutesPerDay: lateAllowMinutesPerDay = 0,
          allowTimePerMonth: lateAllowTime = 0,
          minuteCutRate: lateMinuteCut = 1,
        } = attendanceSetting.late;

        let from = new Date(attendance.date);
        const userAttFrom =
          attendance.checkIn?.time && new Date(attendance.checkIn?.time);
        const [hours, minutes, seconds] = shift?.schedule.from
          .split(":")
          .map(Number);
        from.setHours(hours, minutes, seconds);

        if (userAttFrom && userAttFrom.getTime() >= from.getTime()) {
          const checkingLate =
            (from.getTime() - userAttFrom.getTime()) / 1000 / 60 / 60;

          const latePerDay =
            shift.status === "Morning Half Off" && employeeServiceHourPerDay > 4
              ? 0
              : checkingLate + (shift.status === "Morning Half Off" ? 4 : 0);

          late += latePerDay;

          if (!useFlexibleWorkingHour) {
            if (latePerDay * 60 < -lateAllowMinutesPerDay)
              attendanceSafeLateCount += 1;

            lateAmount +=
              (latePerDay < 0 &&
              ((attendanceSafeLateCount > lateAllowTime &&
                latePerDay < -(lateAllowMinutesPerDay / 60)) ||
                late > lateAllowMinutesPerMonth)
                ? (latePerDay + lateAllowMinutesPerDay / 60) * perHour
                : 0) * lateMinuteCut;
          }
        }
      }

      //checking earlyOut
      if (serviceDay && attendanceSetting && !safeEarlyOut) {
        const {
          allowMinutesPerMonth: earlyOutAllowMinutesPerMonth,
          allowMinutesPerDay: earlyOutAllowMinutesPerDay = 0,
          allowTimePerMonth: earlyOutAllowTime = 0,
          minuteCutRate: earlyOutMinuteCut = 1,
        } = attendanceSetting?.earlyOut;

        attendanceSafeEarlyOutCount += 1;
        const shiftEnd = getShiftEnd(shift.schedule, attendance.date);
        if (shiftEnd) {
          const to = new Date(shiftEnd);
          const userAttTo =
            attendance.checkOut?.time && new Date(attendance.checkOut?.time);

          if (userAttTo && userAttTo < to) {
            const checkingEarlyOut =
              (userAttTo.getTime() - to.getTime()) / 1000 / 60 / 60;

            const earlyOutPerDay =
              (shift.status === "Half Off" ||
                shift.status === "Evening Half Off") &&
              employeeServiceHourPerDay > 4
                ? 0
                : checkingEarlyOut +
                  (shift.status === "Evening Half Off" ? 4 : 0);

            earlyOut += earlyOutPerDay;

            if (!useFlexibleWorkingHour) {
              if (earlyOutPerDay * 60 < -earlyOutAllowMinutesPerDay)
                attendanceSafeEarlyOutCount += 1;

              let earlyOutAmountPerDay =
                earlyOutPerDay < 0 &&
                ((attendanceSafeEarlyOutCount > earlyOutAllowTime &&
                  earlyOutPerDay < -(earlyOutAllowMinutesPerDay / 60)) ||
                  earlyOut > earlyOutAllowMinutesPerMonth)
                  ? (earlyOutPerDay + earlyOutAllowMinutesPerDay / 60) * perHour
                  : 0 * earlyOutMinuteCut;

              earlyOutAmount += earlyOutAmountPerDay;
            }
          }
        }
      }
    }
  });

  const totalAllowances = filterItems(
    employeeAllowances,
    date,
    employeeServiceDays
  ).map((i) => i.id);
  const totalDeductions = filterItems(employeeDeductions, date).map(
    (i) => i.id
  );

  const totalAllowanceAmount = totalAllowances.reduce((total, allowance) => {
    const { rate } =
      exchanges.find(
        (ex) =>
          ex.from?.toString() === allowance.currency?._id?.toString() &&
          ex.to?.toString() === currency?._id?.toString()
      ) || {};
    return total + (rate ? allowance.amount * rate : allowance.amount);
  }, 0);

  const totalDeductionAmount =
    totalDeductions.reduce((total, deduction) => {
      if (deduction.deductBySalary && !deduction.amount) {
        return total + deduction.deductBySalary * (salary / 30);
      }
      const exchangeRateObj = exchanges.find(
        (ex) =>
          ex.from?.toString() === deduction.currency?.toString() &&
          ex.to?.toString() === currency?._id?.toString()
      );

      if (exchangeRateObj) {
        const amountInEmployeeCurrency =
          deduction.amount * exchangeRateObj.rate;
        return total + amountInEmployeeCurrency;
      }

      return total + deduction.amount;
    }, 0) -
    lateAmount -
    earlyOutAmount;

  totalEarning += totalAllowanceAmount;

  if (useFlexibleWorkingHour) {
    const needHours = employeeServiceHours - needWorkingHours;
    if (needHours < 0) totalEarning += needHours * perHour;
  }

  let totalSalary = totalEarning - totalDeductionAmount;

  const companyCurrency = company.currency;

  if (companyCurrency.toString() !== employee.currency?._id.toString()) {
    const exchange = exchanges.find(
      (ex) =>
        ex.from?.toString() === employee.currency?._id?.toString() &&
        ex.to?.toString() === company.currency?.toString()
    );

    if (exchange) {
      totalSalary = totalSalary * exchange.rate;
    }
  }

  const salaryAdjustmentMap = {
    Paid: perDay,
    Unpaid: -perDay,
    HalfPaid: -perDay / 2,
  };

  const totalLeaveDays = attendances
    .filter((attendance) => attendance.leave)
    .map((attendance) => ({
      name: attendance.leave?.name,
      fromModel: attendance.fromModel,
      paidType: attendance.leave?.paidType,
    }))
    .reduce((acc, leave) => {
      const key = leave.name + "|" + leave.paidType;
      if (!acc[key]) {
        acc[key] = {
          name: leave.name,
          count: 1,
          isPublicHoliday: leave.fromModel === "Holiday",
          type: leave.paidType,
          rate: Math.round(salaryAdjustmentMap[leave.paidType]),
          amount: Math.round(salaryAdjustmentMap[leave.paidType]),
        };
      } else {
        acc[key].count++;
        acc[key].amount += Math.round(salaryAdjustmentMap[leave.paidType]);
      }
      return acc;
    }, {});

  const result = Object.values(totalLeaveDays);

  return {
    employee,
    date,
    totalServiceHours: employeeServiceHours,
    totalWorkingHours: needWorkingHours,
    empCurrency: currency,
    department,
    serviceHours: serviceHourPerDay,
    position,
    perDay,
    perHour,
    perMinute: perHour / 60,
    serviceDays: employeeServiceDays,
    offDays,
    salary: userSalary,
    leaveDays: result,
    leaveDayAmount,
    leaves: leaveDays,
    lateMinutes: late,
    lateAmount: lateAmount,
    earlyOutMinutes: earlyOut,
    earlyOutAmount: earlyOutAmount,
    absences,
    overtime,
    overtimeAmount,
    allowances: totalAllowanceAmount,
    deductions: totalDeductionAmount,
    employeeDeductions,
    earning: totalEarning,
    totalAllowances,
    totalDeductions,
    netSalary: totalSalary,
    attendances: attendances.length,
    shifts: shifts.length,
  };
};
