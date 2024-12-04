import { cn, gettingColorForAttendanceColor } from "@/lib/utils";
import { roles, SHOW_ATTENDANCE_EDITING } from "@/roles";
import { AttendanceType, EmployeeType, ShiftType } from "@/types";
import dayjs from "dayjs";
import { useMemo } from "react";
import { MdFingerprint } from "react-icons/md";
import { usePopover } from "../_contexts/popover/popover";

function showLateMinutesAndHours(
  cu: any,
  att: any
): { hours: number; minutes: number; status: "late" | "early" } {
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

function convertIso(timeString: string, date: Date) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const today = new Date(date);
  today.setHours(hours, minutes, 0);
  return today.toISOString();
}

function timeDifference(from: Date, to: Date | undefined) {
  var start = dayjs(from);
  var end = dayjs(to ?? new Date());

  const totalMinutes = end.diff(start, "minute");
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}

function DayAttendance({
  date,
  attendance,
  shift,
  employee,
  updateAttendance,
  updateShift,
}: {
  date: Date;
  employee: EmployeeType;
  attendance: AttendanceType | undefined;
  shift: ShiftType | undefined;
  updateAttendance: (data: AttendanceType) => void;
  updateShift: (data: ShiftType) => void;
}) {
  const { setData, data, handleContextMenu } = usePopover();
  const color = gettingColorForAttendanceColor(attendance, shift);

  const serviceHour = useMemo(() => {
    if (shift?.schedule) {
      var start = dayjs(`2022-01-01T${shift?.schedule.from}.000Z`);
      var end = dayjs(`2022-01-01T${shift?.schedule.to}.000Z`);

      if (start.isAfter(end)) {
        end = end.add(1, "day");
      }

      var diff = end.diff(start);
      var diffInHours = Math.floor(diff / 1000 / 60 / 60);
      return diffInHours;
    }
  }, [shift?.schedule]);

  const late = useMemo(() => {
    const foundRole = roles.find((r) => r.name === employee?.role);

    return (
      shift?.schedule &&
      attendance?.checkIn?.time &&
      shift &&
      showLateMinutesAndHours(
        convertIso(shift?.schedule.from, shift?.date),
        attendance.checkIn.method === "planner" &&
          foundRole?.attendances?.includes(SHOW_ATTENDANCE_EDITING)
          ? attendance.createdAt
          : attendance.checkIn.time
      )
    );
  }, [attendance, shift]);

  const lateHours = useMemo(
    () =>
      late &&
      late.status === "late" &&
      serviceHour &&
      ((late.hours * 60 + late.minutes) / 60) * (100 / serviceHour),
    [late, serviceHour]
  );

  const employeeServiceHours = useMemo(
    () =>
      attendance?.checkIn?.time &&
      timeDifference(attendance.checkIn?.time, attendance.checkOut?.time),
    [attendance]
  );

  const getWidthWithPercent = useMemo(
    () =>
      serviceHour && employeeServiceHours && attendance?.checkIn?.time
        ? (serviceHour -
            (employeeServiceHours.hours * 60 + employeeServiceHours.minutes) /
              60) *
          (100 / serviceHour)
        : 0,
    [serviceHour, employeeServiceHours]
  );

  const openPopover = (e: any) => {
    const data = {
      open: true,
      date,
      sideOffset: 5,
      attendance,
      shift,
      employee,
      updateAttendance,
      updateShift,
    };
    setData(data);
    handleContextMenu(e);
  };

  return (
    <div
      onContextMenu={openPopover}
      onClick={openPopover}
      className="flex-1 hover w-full h-full border-r flex flex-col relative"
    >
      <div
        style={{
          backgroundColor:
            shift?.status === "Copy"
              ? "#fff"
              : shift?.status === "Off"
                ? "#348aa7"
                : shift?.schedule?.color.back,
          color: shift?.status === "Off" ? "#fff" : shift?.schedule?.color.text,
        }}
        className="center text-[12px] h-6"
      >
        <p className="text-center">
          {shift?.status === "Off" ? shift.status : shift?.schedule?.name}
        </p>
      </div>
      {date && (
        <p className="text-center inactive-text absolute  inset-0 flex justify-center items-center">
          {dayjs(date).format("D")}
        </p>
      )}
      <div
        style={{
          backgroundColor: color?.back,
          color: color?.text,
        }}
        className={cn(
          "text-white bg-blue-500 text-[11px] h-6 mt-auto w-full flex relative",
          shift?.status === "Evening Half Off" ? "bg-blue-500" : "bg-red-500"
        )}
      >
        {lateHours && lateHours > 0 ? (
          <div
            style={{ width: `${lateHours}%` }}
            className={cn(
              "w-2 h-full",
              shift?.status === "Morning Half Off"
                ? "bg-blue-500"
                : "bg-red-500"
            )}
          />
        ) : (
          ""
        )}
        {(attendance?.checkIn?.time || attendance?.checkOut?.time) && (
          <div
            style={{
              width:
                getWidthWithPercent > 0
                  ? `${100 - getWidthWithPercent}%`
                  : "100%",
            }}
            className={cn("bg-green-600 h-full")}
          />
        )}
        <div className="absolute flex w-full items-center h-full">
          <p className="h-full whitespace-nowrap hidden xl:flex xl:items-center flex-1">
            {attendance?.checkIn?.method === "fingerprint" && (
              <MdFingerprint size={16} />
            )}
            {attendance?.checkIn?.time &&
              dayjs(attendance?.checkIn?.time).format("hh:mm A")}
          </p>
          <p className="h-full center whitespace-nowrap flex-1">
            {attendance?.status}
          </p>
          <p className="h-full whitespace-nowrap hidden xl:flex xl:items-center flex-1">
            {attendance?.checkOut?.method === "fingerprint" && (
              <MdFingerprint size={16} />
            )}
            {attendance?.checkOut?.time &&
              dayjs(attendance?.checkOut?.time).format("hh:mm A")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default DayAttendance;
