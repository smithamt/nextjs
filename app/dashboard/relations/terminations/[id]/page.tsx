import { getCompany } from "@/data/user";
import dayjs from "dayjs";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import NavigateToBack from "../../../../../components/close";
import TerminationPrintBtn from "./printbtn";
import TerminationModel from "@/models/terminations/model";

async function RelationsRequestLeaves({ params }: { params: { id: string } }) {
  const { id } = params;

  const company = await getCompany();
  const data = await TerminationModel.findById(id).populate({
    path: "employee",
    select: "name nickname employeeId profile joinedDate",
    populate: {
      path: "position department",
      select: "name",
    },
  });

  const src = data.employee.profile?.image
    ? `/api/images/${data.employee.profile.image}/300/300`
    : "";

  if (!data) return notFound();

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
            <div className="mt-4">
              <TerminationPrintBtn
                data={JSON.stringify(data)}
                company={JSON.stringify(company)}
              />
            </div>
          </div>
        </div>
        {/* children */}
        <div className="h-[calc(100%-280px)] overflow-y-auto">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

export default RelationsRequestLeaves;
