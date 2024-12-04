import { getUser } from "@/data/user";
import { getShiftEnd } from "@/lib/utils";
import AttendanceModel from "@/models/attendances/model";
import EmployeeModel from "@/models/employees/model";
import ScheduleModel from "@/models/schedules/model";
import ShiftModel from "@/models/shifts/model";
import {
  ADMIN,
  ADMIN_FINANCE_EDITOR_GROUP_ADMIN,
  ADMIN_HOD_EDITOR,
  LIMIT_ATTENDANCE_CREATING_ADVANCE,
  LIMIT_LEAVE_CREATING,
  ONLY_ALLOW_ONE_TIME,
  roles,
} from "@/roles";
import dayjs from "dayjs";
import { NextRequest } from "next/server";
import {
  createNotification,
  saveUpdateData,
  sendNotification,
} from "../action";
import { fetchAttendances } from "../planner/action";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user || !ADMIN_FINANCE_EDITOR_GROUP_ADMIN.includes(user.role))
    return new Response("error", { status: 401 });
  const searchParams = request.nextUrl.searchParams;
  const employees = searchParams.get("employees") as string;
  const next = (searchParams.get("next") || "0") as string;
  const attendances = await fetchAttendances({
    employees: employees?.split(","),
    next: Number(next),
    user,
  });
  return Response.json(attendances);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "not found" }, { status: 404 });

  const foundRole = roles.find((r) => r.name === user.role);
  const body = await request.json();
  const { title, schedule, employee, date, ...other } = body;

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 2);

  const existAttendance = await AttendanceModel.findOne({
    $or: [
      {
        employee: body.employee,
        date: body.date,
      },
      { _id: body._id },
    ],
  });
  const providedDate = new Date(body.date || existAttendance?.date);

  if (isNaN(providedDate.getTime()))
    return Response.json({ error: "invalid date" }, { status: 401 });

  if (body.notif === "from popup") {
    //one time limit
    if (
      foundRole?.attendances?.includes(ONLY_ALLOW_ONE_TIME) &&
      existAttendance?.updated &&
      existAttendance?.updated?.state === true
    ) {
      return Response.json(
        { error: "Can update only one time!" },
        { status: 401 }
      );
    }
    // last month update limit
    if (
      providedDate.getMonth() < currentDate.getMonth() ||
      providedDate.getFullYear() < currentDate.getFullYear()
    )
      return Response.json(
        { error: "Updates for last month are not allowed" },
        { status: 401 }
      );

    // own update attendance limit
    if (
      !ADMIN_HOD_EDITOR.includes(user.role) &&
      user._id.toString() === employee &&
      (body.from || body.to)
    )
      return Response.json(
        { error: "Can't create attendance for yourself" },
        { status: 401 }
      );

    // limit creating attendance in advance
    if (
      foundRole?.attendances?.includes(LIMIT_ATTENDANCE_CREATING_ADVANCE) &&
      body.status === "Arrived"
    ) {
      if (body.checkIn?.time) {
        const shiftStartTime = dayjs(
          `${schedule.from} ${dayjs(date).format("YYYY-MM-DD")}`
        );

        const recordTime = dayjs();
        const isShouldCheckIn = shiftStartTime.isBefore(recordTime);

        if (!isShouldCheckIn)
          return Response.json(
            { error: "can't create attendance in advance" },
            { status: 401 }
          );
      }

      // limit creating attendance in advance
      if (body.checkOut?.time) {
        const scheduleObj = await ScheduleModel.findById(schedule);
        if (!scheduleObj)
          return Response.json(
            { error: "schedule not found" },
            { status: 401 }
          );

        const shiftEnd = getShiftEnd(scheduleObj, date);
        let shiftEndTime = dayjs(shiftEnd);

        const isShouldCheckOut = shiftEndTime.isBefore(dayjs());

        if (!isShouldCheckOut)
          return Response.json(
            { error: "can't create attendance in advance" },
            { status: 401 }
          );
      }
    }
  }

  const formatDate = dayjs(date).format("YYYY-MM-DD");

  const updateData = {
    ...other,
    schedule,
    createdBy: user._id,
  };

  if (body.leave) {
    if (foundRole && foundRole.attendances?.includes(LIMIT_LEAVE_CREATING))
      return Response.json({ error: "not allow" }, { status: 401 });

    updateData.fromModel = body.isPublicHoliday ? "Holiday" : "Leave";
  }

  if (body.notif === "from popup" && ADMIN !== user.role) {
    updateData.updated = {
      state: true,
      by: user._id,
    };
  }

  let attendance;

  try {
    delete updateData._id;
    attendance = await AttendanceModel.findOneAndUpdate(
      { employee, date: new Date(formatDate).toISOString() },
      updateData,
      { new: true, upsert: true }
    )
      .select(
        "checkIn checkOut schedule employee status date leave overtimeRequest overtime fromModel"
      )
      .populate("schedule", "name from to color")
      .populate("leave", "name color")
      .populate("employee", "name nickname employeeId");
  } catch (error: any) {
    console.log("error when create attendance", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }

  await saveUpdateData({
    title: "attendances",
    context: attendance._id,
    fromModel: "Attendance",
    employee: user._id,
    data: body,
  });

  if (body.notif === "from popup") {
    const admins = await EmployeeModel.find({
      isPublic: true,
      company: user.company,
      role: "admin",
    }).select("_id");

    const toUser = admins.filter(
      (i) => i._id.toString() !== user._id.toString()
    );

    const emp = await EmployeeModel.findById(attendance.employee);

    if (!emp) return Response.json({ error: "no user found" }, { status: 404 });

    const notificationData = {
      ref: `create attendance by ${user.name}`,
      title: `${user.nickname ? user.nickname : user.name} create attendance for ${emp._id.toString() === user._id.toString() ? (user.gender === "Male" ? "him" : "her") : emp.nickname ? emp.nickname : emp.name}`,
      route: `/planner/detail`,
      company: user.company,
      search: { date: formatDate },
      content: emp._id,
      contentType: "attendances",
      toUser: toUser.map((i) => i._id),
      from: user.company,
      fromModel: "Company",
    };

    const notification = await createNotification(notificationData);

    toUser.forEach((i) => sendNotification(i._id.toString(), notification));
    return Response.json(attendance);
  }

  if (body.shiftStatus === "Copy Schedule") {
    const shiftData = {
      date: attendance.date,
      schedule: attendance.schedule,
      employee: attendance.employee,
      status: "Copy Schedule",
      ref: "create by system due to copy scheudle",
      createdBy: user._id,
    };

    await ShiftModel.findOneAndUpdate(
      { employee, date: new Date(formatDate).toISOString() },
      shiftData,
      { new: true, upsert: true }
    );
    const toUser = await EmployeeModel.find({
      $or: [{ role: "admin" }, { department: user.department, role: "editor" }],
    }).select("_id");

    const notificationData = {
      ref: "need to create shift alert",
      title: `Need to create shift for ${attendance.employee.name}`,
      search: { date: formatDate },
      company: user.company,
      content: attendance.employee._id,
      route: "planner",
      contentType: "attendance",
      toUser: toUser.map((i) => i._id),
      from: user.company,
      fromModel: "Company",
    };

    const notification = await createNotification(notificationData);

    toUser.forEach((i) => {
      sendNotification(i._id.toString(), notification);
    });
    return;
  }

  const employees = await EmployeeModel.find({
    _id: { $nin: user._id },
    role: "admin",
  }).select("_id");

  employees.forEach((employee) => {
    sendNotification(employee._id.toString(), {
      title,
      content: employee,
      route: "planner",
      contentType: "attendances",
      from: { name: user.name, profile: user.profile },
      search: { date: dayjs(attendance?.date).format("YYYY-MM-DD") },
      ago: new Date(),
    });
  });

  return Response.json(attendance);
}

export async function PUT() {
  return Response.json({ name: "attendance put" });
}

export async function DELETE() {
  return Response.json({ name: "attendance delete" });
}
