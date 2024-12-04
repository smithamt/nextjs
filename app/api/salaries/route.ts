import { getSalaryData } from "@/app/dashboard/payroll/salaries/_actions/getSalaryData";
import { getEmployeeQuery } from "@/data/employees";
import { getUser } from "@/data/user";
import EmployeeModel from "@/models/employees/model";
import EmployeeRelationData from "@/models/employees/relations/model";
import dayjs from "dayjs";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "invalid" }, { status: 404 });
  const params = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(params);
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

  const salaries = await getSalaryData(new Date(date), employees, status);

  return Response.json(salaries);
}

export async function POST() {
  return Response.json({ name: "salaries post" });
}

export async function PUT() {
  return Response.json({ name: "salaries put" });
}

export async function DELETE() {
  return Response.json({ name: "salaries delete" });
}
