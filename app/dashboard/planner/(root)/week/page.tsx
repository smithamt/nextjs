"use client";
import { useInfiniteData } from "@/app/_hook/useInfiniteData";
import ShowNoText from "@/components/app/nodata";
import ProfileLoading from "@/components/loadings/profile";
import EmployeeProfile from "@/components/profile/page";
import { getWeek } from "@/lib/utils";
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
import { usePopover } from "../../_contexts/popover/popover";
import WeekClient from "../_components/week";

function PlannerWeek() {
  const params = useSearchParams();
  const searchParams = Object.fromEntries(params);
  const { next = "0" } = searchParams;
  const { data: p } = usePopover();
  const {
    data: employees,
    loading,
    queryKey,
    lastElementRef,
  } = useInfiniteData<EmployeeType>({
    keys: "employees",
    size: 20,
    params: {
      department: searchParams.department,
      position: searchParams.position,
      branch: searchParams.branch,
      search: searchParams.search,
    },
  });

  const week = getWeek(new Date(), Number(next || "0"));
  const employeeIds = employees.map((i) => i._id);

  const queryClient = useQueryClient();

  const attendanceKey = ["planner-attendances", next, employeeIds];
  const { data = [], isLoading: attendanceLoading } = useQuery({
    queryKey: attendanceKey,
    queryFn: async () => {
      const response = await fetch(
        `/api/attendances?employees=${employeeIds}&next=${next}`
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

      //@ts-ignore
      const newAttendances = infiniteData.map((s) => {
        const sameEmployee =
          p.employee?._id === (s.attendance?.employee || s.shift?.employee);
        const sameDate =
          dayjs(s.shift?.date || s.attendance?.date).format("YYYY-MM-DD") ===
          dayjs(p.date).format("YYYY-MM-DD");

        return sameEmployee && sameDate
          ? data.title === "attendances"
            ? { attendance: data, shift: s.shift }
            : { shift: data, attendance: s.attendance }
          : s;
      });

      if (infiniteData) queryClient.setQueryData(attendanceKey, newAttendances);
    },
  });

  const updateData = (data: UpdateDataType) => mutate(data);

  return (
    <div className="w-full h-[calc(100%-40px)] border-t border-l overflow-y-auto">
      <div className="w-full h-full overflow-y-auto">
        {loading ? (
          <div className="h-full border-l">
            <ProfileLoading />
            <ProfileLoading />
            <ProfileLoading />
          </div>
        ) : (
          employees.length <= 0 && (
            <div className="min-h-full center">
              <ShowNoText>No Employee found</ShowNoText>{" "}
            </div>
          )
        )}
        {employees.map((employee, index) => {
          return (
            <div className="flex w-full" key={index}>
              <div className="w-40 border-r border-b p-2">
                <EmployeeProfile
                  to={`/dashboard/planner/month/${employee.employeeId || employee._id}`}
                  employee={employee}
                />
              </div>
              <WeekClient
                updateData={updateData}
                loading={attendanceLoading}
                key={index}
                employee={employee}
                attendances={data.reduce((acc, a) => {
                  if (a.attendance !== undefined) acc.push(a.attendance);
                  return acc;
                }, [] as AttendanceType[])}
                shifts={data.reduce((acc, a) => {
                  if (a.shift !== undefined) acc.push(a.shift);
                  return acc;
                }, [] as ShiftType[])}
                week={week}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlannerWeek;
