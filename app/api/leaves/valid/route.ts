import { getUser } from "@/data/user";
import { NextRequest } from "next/server";
import EmployeeModel from "../../../../models/employees/model";
import LeaveModel from "../../../../models/leaves/model";

export async function GET(request: NextRequest) {
  const user = await getUser();
  const searchParams = request.nextUrl.searchParams;
  const employee = searchParams.get("employee");

  const employeeObj = await EmployeeModel.findById(employee);

  if (!employeeObj) return new Response("employee not found", { status: 404 });

  const query: any = { isPublic: true, company: employeeObj.company };

  query.countries = { $in: [employeeObj.nationality, "All"] };
  query.gender = { $in: ["All", employeeObj.gender] };
  query.maritalStatus = { $in: ["All", employeeObj.maritalStatus] };

  const response = await LeaveModel.find(query);
  return Response.json(response);
}

export async function POST() {
  return Response.json({ name: "leaves post" });
}

export async function PUT() {
  return Response.json({ name: "leaves put" });
}

export async function DELETE() {
  return Response.json({ name: "leaves delete" });
}
