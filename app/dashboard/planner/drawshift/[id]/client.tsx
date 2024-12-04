"use client";
import { usePopup } from "@/app/_context/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/constants/app/axios";
import { cn, getDaysBetweenDates, getMonth } from "@/lib/utils";
import { EmployeeType, ScheduleType, ShiftType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useMemo, useState } from "react";
import PopupMembers from "./members";

const line = 6;
function DrawShiftClient({
  employee: e,
  schedules: s,
}: {
  employee: string;
  schedules: string;
}) {
  const employee = JSON.parse(e) as EmployeeType;
  const schedules = JSON.parse(s) as ScheduleType[];
  const [loading, setLoading] = useState(false);
  const [selectStartDate, setSelectStartDate] = useState<string | null>(null);
  const [selectEndDate, setSelectEndDate] = useState<string | null>(null);
  const [reallyUpdate, setReallyUpdate] = useState<ShiftType[]>([]);
  const [selectOff, setSelectOff] = useState<"Off" | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleType | null>(
    null
  );
  const searchParams = useSearchParams();
  const next = Number(searchParams.get("next") || "0");
  const daysMatrix = getMonth(next ? Number(next) : 0, 6);
  const startDate = daysMatrix[0][0];
  const endDate = daysMatrix[line - 1][6];
  const router = useRouter();
  const { toast } = useToast();
  const { setPopup, closeDialog } = usePopup();

  const { data: shifts = [], isLoading: shiftLoading } = useQuery({
    queryKey: [
      "planner-employee-shifts",
      startDate.toISOString(),
      endDate.toISOString(),
      employee._id,
    ],
    queryFn: async () => {
      const response = await fetch(
        `/api/shifts/employee/${employee._id}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      const data = await response.json();
      return data as ShiftType[];
    },
  });

  const dateRange = useMemo(() => {
    return selectStartDate && selectEndDate
      ? getDaysBetweenDates(new Date(selectStartDate), new Date(selectEndDate))
      : [];
  }, [selectEndDate, selectStartDate]);

  const shiftMap = new Map<string, ShiftType>();
  const reallyUpdateMap = new Map<string, ShiftType>();

  shifts.forEach((shift) => {
    const dateKey = dayjs(shift.date).format("YYYY-MM-DD");
    if (!shiftMap.has(dateKey)) {
      shiftMap.set(dateKey, shift);
    }
  });

  reallyUpdate.forEach((shift) => {
    const dateKey = dayjs(shift.date).format("YYYY-MM-DD");
    if (!shiftMap.has(dateKey)) {
      shiftMap.set(dateKey, shift);
    }
  });

  const setMultipleEmployee = () => {
    setPopup({
      title: "Choose Another Employees to set this schedule",
      children: (
        <PopupMembers
          onConfirm={async (dataEmployees) => {
            setLoading(true);
            console.log("really update", reallyUpdate);
            const data = {
              employees: [employee, ...dataEmployees.map((i) => i._id)],
              data: reallyUpdate.map((i) => ({
                ...i,
                schedule: i.schedule?._id,
              })),
            };

            try {
              const response = await axios.post(`/api/shifts/drawshift`, data);
              closeDialog();
              setLoading(false);
              console.log("response", response.data);
            } catch (error) {
              console.log(
                "error when creating draw shift with multiple employee",
                error
              );
              //@ts-ignore
              setError(error.response.data.message || error.message);
              setLoading(false);
            }
          }}
          fetchQuery={undefined}
          initialData={[]}
        />
      ),
    });
  };

  const bulkCreate = async () => {
    setLoading(true);
    const data = {
      employees: [employee],
      data: reallyUpdate.map((i) => ({ ...i, schedule: i.schedule?._id })),
    };
    try {
      const response = await axios.post(`/api/shifts/drawshift`, data);
      router.back();
      setLoading(false);
      console.log("response", response.data);
    } catch (error: any) {
      setLoading(false);
      console.log("error in bulk create", error);
      toast({
        title: "Error found",
        description: error.response.data?.error ?? error.message,
      });
    }
  };

  return (
    <div className="w-full h-full cart-bg">
      <div className="w-full h-14 justify-end gap-2 p-2 flex items-center">
        <Button
          disabled={loading}
          variant="outline"
          onClick={setMultipleEmployee}
          className="px-4 shadow-sm py-2 rounded-lg border mr-4 hover"
        >
          Set to multiple employees
        </Button>
        <Button disabled={loading} variant={"outline"}>
          Cancel
        </Button>
        <Button disabled={loading} onClick={bulkCreate}>
          Publish Now
        </Button>
      </div>
      <div className="w-full h-[calc(100%-56px)] p-2 border flex">
        <div className="flex-1 h-full w-full relative">
          <div className="flex">
            {daysMatrix[0].map((day, index) => {
              return (
                <p
                  key={index}
                  className="flex-1 border-b font-semibold h-[40px] center"
                >
                  {dayjs(day).format("ddd")}
                </p>
              );
            })}
          </div>
          {!selectedSchedule && !selectOff && (
            <div className="h-[calc(100%-100px)] w-full absolute center font-bold text-2xl">
              Choose Month & Choose Schedule
            </div>
          )}
          <div
            className={cn("grid grid-cols-7 grid-rows-6 h-[calc(100%-40px)]")}
          >
            {daysMatrix.map((week, index) => {
              return (
                <Fragment key={index}>
                  {week.map((day, dayindex) => {
                    const dateKey = dayjs(day).format("YYYY-MM-DD");
                    const toUpdate = reallyUpdateMap.get(dateKey);
                    const shift = toUpdate || shiftMap.get(dateKey);

                    const onClick = () => {
                      if (selectOff) {
                        const existShift = reallyUpdate.some(
                          (s) => dayjs(s.date).format("YYYY-MM-DD") === dateKey
                        );
                        setReallyUpdate(
                          //@ts-ignore
                          existShift
                            ? reallyUpdate.map((s) =>
                                dayjs(s.date).format("YYYY-MM-DD") === dateKey
                                  ? { ...s, status: "Off" }
                                  : s
                              )
                            : [
                                ...reallyUpdate,
                                {
                                  date: `${dateKey}T00:00:00.000Z`,
                                  schedule: selectedSchedule,
                                  status: "Off",
                                },
                              ]
                        );
                        return;
                      }
                      if (!selectedSchedule) return;
                      !selectStartDate && setSelectStartDate(dateKey);
                      if (!selectStartDate) return;
                      const dataArray: any[] = [];
                      dateRange.forEach((date) => {
                        const data = {
                          date: `${date}T00:00:00.000Z`,
                          schedule: selectedSchedule,
                          status: "Working Day",
                        };
                        dataArray.push(data);
                      });
                      setSelectStartDate(null);

                      const updatedReallyUpdate = [...reallyUpdate];

                      dataArray.forEach((newItem) => {
                        const existingIndex = updatedReallyUpdate.findIndex(
                          (item) => {
                            console.log(item.date === newItem.date);
                            return item.date === newItem.date;
                          }
                        );

                        if (existingIndex !== -1) {
                          updatedReallyUpdate[existingIndex] = newItem;
                        } else {
                          updatedReallyUpdate.push(newItem);
                        }
                      });

                      setReallyUpdate(updatedReallyUpdate);
                      if (selectEndDate) setSelectEndDate(null);
                      if (selectOff) setSelectOff(null);
                    };

                    const isStart = selectStartDate === dateKey;
                    const isEnd = selectEndDate === dateKey;

                    return (
                      <div
                        onClick={onClick}
                        style={{
                          backgroundColor:
                            shift?.status === "Off"
                              ? "#348aa7"
                              : shift?.schedule?.color.back,
                          color:
                            shift?.status === "Off"
                              ? "#fff"
                              : shift?.schedule?.color.text,
                        }}
                        onMouseEnter={() => {
                          if (selectStartDate) setSelectEndDate(dateKey);
                        }}
                        key={dayindex}
                        className={cn(
                          "flex-1 hover w-full h-full border-r flex flex-col relative border-b",
                          !selectedSchedule && !selectOff && "opacity-15",
                          isStart && "border border-red-500",
                          isEnd && "border border-red-500"
                        )}
                      >
                        <p className="text-center text-xs">
                          {shift?.status === "Off"
                            ? shift.status
                            : shift?.schedule?.name}
                        </p>
                        <p className="text-center inactive-text absolute  inset-0 flex justify-center items-center">
                          {dayjs(day).format("D")}
                        </p>
                      </div>
                    );
                  })}
                </Fragment>
              );
            })}
          </div>
        </div>
        <div className="w-1/5 h-full">
          <div className="px-2 pt-2">
            <Input placeholder="Search..." className="" />
          </div>
          <div className="p-2 mt-1 h-[calc(100%-150px)] flex flex-col gap-1 overflow-y-auto">
            <p
              onClick={() => setSelectOff("Off")}
              className={cn(
                "p-2 rounded-md shadow-sm bg-[#348aa7] text-white",
                selectOff ? "border border-yellow-500" : "border-none"
              )}
            >
              Off
            </p>
            {schedules.map((schedule, index) => {
              const select = schedule._id === selectedSchedule?._id;
              return (
                <div
                  style={{
                    backgroundColor: schedule.color.back,
                    color: schedule.color.text,
                  }}
                  key={index}
                  className={cn(
                    "p-2 hover rounded-md border-1 shadow-sm hover:opacity-[50] border transition-all duration-100 ease-in-out",
                    select && "border border-yellow-500"
                  )}
                  onClick={() => {
                    setSelectedSchedule(schedule);
                    setSelectOff(null);
                  }}
                >
                  {schedule.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DrawShiftClient;
