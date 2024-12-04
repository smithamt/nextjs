import { getUser } from "@/data/user";
import EmployeeModel from "@/models/employees/model";
import ScheduleModel from "@/models/schedules/model";
import ShiftModel from "@/models/shifts/model";
import { ADMIN_HOD_EDITOR_GROUP_ADMIN } from "@/roles";
import { NextRequest } from "next/server";
import { sendNotification } from "../../action";

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user || !ADMIN_HOD_EDITOR_GROUP_ADMIN.includes(user.role))
    return new Response("error", { status: 401 });

  const body = await request.json();

  console.log("body", body);

  const { schedule: s, employee: e, date = [], ref } = body;

  const employee = await EmployeeModel.findById(e).select(
    "name nickname employeeId"
  );
  if (!employee) return new Response("employee not found", { status: 404 });

  const schedule = await ScheduleModel.findById(s);
  if (!schedule) return new Response("schedule not found", { status: 404 });

  const response = await Promise.all(
    date.map(async (d: string) => {
      try {
        const shift = await ShiftModel.findOneAndUpdate(
          { employee: employee._id, date: new Date(d) },
          { ref, schedule, status: "Working Day", createdBy: user._id },
          { new: true, upsert: true }
        ).populate("schedule", "name from to color");
        return shift;
      } catch (error) {
        console.log("error", error);
      }
    })
  );

  const notiData = {
    message: "Update ShiftSchema!",
    title: "shifts",
    content: "allshifts",
    route: "planner",
    user: employee,
  };

  sendNotification(employee._id, notiData);

  return Response.json(response);
}
