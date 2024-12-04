import PaginationComponent from "@/components/app/pagination";
import OpenDateRange from "@/components/others/OpenDateRange";
import ExportBtn from "@/components/page";
import { getEmployeeQuery } from "@/data/employees";
import { getUser } from "@/data/user";
import { getDates, showLateMinutesAndHours } from "@/lib/utils";
import { ADMIN } from "@/roles";
import { AttendanceType, ShiftType } from "@/types";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import PlannerDayClient from "./client";
import ShiftModel from "@/models/shifts/model";
import AttendanceModel from "@/models/attendances/model";
import EmployeeModel from "@/models/employees/model";
import TableColumnModel from "@/models/tables/model";
dayjs.extend(duration);

type QueryProps = {
  employees: string[];
  startDate: Date;
  endDate: Date;
};

const fetchAttendances = async ({
  employees,
  startDate,
  endDate,
}: QueryProps) => {
  const attendances = await AttendanceModel.find({
    employee: { $in: employees },
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  }).lean();
  return attendances as AttendanceType[];
};

const fetchShifts = async ({ employees, startDate, endDate }: QueryProps) => {
  const shifts = await ShiftModel.find({
    employee: { $in: employees },
    date: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .populate("schedule", "name from to")
    .lean();

  return shifts as ShiftType[];
};

async function PlannerManageDay({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const employeeQuery = await getEmployeeQuery(searchParams, "planner");
  const employees = await EmployeeModel.find(employeeQuery).populate({
    path: "position department",
    select: "name",
  });
  const next = Number(searchParams.next || "0");
  const startDate = new Date((searchParams.startDate as string) || Date.now());
  const endDate = new Date((searchParams.endDate as string) || Date.now());

  startDate.setDate(startDate.getDate() + next);
  startDate.setHours(0, 0, 0, 0);
  endDate.setDate(endDate.getDate() + next);
  endDate.setHours(23, 59, 59, 999);

  const attendances = await fetchAttendances({
    employees: employees.map((i) => i._id),
    startDate,
    endDate,
  });

  const shifts = await fetchShifts({
    employees: employees.map((i) => i._id),
    startDate,
    endDate,
  });

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

  const dates = getDates(startDate, endDate);

  const data = dates
    .map((date) => {
      return employees.map((employee) => {
        const dateKey = dayjs(date).format("YYYY-MM-DD");
        const attendance = attendanceMap
          .get(employee._id.toString())
          ?.get(dateKey);
        const shift = shiftMap.get(employee._id.toString())?.get(dateKey);
        const checkInTime = attendance?.checkIn?.time;
        const checkOutTime = attendance?.checkOut?.time;

        let late;
        let earlyOut;

        if (checkInTime && shift?.schedule) {
          const shiftStartTime = new Date(
            `${dayjs(shift.date).format("YYYY-MM-DD")}T${shift.schedule.from}`
          );

          const latObj = showLateMinutesAndHours(shiftStartTime, checkInTime);
          if (latObj.hours || latObj.minutes)
            late = `${latObj.hours.toString().padStart(2, "0")}:${latObj.minutes
              .toString()
              .padStart(2, "0")} ${latObj.status}`;
        }

        if (checkOutTime && shift?.schedule) {
          const shiftEndTime = new Date(
            `${dayjs(shift.date).format("YYYY-MM-DD")}T${shift.schedule.to}`
          );

          const latObj = showLateMinutesAndHours(shiftEndTime, checkOutTime);
          if (latObj.hours || latObj.minutes)
            earlyOut = `${latObj.hours
              .toString()
              .padStart(2, "0")}:${latObj.minutes
              .toString()
              .padStart(2, "0")} ${latObj.status}`;
        }

        const data: any = {
          _id: attendance?._id || "",
          date: dayjs(date).format("YYYY-MM-DD"),
          name: employee.name,
          employeeId: employee.employeeId,
          position: employee.position?.name,
          schedule: shift?.schedule?.name,
          checkIn: checkInTime ? dayjs(checkInTime).format("hh:mm A") : "",
          checkOut: checkOutTime ? dayjs(checkOutTime).format("hh:mm A") : "",
          late,
          earlyOut,
          status: attendance?.status || shift?.status,
        };

        if (ADMIN === user.role) data.department = employee.department?.name;

        return data;
      });
    })
    .flat();

  const { page = "1", size = "10" } = searchParams;
  const start = (Number(page) - 1) * Number(size);
  const normaldata = data.slice(start, Number(page) * Number(size));

  const tableColumn = await TableColumnModel.findOne({
    employee: user._id,
    title: "attendances",
  });

  return (
    <div className="w-full h-[calc(100%-50px)]">
      <div className="flex justify-between items-center p-2">
        <p className="font-bold text-lg">Attendances List</p>
        <div className="flex items-center space-x-2">
          <OpenDateRange />
          <ExportBtn data={JSON.stringify(data)} title={"attendances"} />
        </div>
      </div>
      <div className="w-full h-[calc(100%-50px)]">
        <PlannerDayClient
          data={JSON.stringify(normaldata)}
          saveColumns={JSON.stringify(tableColumn ? tableColumn.columns : [])}
        />
      </div>
      <PaginationComponent count={data.length} initialSize={10} />
    </div>
  );
}

export default PlannerManageDay;
