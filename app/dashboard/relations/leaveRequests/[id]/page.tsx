import NavigateToBack from "@/components/close";
import { MenubarDemo } from "@/components/tools/menu";
import { Badge } from "@/components/ui/badge";
import { getCompany, getUser } from "@/data/user";
import LeaveRequestModel from "@/models/leaverequests/model";
import { LeaveRequestType } from "@/types";
import dayjs from "dayjs";
import { CalendarDays } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import LeaveRequestClientBtn from "./clientbtn";
import LeaveRequestPrintBtn from "./printbtn";

export const metadata: Metadata = {
  title: "LeaveRequests Detail",
  description: "Asia Pacific International Hotel",
  icons: { icon: "/vite.svg" },
};

async function RelationsLeaveRequestDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const user = await getUser();
  const company = await getCompany();
  if (!user) return;

  const data = (await LeaveRequestModel.findOne({
    _id: id,
    isPublic: true,
    company: user.company,
  }).populate([
    {
      path: "employee leaves.approvedBy",
      select: "name nickname employeeId profile joinedDate",
      populate: {
        path: "position department",
        select: "name",
      },
    },
    {
      path: "leaves.leave",
      select: "name color",
    },
    { path: "leaves.attendedFiles", select: "images" },
  ])) as LeaveRequestType | undefined;

  if (!data) return notFound();

  const src = data.employee.profile?.image
    ? `/api/images/${data.employee.profile.image}/300/300`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <div className="w-full h-screen overflow-y-auto px-8 pt-8 pb-4">
      <div className="cart-bg rounded-lg min-h-full shadow-m max-w-[1000px] mx-auto">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <NavigateToBack />
            <p className="font-bold text-lg mx-2">LeaveRequests Detail</p>
          </div>
          <MenubarDemo
            title="leaveRequests"
            data={data._id.toString()}
            status={data.status}
          />
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
              {data.employee.name}{" "}
              <span className="inactive-text text-sm">
                ({data.employee.employeeId})
              </span>
            </p>
            <p>{data.employee.position?.name}</p>
            <p>{data.employee.department?.name}</p>
            <p className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" /> Joined{" "}
              {dayjs(data.employee.joinedDate).format("MMMM YYYY")}
            </p>
            <LeaveRequestPrintBtn
              data={JSON.stringify(data)}
              company={JSON.stringify(company)}
            />
          </div>
        </div>
        {/* children */}
        <div className="p-2">
          {data.leaves.map((leave, index) => {
            const startDate = new Date(leave.from);
            const endDate = new Date(leave.to);

            const totalDays = Math.ceil(
              (endDate.getTime() - startDate.getTime() + 1) /
                (1000 * 60 * 60 * 24)
            );

            return (
              <div key={index} className="w-full nav-bg rounded-lg mb-2 p-2">
                <div className="flex items-center justify-between p-2">
                  <p className="font-bold text-lg">
                    {leave.leave?.name} Request!
                  </p>{" "}
                  <Badge variant={leave.status} className="capitalize">
                    {leave.status}
                  </Badge>{" "}
                </div>
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="flex items-center p-2">
                      <CalendarDays className="mr-2 h-4 w-4 opacity-70" /> Start
                      Date:{" "}
                      <strong className="px-2">
                        {dayjs(leave.from).format("DD dddd MMMM, YYYY")}
                      </strong>
                    </p>{" "}
                    <p className="flex items-center p-2">
                      <CalendarDays className="mr-2 h-4 w-4 opacity-70" /> End
                      Date:
                      <strong className="px-2">
                        {" "}
                        {dayjs(leave.to).format("DD dddd MMMM, YYYY")}
                      </strong>
                    </p>
                    <p className="flex items-center p-2">
                      <CalendarDays className="mr-2 h-4 w-4 opacity-70" /> Total
                      Days: <strong className="px-2">{totalDays}</strong>
                    </p>
                    {leave.rejectReason && (
                      <p title="Total Day">{leave.rejectReason}</p>
                    )}
                  </div>
                  <LeaveRequestClientBtn
                    id={data._id.toString()}
                    leave={JSON.stringify(leave)}
                  />
                </div>
                {leave.attendedFiles?.images.length > 0 && (
                  <>
                    <p className="font-semibold mb-2">Attended Files</p>
                    <div className="p-2 flex space-x-2">
                      {leave.attendedFiles.images.map((i, k) => (
                        <Link
                          key={k}
                          href={`/photos/${leave.attendedFiles._id}`}
                          className="w-[50px] hover hover:scale-105 h-[50px] object-cover rounded-lg shadow"
                        >
                          <Image
                            width={50}
                            height={50}
                            src={`/api/images/${i}/50/50`}
                            alt="image preview"
                          />
                        </Link>
                      ))}
                    </div>{" "}
                  </>
                )}
                <div className="p-2">
                  {leave.status === "rejected" && (
                    <p title="Reject Reason">{leave.rejectReason}</p>
                  )}
                </div>{" "}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default RelationsLeaveRequestDetail;
