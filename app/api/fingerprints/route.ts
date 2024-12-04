import { getShift } from "@/app/dashboard/home/attendance/action";
import { getEmployeeQuery } from "@/data/employees";
import dayjs from "dayjs";
import { NextRequest } from "next/server";
import AttendanceModel from "../../../models/attendances/model";
import EmployeeModel from "../../../models/employees/model";
import FingerprintData from "../../../models/fingerprints/model";
import ScheduleModel from "../../../models/schedules/model";
import ShiftModel from "../../../models/shifts/model";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paramsObject = Object.fromEntries(searchParams.entries());
  const { pageParam, size, startDate, endDate, status } = paramsObject;

  const employeeQuery = await getEmployeeQuery(paramsObject);

  const employees =
    await EmployeeModel.find(employeeQuery).select("_id fingerprintId");

  const start = (Number(pageParam) - 1) * Number(size);

  const fingerprintQuery: any = {
    employee: { $in: employees.map((i) => i._id) },
    recordTime: {
      $gte: new Date(
        dayjs(startDate).add(0, "d").format("YYYY-MM-DD")
      ).toISOString(),
      $lte: new Date(
        dayjs(endDate).add(1, "d").format("YYYY-MM-DD")
      ).toISOString(),
    },
  };

  if (status === "true") {
    fingerprintQuery.used = { $exists: false };
  }

  const response = await FingerprintData.find(fingerprintQuery)
    .select("employee recordTime ip")
    .sort({ recordTime: -1 })
    .populate("employee", "name nickname profile employeeId schedule")
    .skip(start)
    .limit(Number(size));

  const query = {
    employee: {
      $in: response.map((i) => i.employee?._id),
    },
    date: {
      $in: response
        .map((date) => {
          const firstDay = new Date(
            dayjs(date.recordTime).add(-1, "d").format("YYYY-MM-DD")
          );
          const lastDay = new Date(
            dayjs(date.recordTime).add(1, "d").format("YYYY-MM-DD")
          );
          const now = new Date(
            dayjs(date.recordTime).format("YYYY-MM-DD")
          ).toISOString();
          return [firstDay, now, lastDay];
        })
        .flat(),
    },
  };

  const attendances = await AttendanceModel.find(query);

  const attendanceMap = new Map();

  attendances.forEach((attendance) => {
    const dateKey = dayjs(attendance.date).format("YYYY-MM-DD");
    if (!attendanceMap.has(attendance.employee.toString())) {
      attendanceMap.set(attendance.employee.toString(), new Map());
    }
    attendanceMap.get(attendance.employee.toString()).set(dateKey, attendance);
  });

  const shifts = await ShiftModel.find(query)
    .populate("schedule", "name color from to")
    .select("-createdBy");

  const fingerprints = response.map(async (i) => {
    const empShifts = shifts.filter(
      (s) => s.employee.toString() === i.employee._id.toString()
    );
    let shift = getShift(empShifts, i.employee._id, new Date(i.recordTime));

    if (!shift && i.employee.schedule?.id) {
      const employeSchedule = await ScheduleModel.findOne({
        _id: i.employee.schedule.id,
      });

      if (employeSchedule) {
        shift = {
          employee: i.employee,
          date: dayjs(i.recordTime).format("YYYY-MM-DD"),
          schedule: employeSchedule,
          status: "Fixed shift",
          ref: "created from fixed shift",
        };
      }
    }

    if (!shift) {
      const previousShift = await ShiftModel.findOne({
        employee: i.employee?._id,
        schedule: { $exists: true },
        date: { $lte: new Date() },
      })
        .populate("schedule", "name color from to")
        .sort({ date: -1 })
        .select("-createdBy")
        .limit(1);
      const copyShift = previousShift?.toObject();
      const date = new Date(i.recordTime);

      const fromTime = new Date(
        `${dayjs(date).format("YYYY-MM-DD")} ${previousShift?.schedule?.from}`
      );

      if (fromTime.getTime() < Date.now() - 3600000 * 16) {
        date.setDate(date.getDate() + 1);
      }

      const formatDate = new Date(dayjs(date).format("YYYY-MM-DD"));

      shift = {
        ...copyShift,
        status: "Copy Schedule",
        date: formatDate,
        ref: `copy from ${dayjs(previousShift?.date).format("YYYY-MM-DD")} shift`,
      };
    }

    const dateKey = dayjs(shift?.date).format("YYYY-MM-DD");
    const attendance = attendanceMap.get(i.employee.id)?.get(dateKey);
    return { fingerprint: i, shift, attendance };
  });

  const responses = await Promise.all(fingerprints);
  return Response.json(responses);
}

export async function POST() {
  return Response.json({ name: "fingerprints post" });
}

export async function PUT() {
  return Response.json({ name: "fingerprints put" });
}

export async function DELETE() {
  return Response.json({ name: "fingerprints delete" });
}
