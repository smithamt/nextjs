import { getUser } from "@/data/user";
import ContractModel from "@/models/contracts/model";
import { ADMIN } from "@/roles";
import { NextRequest } from "next/server";

export async function GET() {
  return Response.json({ name: "contracts get" });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user)
    return Response.json({ error: "User not found!" }, { status: 404 });

  if (user.role !== ADMIN)
    return Response.json({ error: "You are not authorized" }, { status: 401 });

  const body = await request.json();
  const contract = await ContractModel.create({
    ...body,
    createdBy: user._id,
    company: user.company,
  });

  return Response.json(contract);
}

export async function PUT() {
  return Response.json({ name: "contracts put" });
}

export async function DELETE() {
  return Response.json({ name: "contracts delete" });
}
