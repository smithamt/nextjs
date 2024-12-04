
import { getUser } from "@/data/user";
import { EmployeeType } from "@/types";
import dayjs from "dayjs";
import { calculateSalary } from "./calculateSalaries";
import CompanyModel from "@/models/companies/model";
import ExchangeModel from "@/models/exchanges/model";
import SalaryModel from "@/models/salaries/model";
import SalaryIncrement from "@/models/salaryIncrements/model";
import PromotionRequestModel from "@/models/promotions/model";
import ContractModel from "@/models/contracts/model";
import AttendanceSetting from "@/app/api/attendanceSetting";
import AttendanceModel from "@/models/attendances/model";
import ShiftModel from "@/models/shifts/model";

export function isPastMonth(date: Date) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const dateMonth = date.getMonth();
  const dateYear = date.getFullYear();
  if (dateYear < currentYear) {
    return true;
  } else if (dateYear === currentYear) {
    if (dateMonth < currentMonth) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export const getSalaryData = async (
  date: Date,
  employees: EmployeeType[],
  status: string
) => {
  const user = await getUser();
  if (!user) return;
  const company = await CompanyModel.findById(user.company);
  if (!company) return { error: "company not found", status: 404 };

  const exchanges = await ExchangeModel.find({
    // isPublic: true,
    // company: user.company,
  });

  const alreadyEmployees = await SalaryModel.find({
    isPublic: true,
    employee: { $in: employees },
    month: dayjs(date).format("MMMM YYYY"),
    company: user.company,
  })
    .populate("department position", "name")
    .populate("employee", "name employeeId position salary")
    .populate("empCurrency", "symbol name")
    .populate("employeeDeductions totalAllowances totalDeductions");

  const salaryIncrements = await SalaryIncrement.find({
    isPublic: true,
    employee: { $in: employees },
  });

  const promotions = await PromotionRequestModel.find({
    isPublic: true,
    employee: { $in: employees },
    status: "approved",
  });

  const contracts = await ContractModel.find({
    isPublic: true,
    employee: { $in: employees },
  });

  const attendanceSetting = await AttendanceSetting.findById(
    company?.attendanceSetting.setting
  ).populate("late earlyOut");

  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth();
  const toGetStartDate = new Date(year, month, 1);
  const toGetEndDate = new Date(year, month + 1, 0);

  const startDate = new Date(dayjs(toGetStartDate).format("YYYY-MM-DD"));
  const endDate = new Date(dayjs(toGetEndDate).format("YYYY-MM-DD"));

  const attendances = await AttendanceModel.find({
    employee: { $in: employees },
    date: {
      $gte: startDate.toISOString(),
      $lte: isPastMonth(new Date(date))
        ? endDate.toISOString()
        : new Date().toISOString(),
    },
  })
    .select(
      "checkIn checkOut from to schedule employee fromModel status date leave overtime"
    )
    .populate("schedule", "-color")
    .populate("leave");

  const shiftQuery = {
    employee: { $in: employees },
    date: {
      $gte: startDate.toISOString(),
      $lte: isPastMonth(new Date(date))
        ? endDate.toISOString()
        : new Date().toISOString(),
    },
  };

  const shifts = await ShiftModel.find(shiftQuery)
    .populate("schedule", "-color")
    .select("status date employee schedule");

  const response = employees.map((employee) => {
    const already = alreadyEmployees.find(
      (e) => e.employee._id.toString() === employee._id.toString()
    );
    const employeeAttendances = attendances.filter(
      (a) => a.employee.toString() === employee._id.toString()
    );

    const employeeShifts = shifts.filter(
      (s) => s.employee.toString() === employee._id.toString()
    );

    if (already) return already;

    return calculateSalary({
      employee,
      date,
      exchanges,
      attendances: employeeAttendances,
      shifts: employeeShifts,
      company,
      attendanceSetting,
      salaryIncrements,
      promotions,
      contracts,
    });
  });

  return response;
};
