"use client";
import { useHasUser } from "@/app/_context/hasuser.context";
import useCurrentLocation from "@/app/_hook/location";
import DefaultDataShow from "@/components/default/show";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/constants/app/axios";
import { AttendanceType, ShiftType } from "@/types";
import { useState } from "react";

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  var R = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  // Distance in km
  return d;
}

const checkLocation = (
  location: { latitude: number; longitude: number; radius: number },
  coordinates: number[]
) => {
  if (location) {
    const validLoc = getDistance(
      coordinates[0],
      coordinates[1],
      location?.latitude,
      location?.longitude
    );

    if (validLoc < 0.001 * (location?.radius + 50 || 100)) {
      return true;
    } else {
      return false;
    }
  }
};

function HomeAttendanceClient({
  shift: s,
  attendance: a,
}: {
  shift?: string;
  attendance?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [attendance, setAttendance] = useState<AttendanceType | undefined>(
    a ? (JSON.parse(a) as AttendanceType) : undefined
  );
  const { user } = useHasUser();
  const { toast } = useToast();
  const shift = s ? (JSON.parse(s) as ShiftType) : undefined;
  const { coordinates } = useCurrentLocation();

  const validLocation =
    coordinates &&
    user.branch &&
    checkLocation(user.branch.location, [coordinates.lat, coordinates.lng]);

  const status = validLocation ? "Arrived" : "Wrong Location";

  const schedule = shift?.schedule ? shift.schedule._id : null;

  const attData: any = {
    ...attendance,
    employee: user._id,
    status: schedule ? status : "Need Schedule!",
    schedule,
    ref: `Created from home page`,
  };

  const approveCheckIn = validLocation ? "Approved" : "Wrong Location";

  const checkIn = async () => {
    if (loading) return;
    setLoading(true);

    attData.title = "Check In";
    attData.checkIn = {
      device: "website",
      location,
      time: new Date(),
      method: "website",
      approvedBy: user._id,
      status: approveCheckIn,
    };

    attData.date = shift ? shift.date : new Date();
    attData.shiftStatus = shift?.status;

    try {
      const response = await axios.post(`/api/attendances`, attData);
      setLoading(false);
      setAttendance(
        attendance ? { ...attendance, ...response.data } : response.data
      );
    } catch (error) {
      const err = error as any;
      toast({
        description: err.response.data.error ?? err.message,
        title: "Error found",
      });
      setLoading(false);
    }
  };

  const checkOut = async () => {
    if (!attendance || loading) return;
    setLoading(true);
    const checkOutData = {
      ...attendance,
      title: "Check Out",
      checkOut: {
        device: "",
        method: "website",
        location,
        time: new Date().toISOString(),
        approvedBy: user._id,
        status: approveCheckIn,
      },
      status,
    };
    try {
      const response = await axios.post(`/api/attendances`, checkOutData);
      setLoading(false);
      setAttendance(
        attendance ? { ...attendance, ...response.data } : response.data
      );
    } catch (error) {
      const err = error as any;
      toast({
        description: err.response.data.error ?? err.message,
        title: "Error found",
      });
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-8">
      <div className="flex flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <p className="text-center font-semibold text-lg">Shift</p>
          {shift ? (
            <DefaultDataShow
              chicontainercls="flex"
              chichildcls="px-2 text-md"
              className="flex flex-col"
              toSkip={["employee", "location", "color", "approvedBy"]}
              data={JSON.stringify(shift)}
            />
          ) : (
            "No shift found"
          )}
        </div>
        <div className="flex-1 min-w-[300px]">
          <p className="text-center font-semibold text-lg">Attendance</p>
          {attendance ? (
            <DefaultDataShow
              chicontainercls="flex"
              chichildcls="px-2 text-md"
              className="flex flex-col"
              toSkip={["employee", "location", "color", "approvedBy"]}
              data={JSON.stringify(attendance)}
            />
          ) : (
            "No attendance found"
          )}
        </div>
      </div>
      <div className="flex flex-wrap px-2 gap-2 max-w-[700px] mx-auto mt-4">
        <div className="flex-1 min-w-[250px] center">
          <Button
            disabled={loading || attendance?.checkIn?.time ? true : false}
            onClick={checkIn}
            className="w-[200px]"
          >
            Check In
          </Button>
        </div>
        <div className="flex-1 min-w-[250px] center">
          <Button
            disabled={loading || attendance?.checkOut?.time ? true : false}
            className="w-[200px]"
            variant={"destructive"}
            onClick={checkOut}
          >
            Check Out
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomeAttendanceClient;
