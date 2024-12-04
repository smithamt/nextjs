import { getUser } from "@/data/user";
import CurrencyModel from "@/models/currencies/model";
import { ADMIN } from "@/roles";
import { NextRequest } from "next/server";

export async function GET() {
  return Response.json({ name: "currencies get" });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user)
    return Response.json({ error: "User not found!" }, { status: 404 });

  if (user.role !== ADMIN)
    return Response.json({ error: "You are not authorized" }, { status: 401 });

  const body = await request.json();
  const { department } = body;

  const model = new CurrencyModel({
    ...body,
    company: user.company,
    department: department || user.department,
    createdBy: user._id,
  });

  await model.save();
  return Response.json({ name: "departments post" });
}

export async function PUT() {
  return Response.json({ name: "currencies put" });
}

export async function DELETE() {
  return Response.json({ name: "currencies delete" });
}
