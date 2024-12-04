import connectMongo from "@/config/mongo";
import { getEmployeeQuery } from "@/data/employees";
import EmployeeModel from "@/models/employees/model";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await connectMongo();
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("pageParam") || "1");
  const query = await getEmployeeQuery(
    Object.fromEntries(searchParams),
    "planner"
  );
  const start = (page < 1 ? 0 : page - 1) * 10;

  const employees = await EmployeeModel.find(query)
    .select(
      "name profile employeeId nickname contactNo isActive email currentAddress department"
    )
    .populate("position", "name isHeadOfDepartment")
    .skip(start)
    .limit(10);

  return Response.json(employees);
}

export async function POST() {
  return Response.json({ name: "employee psot" });
}

export async function PUT() {
  return Response.json({ name: "employee put" });
}

export async function DELETE() {
  return Response.json({ name: "employee delete" });
}
