import { getShiftEnd } from "@/lib/utils";
import AttendanceModel from "@/models/attendances/model";
import ScheduleModel from "@/models/schedules/model";
import ShiftModel from "@/models/shifts/model";
import { EmployeeType, ShiftType } from "@/types";
import dayjs from "dayjs";

export const getShift = (shifts: ShiftType[], userId: string, now: Date) => {
  const foundShift =
    shifts.find((shi) => {
      const schedule = shi.schedule;
      if (schedule) {
        const shiftEnd = getShiftEnd(schedule, shi.date);
        let shiftEndTime = new Date(shiftEnd);
        let shiftStartTime = new Date(shi.date);
        let [startHours] = schedule.from.split(":");
        shiftStartTime.setHours(parseInt(startHours));
        shiftStartTime.setHours(parseInt(startHours) - 8);
        shiftEndTime.setHours(shiftEndTime.getHours() + 7);

        return (
          shi.employee.toString() === userId.toString() &&
          shiftEndTime.getTime() >= now.getTime() &&
          shiftStartTime.getTime() <= now.getTime()
        );
      } else {
      }
    }) ||
    shifts.find(
      (shi) =>
        shi.employee.toString() === userId &&
        dayjs(shi.date).format("YYYY-MM-DD") === dayjs(now).format("YYYY-MM-DD")
    );

  //@ts-ignore
  const shi = foundShift ? foundShift.toObject() : undefined;

  return shi ? { ...shi, ref: "from get shift function" } : undefined;
};

export const getMyTodayShift = async (user: EmployeeType) => {
  const id = user._id;
  const now = new Date();
  const start = new Date(now);

  start.setDate(start.getDate() - 2);
  const end = new Date(now);
  end.setDate(end.getDate() + 2);

  const shifts = await ShiftModel.find({
    employee: id,
    date: { $gte: start.toISOString(), $lte: end.toISOString() },
  })
    .populate("schedule", "name color from to")
    .select("-createdBy");

  let getting = getShift(shifts, id, new Date());

  if (!getting && user.schedule?.id) {
    const employeSchedule = await ScheduleModel.findOne({
      _id: user.schedule.id,
    });

    if (employeSchedule) {
      getting = {
        employee: user,
        date: now,
        schedule: employeSchedule,
        status: "Fixed shift",
        ref: "created from fixed shift",
      };
    }
  }

  if (!getting) {
    const previousShift = await ShiftModel.findOne({
      employee: user._id,
      schedule: { $exists: true },
      date: { $lte: new Date() },
    })
      .populate("schedule")
      .sort({ date: -1 })
      .limit(1);

    const copyShift = previousShift?.toObject();
    const date = new Date();
    const fromTime = new Date(
      //@ts-ignore
      `${dayjs().format("YYYY-MM-DD")} ${previousShift.schedule.from}`
    );

    if (fromTime.getTime() < Date.now() - 3600000 * 16) {
      date.setDate(date.getDate() + 1);
    }

    const formatDate = new Date(dayjs(date).format("YYYY-MM-DD")).toISOString();

    getting = {
      ...copyShift,
      status: "Copy Schedule",
      date: formatDate,
      ref: `copy from ${dayjs(previousShift?.date).format("YYYY-MM-DD")} shift`,
    };
  }

  return getting;
};

export async function getMyAttendance(date: Date, user: EmployeeType) {
  const attendance = await AttendanceModel.findOne({
    employee: user._id,
    date,
  });

  const response = attendance?.toObject();

  return response;
}
