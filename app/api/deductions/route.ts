import { getUser } from "@/data/user";
import DeductionSchema from "@/models/deductions/model";
import { NextRequest } from "next/server";

export async function GET() {
  return Response.json({ name: "deductions get" });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user)
    return Response.json({ error: "User not found!" }, { status: 404 });

  const body = await request.json();
  const { department } = body;
  const model = new DeductionSchema({
    ...body,
    company: user.company,
    department: department || user.department,
    createdBy: user._id,
  });

  await model.save();
  return Response.json({ name: "departments post" });
}

export async function PUT() {
  return Response.json({ name: "deductions put" });
}

export async function DELETE() {
  return Response.json({ name: "deductions delete" });
}
