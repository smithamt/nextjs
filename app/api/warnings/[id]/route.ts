import { getUser } from "@/data/user";
import UserNotification from "@/models/notifications/model";
import WarningModel from "@/models/warnings/model";
import { NextRequest } from "next/server";
import { saveRemoveData } from "../../action";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "invalid" }, { status: 404 });

  const response = await WarningModel.findOne({
    _id: params.id,
    isPublic: true,
    status: "pending",
  });

  if (!response)
    return Response.json({ error: "not allow to delete" }, { status: 401 });

  await saveRemoveData({
    title: "warnings",
    context: response._id,
    fromModel: "Warning",
    employee: user._id,
  });

  await WarningModel.findByIdAndUpdate(response._id, {
    isPublic: false,
  });

  await UserNotification.findOneAndUpdate(
    { content: response.id },
    { isPublic: false }
  );

  await saveRemoveData({
    title: "warnings",
    context: response._id,
    fromModel: "Warning",
    employee: user._id,
  });

  if (!response) return Response.json({ error: "not found" }, { status: 404 });

  await saveRemoveData({
    title: "warnings",
    context: response._id,
    fromModel: "Warning",
    employee: user._id,
  });

  return Response.json({ error: "delete" });
}
