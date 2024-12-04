import NextOrPreviousButtons from "@/components/buttons/shift";
import NotFound from "@/components/not-found";
import EmployeeProfile from "@/components/profile/page";
import { getUser } from "@/data/user";
import EmployeeModel from "@/models/employees/model";
import dayjs from "dayjs";
import { Types } from "mongoose";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import PlannerMonthClient from "./client";
import ScheduleModel from "@/models/schedules/model";

async function PlannerDrawShift$id({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const { id } = params;
  const pattern = new RegExp(id, "i");
  let query: any = { employeeId: { $regex: pattern }, company: user.company };
  if (Types.ObjectId.isValid(id)) {
    query = { _id: id };
  }

  const e = await EmployeeModel.findOne(query).populate(
    "position department",
    "name"
  );
  if (!e) return <NotFound />;
  const employee = e.toObject();

  const schedules = await ScheduleModel.find({
    company: user.company,
    isPublic: true,
    $or: [{ allDepartment: true }, { department: employee.department }],
  });

  const next = Number(searchParams.next || "0");

  return (
    <div className="flex flex-col w-full p-2">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center mb-2">
          <Link
            href={"/dashboard/planner/week"}
            className="min-w-10 min-h-10 rounded-full center cursor-pointer hover:bg-black/5 mr-4"
          >
            <IoArrowBackOutline size={20} />
          </Link>

          <EmployeeProfile employee={employee} to={""} />
        </div>
        <p className="text-[20px] md:text-[40px] leading-10 font-bold flex text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 py-2">
          Draw Shift For{" "}
          {dayjs().add(Number(next), "month").format("MMMM YYYY")}
        </p>
        <div className="w-50">
          <NextOrPreviousButtons />
        </div>
      </div>
      <PlannerMonthClient
        schedules={JSON.stringify(schedules)}
        employee={JSON.stringify(employee)}
      />
    </div>
  );
}

export default PlannerDrawShift$id;
