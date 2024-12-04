import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePickerDemo({
  disableDates,
  setState,
  date,
}: {
  disableDates: (date: Date) => boolean;
  setState: (date: Date) => void;
  date: Date | undefined;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-[40px] rounded-md justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          disabled={disableDates}
          mode="single"
          selected={date}
          //@ts-ignore
          onSelect={(date) => {
            console.log("date", date);
            date && setState(date);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
