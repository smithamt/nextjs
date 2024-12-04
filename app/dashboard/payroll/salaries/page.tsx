import SearchInput from "@/components/input/search";
import ExportBtn from "@/components/page";
import { getEmployeeQuery } from "@/data/employees";
import { getUser } from "@/data/user";
import EmployeeModel from "@/models/employees/model";
import EmployeeRelationData from "@/models/employees/relations/model";
import TableColumnModel from "@/models/tables/model";
import { getSalaryData } from "./_actions/getSalaryData";
import SalaryRootHeader from "./_components/header";
import PayrollSalariesClient from "./client";
import dayjs from "dayjs";

async function PayrollSalaries({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return null;

  const { page = 1, size = 10, sort } = searchParams;
  const date = (searchParams.date || dayjs().format("YYYY-MM-DD")) as string;
  const status = searchParams.status as string;

  let query = await getEmployeeQuery(searchParams, "salaries");

  const sortObject: any = {};

  if (sort)
    for (const [key, value] of Object.entries(sort)) {
      sortObject[key] = value === "desc" ? -1 : 1;
    }

  let employees = await EmployeeModel.find(query)
    .populate("position department", "name")
    .populate("currency", "symbol")
    .sort(sortObject)
    .limit(Number(page) * Number(size));

    
    const employeeRelations = await EmployeeRelationData.find({
    isPublic: true,
    employee: { $in: employees },
  }).populate({
    path: "id",
    populate: { path: "currency", select: "symbol" },
  });
  
  employees = employees.map((i) => {
    const allowances = employeeRelations.filter(
      (a) =>
        a.employee.toString() === i._id.toString() &&
      a.fromModel === "Allowance"
    );
    const deductions = employeeRelations.filter(
      (a) =>
        a.employee.toString() === i._id.toString() &&
      a.fromModel === "Deduction"
    );
    i.allowances = allowances;
    i.deductions = deductions;
    return i;
  });
  
  const count = await EmployeeModel.countDocuments(query);
  const salaries = await getSalaryData(new Date(date), employees, status);

  const saveColumns = await TableColumnModel.findOne({
    employee: user._id,
    title: "salaries",
  });

  return (
    <div className="w-full h-screen">
      <div className="flex items-center justify-between">
        <p className="px-4 font-bold text-lg">Salaries List</p>
        <SalaryRootHeader />
      </div>
      <div className="w-full h-[calc(100%-50px)] px-2 pb-2">
        <div className="w-full h-full cart-bg rounded-lg shadow-sm">
          <div className="p-2 flex items-center justify-between">
            <SearchInput />
            <div className="flex items-center space-x-2">
              <ExportBtn data={JSON.stringify(salaries)} title={"salaries"} />
            </div>
          </div>
          <div className="h-[calc(100%-60px)]">
            <PayrollSalariesClient
              saveColumns={JSON.stringify(saveColumns.columns)}
              salaries={JSON.stringify(salaries)}
              count={count}
              loading={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayrollSalaries;
