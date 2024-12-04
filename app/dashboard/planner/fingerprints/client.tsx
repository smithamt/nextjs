"use client";
import { useHasUser } from "@/app/_context/hasuser.context";
import { useInfiniteData } from "@/app/_hook/useInfiniteData";
import ShowNoText from "@/components/app/nodata";
import ProfileLoading from "@/components/loadings/profile";
import EmployeeProfile from "@/components/profile/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "@/constants/app/axios";
import { cn } from "@/lib/utils";
import { AttendanceType, FingerprintType, ShiftType } from "@/types";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";

type FingerprintAdjustment = {
  fingerprint: FingerprintType;
  shift: ShiftType;
  attendance: AttendanceType;
};

function FingerprintsDataClient() {
  const searchParams = useSearchParams();
  const department = searchParams.get("department");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const search = searchParams.get("search");
  const status = searchParams.get("status");

  const { data, loading, queryKey, lastElementRef } =
    useInfiniteData<FingerprintAdjustment>({
      keys: "fingerprints",
      size: 20,
      params: {
        department,
        startDate,
        endDate,
        search,
        status,
      },
    });

  return (
    <div className="max-w-[800px] mx-auto overflow-y-auto">
      {loading && <ProfileLoading />}
      {!loading && data?.length <= 0 && (
        <ShowNoText>No record found</ShowNoText>
      )}
      {data?.map((i, k) => {
        const checkIn =
          dayjs(i.fingerprint.recordTime).format("hh:mm A, MMM YYYY") ===
          dayjs(i.attendance?.checkIn?.time).format("hh:mm A, MMM YYYY");

        const checkOut =
          dayjs(i.fingerprint.recordTime).format("hh:mm A, MMM YYYY") ===
          dayjs(i.attendance?.checkOut?.time).format("hh:mm A, MMM YYYY");

        const shiftStartTime = dayjs(
          `${i.shift.schedule?.from} ${dayjs(i.shift.date).format("YYYY-MM-DD")}`
        );

        const recordTime = dayjs(i.fingerprint.recordTime);
        const isShouldCheckIn = !checkOut;

        // const isShouldCheckIn =
        //   shiftStartTime.add(1, "h").isBefore(recordTime) &&
        //   recordTime.add(-1, "h").isAfter(shiftStartTime) &&
        //   !checkOut;

        const shouldCheckOut = !checkOut && !checkIn;

        return (
          <div
            key={k}
            className="flex items-center hover justify-between mb-2 rounded-sm p-2"
          >
            <div className="flex p-2">
              <EmployeeProfile
                employee={i.fingerprint.employee}
                ago={`Schedule: ${i.shift?.schedule?.name}/ ${dayjs(i.shift.date).format("YYYY-MM-DD")}`}
                to={""}
              />
            </div>{" "}
            <div className="flex flex-col items-end">
              <p className="text-right">
                <span>Record:</span>{" "}
                {dayjs(i.fingerprint.recordTime).format("hh:mm a, DD")}
              </p>
              <div className="mt-2 space-x-2">
                {!i.attendance?.checkIn?.time &&
                  !checkIn &&
                  isShouldCheckIn && (
                    <CheckInOutBtn
                      text={"Check In"}
                      queryKey={[]}
                      data={i}
                      title={"checkIn"}
                    />
                  )}
                {shouldCheckOut && (
                  <CheckInOutBtn
                    text={"Check Out"}
                    queryKey={[]}
                    data={i}
                    title={"checkOut"}
                  />
                )}
                {(checkIn || checkOut) && (
                  <Badge variant={checkIn ? "approved" : "rejected"}>
                    {dayjs(i.fingerprint.recordTime).format("hh:mm A, DD")}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FingerprintsDataClient;

const CheckInOutBtn = ({
  data,
  title,
  queryKey,
  text,
  className,
}: {
  data: FingerprintAdjustment;
  title: "checkIn" | "checkOut";
  text: string;
  queryKey: string[];
  className?: string;
}) => {
  const { user } = useHasUser();

  const onClick = async () => {
    const updateData = {
      status: "Arrived",
      shiftStatus: data?.shift?.status,
      date: data?.shift
        ? data?.shift.date
        : new Date(dayjs(data?.shift.date).format("YYYY-MM-DD")).toISOString(),
      employee: data?.fingerprint.employee._id,
      schedule: data?.shift?.schedule._id,
      [title]: {
        time: data?.fingerprint.recordTime,
        method: "fingerprint",
        remark: "Approved from fingerprint page",
        status: "Approved",
        approvedBy: user._id,
      },
    };
    const response = await axios.post(`/api/attendances`, updateData);
    await axios.put(`/api/fingerprints/${data.fingerprint._id}`, {
      used: true,
    });
  };

  return (
    <Button
      className={cn("w-[100px]", className)}
      variant={title === "checkIn" ? "default" : "destructive"}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};
