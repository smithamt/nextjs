import { getShiftsByEmployee } from "@/app/api/planner/action";
import { getUser } from "@/data/user";
import { ADMIN_FINANCE_EDITOR_GROUP_ADMIN } from "@/roles";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user || !ADMIN_FINANCE_EDITOR_GROUP_ADMIN.includes(user.role))
    return new Response("error", { status: 401 });
  const searchParams = request.nextUrl.searchParams;
  const startDate = searchParams.get("startDate") as string;
  const endDate = searchParams.get("endDate") as string;
  const attendances = await getShiftsByEmployee(
    params.id,
    new Date(startDate),
    new Date(endDate)
  );
  return Response.json(attendances);
}

export async function POST() {
  return Response.json({ name: "attendance psot" });
}

export async function PUT() {
  return Response.json({ name: "attendance put" });
}

export async function DELETE() {
  return Response.json({ name: "attendance delete" });
}
