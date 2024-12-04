"use client";
import SpinLoading from "@/components/loadings/spinloading";
import { getMonth } from "@/lib/utils";
import {
  AttendanceType,
  EmployeeType,
  PlannerResponseType,
  ShiftType,
  UpdateDataType,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import DayAttendance from "../../../_components/dayattendance";
import { usePopover } from "../../../_contexts/popover/popover";

const line = 6;
function PlannerMonthClient({ employee: e }: { employee: string }) {
  const queryClient = useQueryClient();
  const employee = JSON.parse(e) as EmployeeType;
  const searchParams = useSearchParams();
  const next = Number(searchParams.get("next") || "0");
  const daysMatrix = getMonth(next ? Number(next) : 0, 6);
  const startDate = daysMatrix[0][0];
  const endDate = daysMatrix[line - 1][6];

  const { data: p } = usePopover();

  const attendanceKey = [
    "planner-employee-attendances",
    startDate.toISOString(),
    endDate.toISOString(),
    employee._id,
  ];

  const { data = [], isLoading: attendanceLoading } = useQuery({
    queryKey: attendanceKey,
    queryFn: async () => {
      const response = await fetch(
        `/api/attendances/employee/${employee._id}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      const data = await response.json();
      return data as PlannerResponseType[];
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (data: UpdateDataType) => data,
    onSuccess: (data: UpdateDataType) => {
      const infiniteData = queryClient.getQueryData(
        attendanceKey
      ) as PlannerResponseType[];

      console.log("need to update attendance", data);
      //@ts-ignore
      const newAttendances = infiniteData.map((s) => {
        const sameDate =
          dayjs(s.shift?.date || s.attendance?.date).format("YYYY-MM-DD") ===
          dayjs(p.date).format("YYYY-MM-DD");
        if (data.title === "attendances") {
          console.log("data", sameDate);
          return sameDate ? { attendance: data, shift: s.shift } : s;
        } else if (data.title === "shifts") {
          return sameDate ? { shift: data, attendance: s.attendance } : s;
        }
      });

      if (infiniteData) queryClient.setQueryData(attendanceKey, newAttendances);
    },
  });

  const updateData = (data: UpdateDataType) => mutate(data);

  const attendanceMap = new Map<string, AttendanceType>();
  const shiftMap = new Map<string, ShiftType>();

  data
    .map((i) => i.attendance)
    .filter((i) => i)
    .forEach((attendance) => {
      const dateKey = dayjs(attendance?.date).format("YYYY-MM-DD");
      if (attendance && !attendanceMap.has(dateKey)) {
        attendanceMap.set(dateKey, attendance);
      }
    });

  data
    .map((i) => i.shift)
    .filter((i) => i)
    .forEach((shift) => {
      const dateKey = dayjs(shift?.date).format("YYYY-MM-DD");
      if (shift && !shiftMap.has(dateKey)) {
        shiftMap.set(dateKey, shift);
      }
    });

  const loading = attendanceLoading;

  return (
    <div className="w-full h-full cart-bg border">
      {loading ? (
        <SpinLoading />
      ) : (
        daysMatrix.map((week, index) => {
          return (
            <div className="flex h-[calc(100%/6)] w-full" key={index}>
              {week.map((day, dayindex) => {
                const dateKey = dayjs(day).format("YYYY-MM-DD");
                const attendance = attendanceMap.get(dateKey);
                const shift = shiftMap.get(dateKey);

                return (
                  <DayAttendance
                    key={dayindex}
                    employee={employee}
                    date={day}
                    attendance={attendance}
                    shift={shift}
                    updateAttendance={(data) =>
                      updateData({ title: "attendances", ...data })
                    }
                    updateShift={(data) =>
                      updateData({ title: "shifts", ...data })
                    }
                  />
                );
              })}
            </div>
          );
        })
      )}
    </div>
  );
}

export default PlannerMonthClient;
