import { getUser } from "@/data/user";
import EmployeeModel from "@/models/employees/model";
import { ADMIN_FINANCE_EDITOR_GROUP_ADMIN } from "@/roles";
import { LeaveAdjustmentType } from "@/types";
import { NextRequest } from "next/server";
import AttendanceModel from "../../../../../models/leaves/model";
import { getTotalLeave } from "../../action";
import LeaveModel from "../../../../../models/leaves/model";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user || !ADMIN_FINANCE_EDITOR_GROUP_ADMIN.includes(user.role))
    return new Response("error", { status: 401 });
  const response = await AttendanceModel.find({
    employee: params.id,
    leave: { $ne: null },
  });

  const leaves = await LeaveModel.find({
    company: user.company,
    isPublic: true,
  });

  const employee = await EmployeeModel.findById(params.id).select(
    "joinedDate name gender nationality"
  );

  if (!employee) return new Response("employee not found", { status: 404 });

  const dataArray: LeaveAdjustmentType[] = [];
  leaves.forEach((leave) =>
    dataArray.push(
      //@ts-ignore
      getTotalLeave({
        employee,
        leaveObj: leave,
        allLeaves: response,
        excludedDays: [],
      })
    )
  );
  return Response.json(dataArray);
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
