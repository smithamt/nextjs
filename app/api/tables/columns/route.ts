import { getUser } from "@/data/user";
import { NextRequest, NextResponse } from "next/server";
import TableColumnModel from "../../../../models/tables/model";

export async function GET() {
  const user = await getUser();
  console.log(user);
  return Response.json({ name: "table get" });
}

export async function POST(request: NextRequest) {
  const user = await getUser();

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await request.json();

  const response = await TableColumnModel.findOneAndUpdate(
    { employee: user._id, title: body.title },
    { ...body },
    { upsert: true }
  );

  return NextResponse.json(response);
}

export async function PUT() {
  return Response.json({ name: "table put" });
}

export async function DELETE() {
  return Response.json({ name: "table delete" });
}
