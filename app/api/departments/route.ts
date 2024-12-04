import { getUser } from "@/data/user";
import DepartmentModel from "@/models/departments/model";
import { ADMIN } from "@/roles";
import { NextRequest } from "next/server";

export async function GET() {
  return Response.json({ name: "departments get" });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user)
    return Response.json({ error: "User not found!" }, { status: 404 });

  if (user.role !== ADMIN)
    return Response.json({ error: "You are not authorized" }, { status: 401 });

  const body = await request.json();
  const response = new DepartmentModel({
    ...body,
    company: user.company,
    createdBy: user._id,
  });

  await response.save();
  return Response.json(response);
}

export async function PUT() {
  return Response.json({ name: "departments put" });
}

export async function DELETE() {
  return Response.json({ name: "departments delete" });
}
