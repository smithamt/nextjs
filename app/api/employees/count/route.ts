import connectMongo from "@/config/mongo";
import { getEmployeeQuery } from "@/data/employees";
import EmployeeModel from "@/models/employees/model";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  await connectMongo();
  const searchParams = request.nextUrl.searchParams;
  const query = await getEmployeeQuery(
    Object.fromEntries(searchParams),
    "planner"
  );
  const count = await EmployeeModel.countDocuments(query);

  return Response.json(count);
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
