"use client";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import DateRangeComponent from "./DateRange";

const OpenDateRange = () => {
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const [date, setDate] = useState<DateRange | undefined>({
    from: startDate ? new Date(startDate) : undefined,
    to: endDate ? new Date(endDate) : undefined,
  });
  const router = useRouter();

  return (
    <DateRangeComponent
      date={date}
      setDate={setDate}
      onSelectDate={(value) =>
        router.push(
          `?startDate=${dayjs(value?.from).format(
            "YYYY-MM-DD"
          )}&endDate=${dayjs(value?.to).format("YYYY-MM-DD")}`
        )
      }
    />
  );
};

export default OpenDateRange;
