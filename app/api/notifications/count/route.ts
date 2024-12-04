import { getUser } from "@/data/user";
import UserNotification from "@/models/notifications/model";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "invalid" }, { status: 404 });

  const params = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(params);
  const unread = (searchParams.unread || "1") as string;

  const query: any = {
    isPublic: true,
    company: user.company,
    from: { $ne: user._id },
  };

  query.$or = [{ toUser: { $in: user._id } }, { toAll: true }];

  if (unread) {
    query.read = {
      $not: {
        $elemMatch: { readBy: user._id },
      },
    };
  }

  const notifications = await UserNotification.countDocuments();

  return Response.json(notifications);
}
