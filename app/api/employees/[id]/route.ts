import { getUser } from "@/data/user";
import { ADMIN_HOD_FINANCE_EDITOR_GROUP_ADMIN } from "@/roles";
import { NextRequest } from "next/server";
import EmployeeModel from "../../../../models/employees/model";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return new Response("Not found", { status: 404 });
  const { id } = params;
  try {
    const employee = await EmployeeModel.findById(id);
    if (
      !ADMIN_HOD_FINANCE_EDITOR_GROUP_ADMIN.includes(user.role) &&
      employee.id !== user.id
    ) {
      return new Response("not allow", { status: 401 });
    }

    const headers = new Headers({ "Content-Type": "application/json" });
    return new Response(JSON.stringify(employee), {
      status: 200,
      headers,
    });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return Response.json({ name: "employee psot" });
}

export async function PUT(request: NextRequest) {
  return Response.json({ name: "employee put" });
}

export async function DELETE(request: NextRequest) {
  return Response.json({ name: "employee delete" });
}
