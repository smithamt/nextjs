import { Button } from "@/components/ui/button";
import LeaveRequestModel from "@/models/leaverequests/model";
import dayjs from "dayjs";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import NavigateToBack from "../../../../../components/close";

async function RelationsRequestLeaves({ params }: { params: { id: string } }) {
  const { id } = params;

  const leaveRequest = await LeaveRequestModel.findById(id).populate({
    path: "employee",
    select: "name nickname employeeId profile joinedDate",
    populate: {
      path: "position department",
      select: "name",
    },
  });

  if (!leaveRequest) return notFound();

  const src = leaveRequest.employee.profile?.image
    ? `/api/images/${leaveRequest.employee.profile.image}/300/300`
    : "";

  return (
    <div className="w-full h-screen overflow-y-auto px-8 pt-8 pb-4">
      <div className="cart-bg rounded-lg shadow-m h-full max-w-[1000px] mx-auto">
        <div className="px-4 py-2 flex items-center justify-between">
          <p className="font-bold text-lg">RelationsLeaveRequests</p>
          <NavigateToBack />
        </div>
        <div className="p-2 flex border-b">
          <Image
            width={200}
            height={320}
            className="rounded-lg min-h-[200px] max-h-[200px]"
            src={src}
            alt="profile"
          />
          <div className="px-4 h-[200px]">
            <p className="font-bold text-lg">
              {leaveRequest.employee.name}{" "}
              <span className="inactive-text text-sm">
                ({leaveRequest.employee.employeeId})
              </span>
            </p>
            <p>{leaveRequest.employee.position?.name}</p>
            <p>{leaveRequest.employee.department?.name}</p>
            <p className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" /> Joined{" "}
              {dayjs(leaveRequest.employee.joinedDate).format("MMMM YYYY")}
            </p>
            <Button className="mt-4" variant={"print"}>
              Print
            </Button>
          </div>
        </div>
        {/* children */}
        <div className="h-[calc(100%-280px)] overflow-y-auto">
          <pre>{JSON.stringify(leaveRequest, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default RelationsRequestLeaves;
