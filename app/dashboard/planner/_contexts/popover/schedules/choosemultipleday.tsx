import { usePopup } from "@/app/_context/dialog";
import { Footer } from "@/app/_context/footer";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/constants/app/axios";
import { getMonth } from "@/lib/utils";
import { ColorType, EmployeeType, ScheduleType, ShiftType } from "@/types";
import dayjs from "dayjs";
import { FC, useState } from "react";

interface ChooseMultipleDateProps {
  dates: string[];
  setDate: (date: string[]) => void;
  color: { back: string; text: string };
}

const MultipleDayPopup = ({
  dates: d = [],
  onUpdateData,
  color,
  schedule,
  employee,
}: {
  dates: string[];
  onUpdateData: (data: ShiftType) => void;
  color: ColorType;
  schedule?: ScheduleType;
  employee: EmployeeType;
}) => {
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState(d);
  const { toast } = useToast();
  const { closeDialog } = usePopup();

  const createMultipleDate = async () => {
    const endpoint = schedule ? "/shifts/bulk" : "/shifts/bulkoff";
    const data: any = {
      employee: employee._id,
      date: dates,
      ref: window.location.href,
    };

    if (schedule) data.schedule = schedule._id;

    try {
      setLoading(true);
      const response = await axios.post(`/api/${endpoint}`, data);
      setDates([]);
      response.data.map((i: any) => onUpdateData(i));
      console.log("response.data", response.data);
      setLoading(false);
      closeDialog();
    } catch (error: any) {
      console.log("error", error);
      toast({
        title: "Error found",
        description: error.response?.data?.message || error.message,
      });
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[350px]">
      <div className="h-[calc(100%-50px)]">
        <ChooseMultipleDate
          dates={dates}
          setDate={setDates}
          color={{
            back: color.back,
            text: color.text,
          }}
        />
      </div>
      <Footer loading={loading} onConfirm={createMultipleDate} />
    </div>
  );
};

export default MultipleDayPopup;

const ChooseMultipleDate: FC<ChooseMultipleDateProps> = ({
  dates,
  setDate,
  color,
}) => {
  const month = getMonth(0, 6);

  return (
    <div className="w-full h-full px-2 pb-2">
      {month.map((week, weekIndex) => {
        return (
          <div key={weekIndex} className="flex h-[calc(100%/6)]">
            {week.map((day, dayIndex) => {
              const contain = dates.includes(dayjs(day).format("YYYY-MM-DD"));

              return (
                <div
                  key={dayIndex}
                  onClick={() => {
                    const formattedDate = dayjs(day).format("YYYY-MM-DD");
                    if (contain) {
                      //@ts-ignore
                      setDate((prev: string[]) =>
                        prev.filter((date: string) => date !== formattedDate)
                      );
                    } else {
                      //@ts-ignore
                      setDate((prev: string[]) => [...prev, formattedDate]);
                    }
                  }}
                  className="center flex-1 p-2 h-full hover rounded-sm"
                  style={{
                    backgroundColor: contain ? color.back : "",
                    color: contain ? color.text : "",
                  }}
                >
                  {day.getDate()}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
