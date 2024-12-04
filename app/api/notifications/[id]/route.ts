import { getUser } from "@/data/user";
import UserNotification from "@/models/notifications/model";
import { NextRequest } from "next/server";
import { saveRemoveData } from "../../action";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return Response.json({ error: "invalid" }, { status: 404 });

  if (user?.employeeId === "APIH770") {
    await UserNotification.findByIdAndDelete(params.id);
  } else {
    const notification = await UserNotification.findByIdAndUpdate(params.id, {
      isPublic: false,
    });
    await saveRemoveData({
      title: "notifications",
      context: notification._id,
      fromModel: "UserNotification",
      employee: user._id,
    });
  }

  return Response.json({ name: "notifications delete" });
}
