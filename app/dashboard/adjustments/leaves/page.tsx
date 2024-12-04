import ChooseData from "@/components/data/choose/page";
import SearchInput from "@/components/input/search";
import { getEmployeeQuery } from "@/data/employees";
import { getUser } from "@/data/user";
import EmployeeModel from "@/models/employees/model";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { getAllLeaveAdjustments } from "./_action/getAllLeaveAdjustment";
import AdjustmentsLeavesClientList from "./client";
import TableColumnModel from "@/models/tables/model";

export const metadata: Metadata = {
  title: "Leaves | Adjustments",
  description: "Asia Pacific International Hotel",
};

async function AdjustmentsLeaves({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return null;
  let leave = searchParams.leave;

  if (!leave) {
    leave = cookies().get(`${user.role}adjustmentsleaves`)?.value;
  }

  const limit =
    Number(searchParams.page || "1") * Number(searchParams.size || "10");

  const employeeQuery = await getEmployeeQuery(searchParams);
  const employeeIds = (
    await EmployeeModel.find(employeeQuery).limit(limit)
  ).map((i) => i._id);

  const count = await EmployeeModel.countDocuments(employeeQuery);

  const leaveAdjustments = await getAllLeaveAdjustments(
    {
      ...searchParams,
      leave,
    },
    employeeIds
  );

  const data = Array.isArray(leaveAdjustments) ? leaveAdjustments : [];

  const saveColumns = await TableColumnModel.findOne({
    employee: user._id,
    title: "leaveAdjustments",
  });

  return (
    <div className="w-full h-screen pt-4 px-8">
      <div className="w-full h-full cart-bg rounded-lg shadow-m">
        <div className="flex items-center justify-between p-2">
          <p className="font-bold text-lg flex items-center">
            <Link
              href={"/dashboard/adjustments/overview"}
              className="hover w-10 h-10 rounded-full center"
            >
              <IoClose className="w-6" />
            </Link>
            <span className="px-2">Leave Adjustments</span>
          </p>
          <div className="space-x-2 flex items-center">
            <SearchInput />
            <ChooseData defaultOpen title="leaves" state={"adjustments"} />
            <ChooseData title="branches" state={"adjustments"} />
            <ChooseData title="departments" state={"adjustments"} />
            <ChooseData title="positions" state={"adjustments"} />
          </div>
        </div>
        <div className="w-full h-[calc(100%-60px)] p-2">
          {!leaveAdjustments.error && (
            <AdjustmentsLeavesClientList
              saveColumns={JSON.stringify(
                saveColumns ? saveColumns.columns : []
              )}
              data={JSON.stringify(data)}
              count={count}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AdjustmentsLeaves;
