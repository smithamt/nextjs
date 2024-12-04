import { usePopup } from "@/app/_context/dialog";
import { Footer } from "@/app/_context/footer";
import { useHasUser } from "@/app/_context/hasuser.context";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/constants/app/axios";
import { getShiftEnd } from "@/lib/utils";
import { AttendanceType, EmployeeType, ShiftType } from "@/types";
import dayjs from "dayjs";
import { FC, useState } from "react";

interface ArrivedProps {
  attendance: AttendanceType | undefined | null;
  shift: ShiftType | undefined | null;
  employee: EmployeeType;
  updateData: (data: AttendanceType) => void;
}

const CreateAttendanceArrived: FC<ArrivedProps> = ({
  attendance,
  employee,
  updateData,
  shift,
}) => {
  const shiftEnd = shift?.schedule && getShiftEnd(shift.schedule, shift.date);
  const { toast } = useToast();
  const { user } = useHasUser();

  const [checkIn, setCheckIn] = useState<any>(
    attendance?.checkIn?.time
      ? {
          time: dayjs(attendance.checkIn.time).format("HH:mm"),
          method: attendance.checkIn.method,
        }
      : {
          time: attendance?.schedule ? attendance.schedule.from : "",
          method: "",
        }
  );

  const [checkOut, setCheckOut] = useState<any>(
    attendance?.checkOut?.time
      ? {
          time: dayjs(attendance.checkOut.time).format("HH:mm"),
          method: attendance.checkOut.method,
        }
      : {
          time:
            shiftEnd && new Date(shiftEnd).getTime() < new Date().getTime()
              ? shift.schedule.to
              : "",
          method: "",
        }
  );

  const { closeDialog } = usePopup();

  const initialRemax = `Create Attendance by you`;
  const [remark, setRemark] = useState(initialRemax);

  const createAttendance = () => {
    if (!checkIn)
      return toast({
        title: "Required some field!",
        description: "Enter check in to create attendance",
      });

    if (!shift?.schedule)
      return toast({
        title: "Required some field!",
        description: "Please add schedule for this attendance record",
      });

    if (!remark) {
      setRemark(initialRemax);
      return toast({
        title: "Required some field!",
        description: "Please fill remark",
      });
    }

    var start = dayjs(`2022-01-01T${shift?.schedule?.from}`);
    var end = dayjs(`2022-01-01T${shift?.schedule?.to}`);

    const from = new Date(
      `${dayjs(shift?.date).format("YYYY-MM-DD")} ${checkIn.time}`
    );

    const to = new Date(
      `${dayjs(shift?.date).format("YYYY-MM-DD")} ${checkOut.time}`
    );

    if (start.isAfter(end)) to.setDate(to.getDate() + 1);

    if (checkIn.time && checkOut.time && from.getTime() > to.getTime())
      from.setDate(from.getDate() - 1);

    const att = {
      employee: employee._id,
      date: new Date(shift?.date).toISOString(),
      checkIn: {
        time: checkIn.time ? from.toISOString() : "",
        method: checkIn.method ? checkIn.method : "planner",
        approvedBy: attendance?.checkIn?.approvedBy
          ? attendance.checkIn.approvedBy
          : user._id,
        remark: attendance?.checkIn?.remark ? attendance.checkIn.remark : "",
        status: attendance?.checkIn?.status
          ? attendance.checkIn.status
          : "approved",
      },
      checkOut: {
        time: checkOut.time ? to.toISOString() : "",
        method: checkOut.method ? checkOut.method : "planner",
        approvedBy: attendance?.checkOut?.approvedBy
          ? attendance.checkOut.approvedBy
          : user._id,
        status: attendance?.checkOut?.status
          ? attendance.checkOut.status
          : "approved",
        remark: attendance?.checkOut?.remark ? attendance.checkOut.remark : "",
      },
      schedule: shift?.schedule._id,
      $unset: { leave: 1, fromModel: 1 },
      remarkBy: user._id,
      remark,
      status: "Arrived",
    };

    closeDialog();
    updateData(att as unknown as AttendanceType);

    axios
      .post("/api/attendances", { ...att, notif: "from popup" })
      .then((response) => closeDialog())
      .catch((error) =>
        toast({
          description: error.response?.data.error
            ? error.response.data.error
            : error.message,
        })
      );
  };

  const isValidTime = (timeString: string) => {
    const timestamp = Date.parse(`01/01/1970 ${timeString}`);
    return !isNaN(timestamp);
  };

  return (
    <>
      <div className="p-4 flex flex-col h-[90%] justify-between">
        <div>
          <p className="pb-4 text-red-600 text-center">
            Creating attendance your self for{" "}
            <span className="text-blue-500 font-semibold">
              {employee.nickname || employee.name}
            </span>
            , other admin can see you.
          </p>
          <p
            className="text-center font-semibold py-2 rounded-lg mb-2 border hover"
            style={{
              backgroundColor: shift?.schedule?.color?.back,
              color: shift?.schedule?.color?.text,
            }}
          >
            {shift?.schedule ? (
              <>
                <span className="text-blue-500">
                  {employee.nickname || employee.name}
                  &apos;s
                </span>{" "}
                Schedule is {shift?.schedule?.name}
              </>
            ) : (
              <span className="text-red-500">
                Create schedule for this attendance
              </span>
            )}
          </p>
          <div className="flex mb-2">
            <div className="flex-1 pr-1">
              <p className="text-center">
                Check In time {shift?.schedule?.from}
              </p>
              <input
                className="border px-4 py-2 rounded-lg hover:border-blue-500 w-full"
                type="time"
                value={checkIn.time}
                placeholder="check in"
                onChange={(e) => {
                  if (isValidTime(e.target.value)) {
                    setCheckIn({ time: e.target.value, method: "planner" });
                  }
                }}
              />
            </div>
            <div className="flex-1 ml-1">
              <p className="text-center">
                Check Out time {attendance?.schedule?.to}
              </p>
              <input
                className="border px-4 py-2 rounded-lg hover:border-blue-500 w-full"
                type="time"
                value={checkOut.time}
                onChange={(e) => {
                  if (isValidTime(e.target.value)) {
                    setCheckOut({ time: e.target.value, method: "planner" });
                  }
                }}
                placeholder="check out"
              />
            </div>
          </div>
          <div className="w-full relative">
            <label htmlFor="" className="font-semibold px-1">
              Remark
            </label>
            <label className=" absolute right-2 top-2 text-[10px] ">
              {remark.length}/{500}
            </label>
            <Textarea
              value={remark}
              maxLength={500}
              onChange={(e) => setRemark(e.target.value)}
              className={`w-full min-h-[50px] max-h-[160px] border on px-4 py-2 rounded-lg hover:border-blue-500 ${
                !remark && "border-red-500"
              }`}
              placeholder="Enter Remark"
            />
          </div>
        </div>
      </div>
      <Footer onConfirm={createAttendance} />
    </>
  );
};

export default CreateAttendanceArrived;
