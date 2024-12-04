import { getUser } from "@/data/user";
import AppraisalModel, { ENUM_REF_ID } from "@/models/appraisals/model";
import EmployeeModel from "@/models/employees/model";
import { ADMIN } from "@/roles";
import { RatingType } from "@/types";
import { NextRequest } from "next/server";
import {
  createNotification,
  saveUpdateData,
  sendNotification,
} from "../action";

export async function GET() {
  return Response.json({ name: "appraisals get" });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user)
    return Response.json({ error: "User not found!" }, { status: 404 });

  const body = await request.json();

  console.log("employee", body);

  const employee = await EmployeeModel.findById(body.employee);
  if (!employee)
    return Response.json({ name: "employee not found" }, { status: 404 });

  if (!ENUM_REF_ID.includes(body.refId))
    return Response.json({ name: "invalid refid" }, { status: 401 });

  const needRating = body.evaluations.filter((a: RatingType) => !a.rating);
  if (needRating.length > 0)
    return Response.json(
      { error: "Please enter rating for all evaluation" },
      { status: 401 }
    );

  const response = await AppraisalModel.findOneAndUpdate(
    {
      employee: body.employee,
      refId: body.refId,
    },
    {
      ...body,
      employee: body.employee,
      reviewedBy: body.reviewedBy ? body.reviewedBy : user._id,
      evaluations: body.evaluations,
      developmentplans: body.developmentplans,
      refId: body.refId,
      isPublic: body.state === "published" ? true : false,
      company: user.company,
      createdBy: user._id,
    },
    { upsert: true, new: true }
  );

  if (!response) return Response.json({ error: "not found" }, { status: 404 });

  await saveUpdateData({
    title: "appraisals",
    context: response._id,
    fromModel: "Appraisal",
    employee: user._id,
    data: body,
  });

  if (body.state === "published") {
    const toUser = await EmployeeModel.find({
      role: ADMIN,
      company: user.company,
    }).select("_id");

    const notificationData = {
      ref: "from appraisal creation",
      title: `Created appraisal for ${employee.nickname ? employee.nickname : employee.name}`,
      company: user.company,
      content: response._id,
      route: "employees",
      contentType: "appraisals",
      toUser: toUser.map((i) => i._id),
      from: user._id,
      fromModel: "Employee",
    };

    const notification = await createNotification(notificationData);

    toUser.map(async (employee) => {
      sendNotification(employee._id.toString(), notification);
    });
  }
  return Response.json(response);
}

export async function PUT() {
  return Response.json({ name: "appraisals put" });
}

export async function DELETE() {
  return Response.json({ name: "appraisals delete" });
}
