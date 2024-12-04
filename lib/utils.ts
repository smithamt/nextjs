import { statusColors } from "@/data/status";
import { AttendanceType, ScheduleType, ShiftType } from "@/types";
import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";

export const cookie = {
  name: "session",
  options: { httpOnly: true, path: "/" },
  duration: 24 * 60 * 60 * 1000,
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRandomWidth = (possibleWidths: number[]) => {
  const randomIndex = Math.floor(Math.random() * possibleWidths.length);
  return possibleWidths[randomIndex];
};

export function getWeek(startingDate: Date, shift: number) {
  const weekDates = [];
  const sunday = new Date(startingDate);
  sunday.setDate(startingDate.getDate() - startingDate.getDay() + shift * 7);

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(sunday);
    currentDate.setDate(sunday.getDate() + i);
    weekDates.push(currentDate);
  }

  return weekDates;
}

export function getMonth(shift: number, line: number) {
  const now = new Date();
  let month = now.getMonth();
  let year = now.getFullYear();
  month = Math.floor(month) + shift;
  const firstDayOfTheMonth = new Date(year, month, 1).getDay();
  let currentMonthCount = 1 - firstDayOfTheMonth;

  const daysMatrix = new Array(line).fill([]).map(() => {
    return new Array(7).fill(null).map(() => {
      const date = new Date(year, month, currentMonthCount);
      currentMonthCount++;
      return date;
    });
  });

  return daysMatrix;
}

export function getDates(startDate: Date, endDate: Date): Date[] {
  var dateArray: Date[] = [];

  const start = new Date(startDate);

  while (start <= endDate) {
    dateArray.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }

  return dateArray.sort((a, b) => b.getTime() - a.getTime());
}

export function showLateMinutesAndHours(cu: Date, att: Date) {
  const currentTime = new Date(cu);
  const attendanceTime = new Date(att);
  var diffTime = currentTime.getTime() - attendanceTime.getTime();
  if (diffTime < 0) {
    diffTime = -diffTime;
    var hours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((diffTime / (1000 * 60)) % 60);
    return { hours, minutes, status: "late" };
  } else {
    var hours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((diffTime / (1000 * 60)) % 60);
    return { hours, minutes, status: "early" };
  }
}

const gettingCommon = (
  attendance: AttendanceType | undefined,
  shift:
    | {
        date: Date;
        schedule: ScheduleType | undefined;
        status: string | undefined;
      }
    | undefined
) => {
  const attendanceDate = new Date(attendance?.date || Date.now());

  const shiftStartTime =
    shift?.schedule &&
    shift?.status === "Working Day" &&
    new Date(
      `${dayjs(shift.date).format("YYYY-MM-DD")} ${shift.schedule.from}`
    );

  return { attendanceDate, shiftStartTime };
};

export const gettingColorForAttendanceColor = (
  attendance: AttendanceType | undefined,
  shift: ShiftType | undefined
) => {
  const { attendanceDate, shiftStartTime } = gettingCommon(attendance, shift);

  const leaveColor = attendance?.leave?.color;

  attendanceDate.setDate(attendanceDate.getDate() + 1);

  const missedCheckOut =
    attendance?.status === "Arrived" &&
    attendance?.checkIn?.time &&
    !attendance?.checkOut?.time &&
    attendanceDate.getTime() < new Date().getTime();

  const missedCheckIn =
    attendance?.status === "Arrived" &&
    attendance?.checkOut?.time &&
    !attendance?.checkIn?.time &&
    attendanceDate.getTime() < new Date().getTime();

  return leaveColor
    ? leaveColor
    : !attendance?.checkOut?.time &&
        !attendance?.checkIn?.time &&
        shiftStartTime &&
        new Date().getTime() > shiftStartTime.getTime()
      ? { back: "rgb(221,63,79)", text: "#fff" }
      : missedCheckIn || missedCheckOut
        ? { back: "#504c67", text: "#fff" }
        : {
            back: statusColors[attendance?.status || "no status"],
            text: "#fff",
          };
};

export const getShiftEnd = (schedule: ScheduleType, date: Date) => {
  const [fromHours, fromMinutes] = schedule.from.split(":").map(Number);
  const [toHours, toMinutes] = schedule.to.split(":").map(Number);

  const startDate = new Date(date);
  startDate.setHours(fromHours, fromMinutes);

  let endDate = new Date(date);
  endDate.setHours(toHours, toMinutes);

  if (
    toHours < fromHours ||
    (toHours === fromHours && toMinutes < fromMinutes)
  ) {
    endDate.setDate(endDate.getDate() + 1);
  }

  return endDate;
};

export const getDaysBetweenDates = (startDate: Date, endDate: Date) => {
  const dateArray = [];
  let currentDate = dayjs(startDate);

  while (currentDate.valueOf() <= endDate.valueOf()) {
    dateArray.push(dayjs(currentDate).format("YYYY-MM-DD"));
    currentDate = dayjs(currentDate).add(1, "day");
  }
  return dateArray;
};

export const initialLeaveData = (index: number) => ({
  index,
  _id: "",
  from: new Date(),
  to: undefined,
  isPublicHoliday: false,
  status: "pending",
  attendedFiles: [],
});
