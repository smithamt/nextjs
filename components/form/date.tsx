import { Calendar as CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { FC } from "react";

function checkValidDate(dateString: string) {
  return dayjs(dateString).isValid();
}

interface DatePickerProps {
  date: Date;
  setDate: (date: Date | undefined) => void;
  disableDate?: (date: Date) => boolean;
}

const DatePicker: FC<DatePickerProps> = ({ date, setDate, disableDate }) => {
  return (
    <Popover>
      <div
        className={cn(
          "w-full text-left cart-bg font-normal border rounded-sm flex items-center justify-between h-[36px] mt-1",
          !date && "text-muted-foreground"
        )}
      >
        <input
          className="px-2"
          value={dayjs(date).format("YYYY-MM-DD")}
          type="date"
          onChange={(e) => {
            if (checkValidDate(e.target.value))
              setDate(new Date(e.target.value));
          }}
        />
        <PopoverTrigger asChild>
          <CalendarIcon className="h-4 w-4 mx-4 cursor-pointer hover" />
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0">
        <Calendar
          disabled={disableDate}
          mode="single"
          selected={date}
          onSelect={setDate}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
