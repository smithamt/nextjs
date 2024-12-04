"use client";
import SpinLoading from "@/components/loadings/spinloading";
import {
  AttendanceType,
  EmployeeType,
  ShiftType,
  UpdateDataType,
} from "@/types";
import dayjs from "dayjs";
import DayAttendance from "../../_components/dayattendance";

function WeekClient({
  week,
  attendances,
  shifts,
  employee,
  loading,
  updateData,
}: {
  week: Date[];
  attendances: AttendanceType[];
  shifts: ShiftType[];
  employee: EmployeeType;
  loading: boolean;
  updateData: (data: UpdateDataType) => void;
}) {
  const attendanceMap = new Map<string, Map<string, AttendanceType>>();
  const shiftMap = new Map<string, Map<string, ShiftType>>();

  attendances.forEach((attendance) => {
    const dateKey = dayjs(attendance.date).format("YYYY-MM-DD");
    if (!attendanceMap.has(attendance.employee.toString())) {
      attendanceMap.set(attendance.employee.toString(), new Map());
    }
    attendanceMap.get(attendance.employee.toString())?.set(dateKey, attendance);
  });

  shifts.forEach((shift) => {
    const dateKey = dayjs(shift.date).format("YYYY-MM-DD");
    if (!shiftMap.has(shift.employee.toString())) {
      shiftMap.set(shift.employee.toString(), new Map());
    }
    shiftMap.get(shift.employee.toString())?.set(dateKey, shift);
  });

  return (
    <div className="flex w-[calc(100%-160px)] h-24 border-b">
      {loading ? (
        <SpinLoading />
      ) : (
        week.map((day, dayindex) => {
          const dateKey = dayjs(day).format("YYYY-MM-DD");
          const attendance = attendanceMap
            .get(employee._id.toString())
            ?.get(dateKey);

          const shift = shiftMap.get(employee._id.toString())?.get(dateKey);

          return (
            <DayAttendance
              updateAttendance={(data) =>
                updateData({ ...data, title: "attendances" })
              }
              updateShift={(data) => updateData({ ...data, title: "shifts" })}
              key={dayindex}
              date={day}
              shift={shift}
              attendance={attendance}
              employee={employee}
            />
          );
        })
      )}
    </div>
  );
}

export default WeekClient;
