"use client";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

function DateRangeComponent({
  onSelectDate,
  date,
  setDate,
  disableDates,
}: {
  onSelectDate: (value: DateRange | undefined) => void;
  date: DateRange | undefined;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  disableDates?: (date: Date) => boolean;
}) {
  const [open, setOpen] = React.useState(false);

  const totalDay =
    date?.from && date.to
      ? Math.ceil(
          (date.to.getTime() - date.from.getTime() + 1) / (1000 * 60 * 60 * 24)
        )
      : 0;

  return (
    <div className={cn("grid gap-2 w-full h-full")}>
      <Popover onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full h-[40px] rounded-md justify-start text-left font-normal items-center",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
            {totalDay ? ` (${totalDay} days)` : ""}

            <ChevronDown
              className={cn(
                "w-4 ml-2 dropdown-icon",
                open && "dropdown-icon-animate"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 mx-4" align="start">
          <Calendar
            disabled={disableDates}
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(value) => {
              onSelectDate(value);
              setDate(value);
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DateRangeComponent;
