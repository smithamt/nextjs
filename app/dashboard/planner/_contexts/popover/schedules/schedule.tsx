import { usePopup } from "@/app/_context/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "@/constants/app/axios";
import { ScheduleType, ShiftType } from "@/types";
import dayjs from "dayjs";
import { ChevronRight, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { DataType } from "../popover";
import MultipleDayPopup from "./choosemultipleday";

function SchedulePopupDetail({
  data,
  schedule,
}: {
  data: DataType;
  schedule: ScheduleType;
}) {
  const [loading, setLoading] = useState(false);
  const { setPopup, closeDialog } = usePopup();

  const chooseDays = (p: number | "end") => {
    let numDays = typeof p === "number" ? p : 0;
    let today = data?.date ? new Date(data.date) : new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    if (p === "end") numDays = new Date(year, month + 1, 0).getDate();

    let dates: string[] = [];
    for (
      let i = p === "end" ? today.getDate() : 0;
      i <= numDays - (p === "end" ? 0 : 1);
      i++
    ) {
      const date = new Date(year, month, p === "end" ? i : today.getDate() + i);
      dates.push(dayjs(date).format("YYYY-MM-DD"));
    }
    return dates;
  };

  const choose = (status: any, schedule: ScheduleType) => {
    if (!data.employee) return;
    const dates = chooseDays(status);
    setPopup({
      title: "Schedule Setup " + schedule?.name,
      className: "w-[450px]",
      children: (
        <MultipleDayPopup
          employee={data.employee}
          schedule={schedule}
          dates={dates}
          onUpdateData={data.updateShift}
          color={schedule.color}
        />
      ),
    });
  };

  return (
    <div className="flex items-center justify-between cursor-pointer hover">
      <DropdownMenuItem asChild>
        <button
          disabled={loading}
          onClick={async (e) => {
            if (!data.employee || !data.date) return;
            const newShift = data.shift
              ? { ...data.shift, schedule, status: "Working day" }
              : {
                  schedule,
                  date: data.date,
                  employee: data.employee._id,
                  status: "Working Day",
                  _id: "123",
                  new: true,
                };

            data.updateShift(newShift as ShiftType);
            data.updateAttendance(
              //@ts-ignore
              data.attendance
                ? {
                    ...data.attendance,
                    status: data.attendance
                      ? data.attendance.status
                      : "Working Day",
                  }
                : newShift
            );
            const shi = {
              employee: data.employee._id,
              date: data.date.toISOString(),
              status: "Working Day",
              schedule: schedule._id,
            };
            try {
              setLoading(true);
              await axios.post(`/api/shifts`, shi);
              closeDialog();
              setLoading(false);
            } catch (error) {
              setLoading(false);
            }
            e.stopPropagation();
          }}
          className="flex items-center w-full h-full p-2"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Mail className="mr-2 h-4 w-4" />
          )}
          <span>{schedule.name}</span>
        </button>
      </DropdownMenuItem>
      <Popover>
        <PopoverTrigger className="px-2">
          <ChevronRight className="w-4" />
        </PopoverTrigger>
        <PopoverContent className="w-40 p-1" side="right">
          <p className="font-semibold px-2">{schedule.name}</p>
          {[5, 7, 10, 15].map((i, k) => {
            return (
              <p
                onClick={() => choose(i, schedule)}
                className="hover:text-yellow-500 p-1 px-2 rounded-sm hover"
                key={k}
              >
                Next {i} days
              </p>
            );
          })}
          <p
            onClick={() => choose("end", schedule)}
            className="hover:text-yellow-500 p-1 px-2 rounded-sm hover"
          >
            End month
          </p>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default SchedulePopupDetail;
