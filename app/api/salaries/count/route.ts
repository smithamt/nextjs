import { getEmployeeQuery } from "@/data/employees";
import { getUser } from "@/data/user";
import EmployeeModel from "@/models/employees/model";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "invalid" }, { status: 404 });
  const params = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(params);
  let query = await getEmployeeQuery(searchParams, "salaries");
  const count = await EmployeeModel.countDocuments(query);

  return Response.json(count);
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
