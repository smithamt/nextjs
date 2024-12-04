import { getShiftEnd, getWeek } from "@/lib/utils";
import FingerprintData from "@/models/fingerprints/model";
import { USER } from "@/roles";
import {
  AttendanceType,
  EmployeeType,
  FingerprintType,
  ShiftType,
} from "@/types";
import dayjs from "dayjs";
import { cache } from "react";
import AttendanceModel from "../../../models/attendances/model";
import ShiftModel from "../../../models/shifts/model";
import { getUser } from "@/data/user";

const SHIFT_STATUS = ["Working Day", "Copy Schedule", "Removed Day Off"];

const timeDiff = (startTime: string, endTime: string) => {
  var start = dayjs(`2022-01-01T${startTime}`);
  var end = dayjs(`2022-01-01T${endTime}`);

  if (start.isAfter(end)) {
    end = end.add(1, "day");
  }

  var diff = end.diff(start);
  var diffInHours = Math.floor(diff / 1000 / 60 / 60);
  var diffInMinutes = Math.floor((diff / 1000 / 60) % 60);

  return diffInHours;
};

const findCheckInOutFromFingerprint = ({
  user,
  shift,
  attendance,
  fingerprints,
  usedFingerprints,
}: {
  user: EmployeeType;
  shift: ShiftType | undefined;
  attendance: AttendanceType | undefined;
  fingerprints: FingerprintType[];
  usedFingerprints: string[];
}) => {
  if (
    shift &&
    SHIFT_STATUS.includes(shift?.status) &&
    shift.schedule &&
    !attendance?.checkIn?.time
  ) {
    const shiftStartTime = new Date(
      `${dayjs(shift.date).format("YYYY-MM-DD")} ${shift.schedule.from}`
    );

    const serviceHours = timeDiff(shift.schedule.from, shift.schedule.to);

    const checkIn = fingerprints.find((f) => {
      if (attendance?.employee.toString() === "656dd6a5e4a10893a128d2f5") {
        console.log(
          "shift",
          shiftStartTime,
          f.recordTime,
          f.recordTime.getTime() >=
            shiftStartTime.getTime() - 1000 * 60 * 60 * 5.5,
          f.recordTime.getTime() <=
            shiftStartTime.getTime() + 1000 * 60 * 60 * 5.5
        );
      }
      return (
        f.employee.toString() === shift.employee.toString() &&
        f.recordTime.getTime() >=
          shiftStartTime.getTime() - 1000 * 60 * 60 * 5.5 &&
        f.recordTime.getTime() <=
          shiftStartTime.getTime() + 1000 * 60 * 60 * 5.5
      );
    });

    const data = {
      time: checkIn?.recordTime,
      method: "fingerprint",
      status: "approved",
      approvedBy: user._id,
      remark: `Suggest by system in ${dayjs().format("hh:mm a, DD MM YYYY")}`,
    };

    if (checkIn && usedFingerprints) usedFingerprints.push(checkIn._id);

    if (attendance && checkIn) {
      //@ts-ignore
      attendance.checkIn = data;
      attendance.ref = "suggest-checkin";
    } else if (checkIn) {
      attendance = {
        //@ts-ignore
        checkIn: data,
        status: "Arrived",
        schedule: shift.schedule,
        date: shift.date,
        employee: shift.employee,
        ref: "suggest-checkin",
      };
    }
  }

  if (
    shift &&
    SHIFT_STATUS.includes(shift.status) &&
    shift.schedule &&
    !attendance?.checkOut?.time
  ) {
    const shiftEndTime = getShiftEnd(shift.schedule, shift.date);
    const serviceHours = timeDiff(shift.schedule.from, shift.schedule.to);

    const checkOut = fingerprints.find((f) => {
      return (
        f.employee.toString() === shift.employee?.toString() &&
        f.recordTime.getTime() >=
          new Date(shiftEndTime).getTime() - 1000 * 60 * 60 * 5.5 &&
        f.recordTime.getTime() <=
          new Date(shiftEndTime).getTime() + 1000 * 60 * 60 * 5.5
      );
    });

    const data = {
      time: checkOut?.recordTime,
      method: "fingerprint",
      status: "approved",
      approvedBy: user._id,
      remark: `Suggest by system in ${dayjs().format("hh:mm a, DD MM YYYY")}`,
    };

    if (checkOut && usedFingerprints) usedFingerprints.push(checkOut._id);

    if (attendance && checkOut) {
      //@ts-ignore
      attendance.checkOut = data;
      attendance.ref = "suggest-checkout";
    } else if (checkOut) {
      attendance = {
        //@ts-ignore
        checkOut: data,
        status: "Arrived",
        schedule: shift.schedule,
        date: shift.date,
        employee: shift.employee,
        ref: "suggest-checkout",
      };
    }
  }

  return attendance;
};

const getFingerPrintData = async ({
  user,
  shifts,
  attendances,
  startDate,
  endDate,
  employees,
}: {
  user: EmployeeType;
  shifts: ShiftType[];
  attendances: AttendanceType[];
  startDate: Date;
  endDate: Date;
  employees: string[];
}) => {
  const attendanceMap = new Map<string, Map<string, AttendanceType>>();
  const shiftMap = new Map<string, Map<string, ShiftType>>();
  const usedFingerprints: string[] = [];

  attendances.forEach((attendance) => {
    const dateKey = dayjs(attendance.date).format("YYYY-MM-DD");
    if (!attendanceMap.has(attendance.employee.toString()))
      attendanceMap.set(attendance.employee.toString(), new Map());

    attendanceMap.get(attendance.employee.toString())?.set(dateKey, attendance);
  });

  shifts.forEach((shift) => {
    const dateKey = dayjs(shift.date).format("YYYY-MM-DD");
    if (!shiftMap.has(shift.employee.toString()))
      shiftMap.set(shift.employee.toString(), new Map());

    shiftMap.get(shift.employee.toString())?.set(dateKey, shift);
  });

  startDate.setDate(startDate.getDate() - 1);
  endDate.setDate(endDate.getDate() + 2);

  const fingerprints = await FingerprintData.find({
    employee: { $in: employees },
    recordTime: {
      $gte: startDate,
      $lte: endDate,
    },
  });

  const start = new Date(startDate);
  const end = new Date(endDate);
  let dates = [];
  if (start && end) {
    let currentDate = dayjs(start);
    while (currentDate.isBefore(end) || currentDate.isSame(end)) {
      dates.push(new Date(currentDate.format("YYYY-MM-DD")));
      currentDate = currentDate.add(1, "day");
    }
  }

  const lastShift = new Map();

  const response = await Promise.all(
    dates.map(async (date) => {
      const emps = await Promise.all(
        employees.map(async (employee) => {
          const dateKey = dayjs(date).format("YYYY-MM-DD");

          let shift = shiftMap.get(employee.toString())?.get(dateKey);

          if (!shift) {
            let previousShift = lastShift.get(employee.toString());

            if (!previousShift?.schedule) {
              previousShift = await ShiftModel.findOne({
                employee,
                schedule: { $exists: true },
                date: { $lte: new Date() },
              }).populate("schedule");
            }

            if (previousShift?.schedule) {
              lastShift.set(employee.toString(), previousShift);
              shift = {
                schedule: previousShift.schedule,
                date,
                //@ts-ignore
                employee,
                status: "Copy",
              };
            }
          }

          let attendance = attendanceMap.get(employee.toString())?.get(dateKey);

          attendance = findCheckInOutFromFingerprint({
            user,
            shift,
            attendance,
            fingerprints,
            usedFingerprints,
          });

          return {
            attendance,
            shift,
          };
        })
      );
      return emps;
    })
  );

  const updateAttendances = response
    .flat()
    .filter(
      (r) =>
        r.attendance?.ref === "suggest-checkin" ||
        r.attendance?.ref === "suggest-checkout"
    )
    .map((i) => i.attendance);

  //@ts-ignore
  const updateShifts: ShiftType[] = response
    .flat()
    .filter(
      (r) =>
        r.shift?.status === "Copy Schedule" &&
        r.attendance?.checkIn?.time &&
        r.attendance?.checkOut?.time
    )
    .filter((i) => i.shift)
    .map((i) => i.shift);

  if (USER !== user.role)
    updateShifts.forEach(async (shift) => {
      try {
        const response = await ShiftModel.findOneAndUpdate(
          {
            employee: shift.employee,
            date: shift.date,
          },
          {
            ...shift,
            status: "Working Day",
            createdBy: user._id,
            ref: "copy shift by system because employee don't have schedule",
          },
          { upsert: true }
        );
        console.log("shifts", response);
      } catch (error) {
        console.log("error", error);
      }
    });

  const checkInOptions = updateAttendances.map((i) => {
    if (i)
      return {
        updateOne: {
          filter: { employee: i.employee, date: i.date },
          update: { $set: i },
          upsert: true,
        },
      };
  });

  if (usedFingerprints.length > 0) {
    await FingerprintData.updateMany(
      { _id: { $in: usedFingerprints } },
      { used: true }
    );
  }
  if (checkInOptions.length > 0) {
    //@ts-ignore
    const response = await AttendanceModel.bulkWrite(checkInOptions);
    console.log("udateddd", response);
  }
  return response.flat();
};

export const fetchAttendances = cache(
  async ({
    employees,
    next = 0,
    user,
  }: {
    employees: string[];
    next: number;
    user: EmployeeType;
  }) => {
    const week = getWeek(new Date(), next);
    const startDate = week[0];
    startDate.setDate(startDate.getDate() - 1);
    const endDate = week[week.length - 1];
    endDate.setDate(endDate.getDate() + 1);

    const attendances = await AttendanceModel.find({
      employee: { $in: employees },
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .select(
        "checkIn.time checkIn.method checkOut.time checkOut.method schedule employee status date leave overtimeRequest overtime fromModel createdAt role"
      )
      .populate("leave schedule", "name from to color");

    const shifts = await ShiftModel.find({
      employee: { $in: employees },
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .select("status schedule date employee")
      .populate("schedule", "name from to color");

    const response = await getFingerPrintData({
      user,
      shifts,
      attendances,
      startDate,
      endDate,
      employees,
    });

    return response;
  }
);

export const fetchShifts = async (employees: string[], next: number = 0) => {
  const week = getWeek(new Date(), next);
  const startDate = week[0];
  startDate.setDate(startDate.getDate() - 1);
  const endDate = week[week.length - 1];
  endDate.setDate(endDate.getDate() + 1);
  const shifts = await ShiftModel.find({
    employee: { $in: employees },
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .populate("schedule", "name color from to")
    .lean();

  return shifts as ShiftType[];
};

export const getAttendancesByEmployee = cache(
  async ({
    employee,
    startDate,
    endDate,
    user,
  }: {
    employee: string;
    startDate: Date;
    endDate: Date;
    user: EmployeeType;
  }) => {
    const attendances = await AttendanceModel.find({
      employee,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .select(
        "checkIn.time checkIn.method checkOut.time checkOut.method schedule employee status date leave overtimeRequest overtime fromModel createdAt role"
      )
      .populate("leave schedule", "name from to color");

    const shifts = await ShiftModel.find({
      employee,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .select("status schedule date employee")
      .populate("schedule", "name from to color");

    const response = await getFingerPrintData({
      user,
      shifts,
      attendances,
      startDate,
      endDate,
      employees: [employee],
    });

    return response;
  }
);

export const getShiftsByEmployee = cache(
  async (employee: string, startDate: Date, endDate: Date) => {
    const shifts = await ShiftModel.find({
      employee,
      date: { $gte: startDate, $lte: endDate },
    }).populate("schedule", "name color from to");

    return shifts;
  }
);
