import { getUser } from "@/data/user";
import EmployeeModel from "@/models/employees/model";
import ShiftModel, { handleShiftUpdate } from "@/models/shifts/model";
import { ADMIN_FINANCE_EDITOR_GROUP_ADMIN } from "@/roles";
import { EmployeeType } from "@/types";
import dayjs from "dayjs";
import { NextRequest } from "next/server";
import { saveUpdateData, sendNotification } from "../action";
import { fetchShifts } from "../planner/action";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user || !ADMIN_FINANCE_EDITOR_GROUP_ADMIN.includes(user.role))
    return new Response("error", { status: 401 });
  const searchParams = request.nextUrl.searchParams;
  const employees = searchParams.get("employees") as string;
  const next = (searchParams.get("next") || "0") as string;
  const shifts = await fetchShifts(employees?.split(","), Number(next));
  return Response.json(shifts);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user || !ADMIN_FINANCE_EDITOR_GROUP_ADMIN.includes(user.role))
    return new Response("error", { status: 401 });

  const body = await request.json();
  const { employee: e, date, status, schedule } = body;

  const employee = (await EmployeeModel.findById(e).select(
    "_id"
  )) as EmployeeType;
  if (!employee) return new Response("employee not found", { status: 404 });

  const findQuery = {
    date: new Date(dayjs(date).format("YYYY-MM-DD")),
    employee: employee._id,
  };
  console.log("findQuery", findQuery, body);
  delete body._id;
  const response = await ShiftModel.findOneAndUpdate(
    findQuery,
    {
      ...body,
      status,
      createdBy: user._id,
    },
    { new: true, upsert: true }
  ).select("status schedule date employee");

  await saveUpdateData({
    title: "shifts",
    context: response._id,
    fromModel: "Shift",
    employee: user._id,
    data: body,
  });

  const attendance = await handleShiftUpdate({
    schedule,
    status,
    findQuery,
    date,
  });

  const notificationData = {
    title: "Update your shift",
    content: response.employee,
    route: "planner",
    contentType: "attendance",
    from: { name: user.name, profile: user.profile },
    fromModel: "Employee",
  };

  sendNotification(employee.id, notificationData);
  return Response.json({ shift: response, attendance });
}

export async function PUT() {
  return Response.json({ name: "shifts put" });
}

export async function DELETE() {
  return Response.json({ name: "shifts delete" });
}
