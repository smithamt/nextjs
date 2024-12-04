import { webpush } from "@/config/webpush";
import { getUser } from "@/data/user";
import { getDaysBetweenDates } from "@/lib/utils";
import AttendanceModel from "@/models/attendances/model";
import EmployeeModel from "@/models/employees/model";
import HolidayModel from "@/models/holidays/model";
import ImageCollectionModel from "@/models/imagescollections/model";
import LeaveRequestModel from "@/models/leaverequests/model";
import LeaveModel from "@/models/leaves/model";
import WebPushModel from "@/models/webpush/webpush";
import { LeaveRequestType, LeaveType } from "@/types";
import { Types } from "mongoose";
import { NextRequest } from "next/server";
import { createNotification, sendNotification } from "../action";
import { getTotalLeave } from "../leaves/action";
import { getLeaveRequestQuery } from "./action";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user)
    return Response.json({ error: "User not found!" }, { status: 404 });

  const q = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(q);
  const { size = 10, page = 1 } = searchParams;
  const query = await getLeaveRequestQuery(searchParams, user);
  const limit = Number(size) * Number(page);

  const data: LeaveRequestType[] = await LeaveRequestModel.find(query)
    .sort({ createdAt: -1 })
    .populate([
      {
        path: "employee leaves.approvedBy approvedBy createdBy",
        select: "name department profile employeeId nickname isActive isPublic",
      },
      { path: "leaves.leave", select: "name color" },
    ])
    .limit(limit);

  return Response.json(data);
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user)
    return Response.json({ error: "User not found!" }, { status: 404 });

  const body = await request.json();
  const { leaves, employee } = body as LeaveRequestType;
  const employeeObj = await EmployeeModel.findById(employee);
  if (!employeeObj)
    return Response.json({ error: "Employee not found!" }, { status: 404 });

  const data = {
    ...body,
    createdBy: user._id,
    employee: employeeObj._id,
    ref: "update leave request creating",
    company: user.company,
    department: employeeObj.department,
  };

  const requestItems = await Promise.all(
    leaves.map(async (l, k) => {
      const { from, to } = l;
      const doesExist = await LeaveRequestModel.exists({
        isPublic: true,
        employee: employeeObj._id,
        $or: [
          { "leaves.from": { $lte: to }, "leaves.to": { $gte: from } },
          { "leaves.from": { $gte: from, $lte: to } },
        ],
      });

      if (!body._id && doesExist)
        return { error: `Leave Request already exist for line ${k + 1}` };

      const holiday = await HolidayModel.findById(l._id);
      if (!from || !to)
        return {
          error: `start day and end day are required, error found in ${k + 1}`,
        };

      const leaveType = (await LeaveModel.findById(l._id)) as LeaveType;
      const requestDays = getDaysBetweenDates(new Date(l.from), new Date(l.to));

      if (!leaveType && !holiday)
        return { error: `invalid date, error found in ${k + 1}` };

      if (
        !leaveType?.saveMinimumDay.includes(
          employeeObj.department.toString()
        ) &&
        leaveType?.minimumDays &&
        requestDays.length < leaveType.minimumDays
      )
        return {
          error: `Minimum day must be ${leaveType.minimumDays} ${leaveType.minimumDays > 1 ? "days" : "day"}`,
        };

      if (leaveType && leaveType.allowDays < requestDays.length)
        return {
          error: `Allow Days is ${leaveType.allowDays} for ${leaveType.name}, error found in ${
            k + 1
          }`,
        };

      const attendances = await AttendanceModel.find({
        leave: leaveType?._id,
        employee: employeeObj._id,
      }).select("leaves employee date leave department");

      const excludeAttendances = await AttendanceModel.find({
        employee: employeeObj._id,
        $or: [
          { status: { $in: leaveType?.excludeDays } },
          {
            leave: {
              $in: leaveType?.excludeDays.filter((i) =>
                Types.ObjectId.isValid(i.toString())
              ),
            },
          },
        ],
      }).select("employee date");

      if (!holiday) {
        const isRemainLeave = getTotalLeave({
          employee: employeeObj,
          leaveObj: leaveType,
          allLeaves: attendances,
          excludedDays: excludeAttendances,
        });

        if (isRemainLeave.nowAvailable < requestDays.length)
          return { error: "Leave balance error" };
      }

      const leaveData: any = {
        leave: l._id,
        //@ts-ignore
        fromModel: l.isPublicHoliday ? "Holiday" : "Leave",
        from: l.from,
        to: l.to,
        status: "pending",
      };

      if (Array.isArray(l.attendedFiles)) {
        const attendedFiles = await ImageCollectionModel.create({
          author: employeeObj._id,
          description: `${leaveType?.name} request of ${employeeObj.name}`,
          images: l.attendedFiles,
          createdBy: user._id,
        });
        leaveData.attendedFiles = attendedFiles._id;
      }

      return leaveData;
    })
  );

  const errors = requestItems.filter((i) => i?.error);

  if (errors.length > 0)
    return Response.json(
      { error: `${errors.map((i) => i.error)}` },
      { status: 404 }
    );

  data.leaves = requestItems.filter((i) => !i.error);

  let _id = new Types.ObjectId();
  if (body._id) {
    const leave = await LeaveRequestModel.exists({
      status: "pending",
      _id: body._id,
    });
    if (!leave) return;
    Response.json(
      { error: "not allow to update this leave request" },
      { status: 404 }
    );
    _id = body._id;
  }

  const response = await LeaveRequestModel.findOneAndUpdate({ _id }, data, {
    new: true,
    upsert: true,
  }).populate([
    {
      path: "employee leaves.approvedBy approvedBy createdBy",
      select: "name department profile employeeId nickname isActive isPublic",
    },
    { path: "leaves.leave", select: "name color" },
  ]);

  const toUser = await EmployeeModel.find({
    isPublic: true,
    company: user.company,
    $or: [
      { role: { $in: ["admin"] } },
      {
        role: { $in: ["head_of_department", "editor", "group_admin"] },
        department: employee.department,
      },
    ],
  }).select("_id");

  const notificationData = {
    ref: "from leave request creation",
    title: "created new leave request",
    route: "relations",
    company: user.company,
    content: response._id,
    contentType: "leaveRequests",
    toUser: toUser.map((i) => i._id),
    from: user._id,
    fromModel: "Employee",
  };

  const notification = await createNotification(notificationData);

  toUser.map(async (employee) => {
    sendNotification(employee._id.toString(), notification);
  });

  const subscriptions = await WebPushModel.find({
    employee: { $in: toUser.map((i) => i._id) },
  });

  console.log("subscription", subscriptions);

  const payload = JSON.stringify({
    title: `Create new leave request by ${user.name}`,
    body: "This is a leave request notification",
  });

  subscriptions.map((data) =>
    webpush
      .sendNotification(data.subscription, payload)
      .catch((error: any) => console.error(error))
  );
  return Response.json(response);
}

export async function PUT() {
  return Response.json({ name: "leaverequests put" });
}
