import { getUser } from "@/data/user";
import EmployeeModel from "@/models/employees/model";
import WarningModel from "@/models/warnings/model";
import { ADMIN, ADMIN_HOD } from "@/roles";
import { EmployeeType } from "@/types";
import { NextRequest } from "next/server";
import {
  createNotification,
  saveUpdateData,
  sendNotification,
  updateNotification,
} from "../action";
import { getWarningQuery } from "./action";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(q);
  const { size = 10, page = 1 } = searchParams;
  const start = (Number(page) - 1) * Number(size);
  const query = await getWarningQuery({ searchParams });

  const data = await WarningModel.find(query)
    .sort({ createdAt: -1 })
    .populate("employee", "name nickname profile employeeId")
    .skip(start)
    .limit(Number(size));

  return Response.json(data);
}

const updateWarning = async (
  request: NextRequest,
  user: EmployeeType,
  body: any
) => {
  const { informTo, witnessedBy, issuedBy, status } = body;
  const updatedData = body;

  if (status === "approved" || status === "rejected") {
    if (!ADMIN_HOD.includes(user.role)) {
      return status(401).json({ error: "not allow" });
    }
    updatedData.approvedBy = user._id;
  }

  const updateQuery: any = { _id: body._id, status: "pending" };
  if (ADMIN === user.role) delete updateQuery.status;

  const updated = await WarningModel.findOneAndUpdate(updateQuery, updatedData);

  console.log("req.body", updated);

  if (!updated)
    return Response.json({ error: "warning not found" }, { status: 404 });

  await saveUpdateData({
    title: "warnings",
    context: updated._id,
    fromModel: "Warning",
    employee: user._id,
    data: body,
  });

  const toUser = [...informTo, ...witnessedBy, issuedBy];
  const notification = await updateNotification({
    toUser,
    content: updated._id,
  });

  toUser.forEach((i) => {
    sendNotification(i.toString(), notification);
  });

  return Response.json({ message: "success" });
};

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "invalid" }, { status: 404 });

  const body = await request.json();
  console.log("data", body);
  const { employees = [], informTo, witnessedBy, issuedBy, state, edit } = body;

  if (edit) return updateWarning(request, user, body);

  const employeeObjs = await EmployeeModel.find({ _id: { $in: employees } });

  const toUser = [...informTo, ...witnessedBy, issuedBy];

  await Promise.all(
    employees.map(async (i: string) => {
      const employeeObj = employeeObjs.find((e) => e._id.toString() === i);
      const data = {
        ...body,
        employee: i,
        createdBy: user._id,
        department: employeeObj?.department,
        branch: employeeObj?.branch,
        company: user.company,
      };

      let warningData = new WarningModel(data);
      await warningData.save();

      if (state === "published") {
        const notificationData = {
          ref: "from warning creation",
          title: "created " + warningData.title + " warning",
          route: "relations",
          company: user.company,
          content: warningData._id,
          contentModel: "Warning",
          contentType: "warnings",
          toUser: [...toUser, i],
          from: issuedBy,
          fromModel: "Employee",
        };

        const notification = await createNotification(notificationData);

        toUser.forEach((i) => {
          sendNotification(i.toString(), notification);
        });
      }
    })
  );

  return Response.json({ message: "success" });
}

export async function PUT() {
  return Response.json({ name: "warnings put" });
}

export async function DELETE() {
  return Response.json({ name: "warnings delete" });
}
