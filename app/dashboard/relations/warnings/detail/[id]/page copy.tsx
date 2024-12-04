import DefaultDataShow from "@/components/default/show";
import { MenubarDemo } from "@/components/tools/menu";
import { getCompany } from "@/data/user";
import WarningModel from "@/models/warnings/model";
import dayjs from "dayjs";
import { CalendarDays } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import NavigateToBack from "../../../../../../components/close";
import WarningPrintBtn from "./printbtn";

async function RelationWarningDetail({ params }: { params: { id: string } }) {
  const { id } = params;

  const company = await getCompany();
  const d = await WarningModel.findById(id).populate([
    {
      path: "employee approvedBy witnessedBy issuedBy",
      select: "name nickname employeeId profile joinedDate",
      populate: {
        path: "position department",
        select: "name",
      },
    },
    {
      path: "approvedBy witnessedBy issuedBy",
      select: "name nickname employeeId",
    },
  ]);

  if (!d) return notFound();
  const data = d.toObject();

  const src = data.employee.profile?.image
    ? `/api/images/${data.employee.profile.image}/300/300`
    : "";

  return (
    <div className="w-full h-screen overflow-y-auto px-8 pt-8 pb-4">
      <div className="cart-bg rounded-lg shadow-m h-auto min-h-full max-w-[1000px] mx-auto">
        <div className="px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <NavigateToBack />
            <p className="font-bold text-lg mx-2">Warning Detail</p>
          </div>
          <MenubarDemo
            title="warnings"
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
            <div className="mt-4">
              <WarningPrintBtn
                data={JSON.stringify(data)}
                company={JSON.stringify(company)}
              />
            </div>
          </div>
        </div>
        <DefaultDataShow
          data={JSON.stringify(data)}
          toSkip={["company", "employee"]}
        />
      </div>
    </div>
  );
}

export default RelationWarningDetail;
