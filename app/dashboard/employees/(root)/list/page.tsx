import ExportBtn from "@/components/page";
import { getEmployeeQuery } from "@/data/employees";
import { getUser } from "@/data/user";
import EmployeeModel from "@/models/employees/model";
import { ADMIN } from "@/roles";
import { EmployeeType } from "@/types";
import EmployeesListClient from "./client";
import TableColumnModel from "@/models/tables/model";

async function EmployeeLists({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { page = "1", size = "10" } = searchParams;
  const user = await getUser();
  if (!user) return;
  const query: any = { isPublic: true };
  if (user.role !== ADMIN) query.department = user.department;

  const employeeQuery = await getEmployeeQuery(searchParams, "employees");
  const employees = await EmployeeModel.find(employeeQuery)
    .limit(Number(size) * Number(page))
    .populate("position", "name")
    .lean();

  const count = await EmployeeModel.countDocuments(employeeQuery);
  const saveColumns = await TableColumnModel.findOne({
    employee: user._id,
    title: "employees",
  });

  return (
    <div className="h-full w-full">
      <div className="flex justify-end">
        <ExportBtn data={JSON.stringify(employees)} title={"employees"} />
      </div>
      <div className="h-[calc(100%-50px)]">
        <EmployeesListClient
          data={JSON.stringify(employees)}
          saveColumns={JSON.stringify(saveColumns ? saveColumns.columns : [])}
          count={count}
        />
      </div>
    </div>
  );
}

export default EmployeeLists;
