import { getEmployeeQuery } from "@/data/employees";
import { NextRequest } from "next/server";
import EmployeeModel from "../../../../models/employees/model";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const paramsObject = Object.fromEntries(searchParams.entries());

  const employeeQuery = await getEmployeeQuery(paramsObject);
  const employees = await EmployeeModel.find(employeeQuery)
    .select("name profile employeeId")
    .limit(20);
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
