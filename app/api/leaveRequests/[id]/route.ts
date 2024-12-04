import { getUser } from "@/data/user";
import AttendanceModel from "@/models/attendances/model";
import EmployeeModel from "@/models/employees/model";
import LeaveRequestModel from "@/models/leaverequests/model";
import UserNotification from "@/models/notifications/model";
import ShiftModel from "@/models/shifts/model";
import { ADMIN_HOD_EDITOR_GROUP_ADMIN, INFORM_TO } from "@/roles";
import { LeaveRequestType, RequestItemType } from "@/types";
import { NextRequest } from "next/server";
import {
  createNotification,
  saveRemoveData,
  sendNotification,
} from "../../action";
import { updateAttendanceLeaveApproved } from "./action";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user)
    return Response.json({ error: "User not found!" }, { status: 404 });

  const body = await request.json();

  if (
    !ADMIN_HOD_EDITOR_GROUP_ADMIN.includes(user.role) &&
    body.employee !== user._id.toString()
  ) {
    return Response.json({ error: "something went wrong" }, { status: 401 });
  }

  const { status, isPublic } = body;
  const leave = body;

  const leaveRequest = (await LeaveRequestModel.findById(params.id).populate(
    "employee leaves.leave",
    "name"
  )) as LeaveRequestType | undefined;

  if (!leaveRequest)
    return Response.json({ error: "Leave request not found" }, { status: 404 });

  const data: any = {
    "leaves.$.status": body.status,
    "leaves.$.approvedBy": user._id,
  };

  if (body.rejectReason) data["leaves.$.rejectReason"] = body.rejectReason;

  try {
    const updatedData = await LeaveRequestModel.updateOne(
      { _id: params.id, "leaves._id": leave._id },
      {
        $set: data,
        status,
        approvedBy: user._id,
      },
      { new: true }
    );

    if (body.status === "approved") {
      const leaveData = leaveRequest.leaves.find(
        (l) => l._id.toString() === leave._id
      ) as RequestItemType;

      await updateAttendanceLeaveApproved(leaveData, leaveRequest);
    }

    const toUser = leaveRequest.employee._id;

    let responseNotiData: any;

    if (isPublic || leaveRequest.isPublic) {
      const notificationData = {
        ref: "from leave request creation",
        title: `${status} ${
          leaveRequest.employee._id.toString() === user._id.toString()
            ? "your"
            : leaveRequest.employee.name
        } leave request`,
        message:
          isPublic || leaveRequest.isPublic
            ? `${status} request`
            : "Delete request!",
        route: "relations",
        company: user.company,
        content: leaveRequest._id,
        contentType: "leaveRequests",
        toUser: [toUser],
        from: user._id,
        fromModel: "Employee",
      };

      responseNotiData = await createNotification(notificationData);
    }

    sendNotification(toUser.toString(), responseNotiData);

    if (status !== "rejected") {
      const managers = await EmployeeModel.find({
        //@ts-ignore
        department: leaveRequest.employee.department,
        role: { $in: INFORM_TO },
      }).select("name");
      managers
        .filter((m) => m._id.toString() !== user._id.toString())
        .forEach((manager) =>
          sendNotification(manager._id.toString(), responseNotiData)
        );
    }
    return Response.json(updatedData);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user)
    return Response.json({ error: "User not found!" }, { status: 404 });

  const leaveRequest = await LeaveRequestModel.findByIdAndUpdate(params.id, {
    isPublic: false,
  });

  if (!leaveRequest)
    return Response.json({ error: "Leave request not found" }, { status: 404 });

  await saveRemoveData({
    title: "leaveRequests",
    context: leaveRequest._id,
    fromModel: "LeaveRequest",
    employee: user._id,
  });

  const attendances = await AttendanceModel.find({
    ref: leaveRequest._id,
  });

  const shifts = await ShiftModel.find({ ref: leaveRequest._id });

  await Promise.all(
    shifts.map(async (shi) => {
      shi.status = shi.schedule ? "Working Day" : "no status";
      await shi.save();
    })
  );

  await Promise.all(
    attendances.map(async (att) => {
      await AttendanceModel.findByIdAndUpdate(att._id, {
        $unset: { leave: 1 },
        status: att.checkIn?.time ? "Arrived" : "no status",
      });
    })
  );

  await UserNotification.findOneAndUpdate(
    { content: leaveRequest._id },
    {
      ref: "delete notification because cancel leave request",
      isPublic: false,
    },
    { new: true }
  );

  return Response.json(leaveRequest);
}
