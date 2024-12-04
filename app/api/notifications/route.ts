import { getUser } from "@/data/user";
import UserNotification from "@/models/notifications/model";
import { NotificationType } from "@/types";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user) return Response.json({ error: "invalid" }, { status: 404 });

  const params = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(params);
  const page = (searchParams.page || "1") as string;
  const unread = (searchParams.unread || "1") as string;
  const limit = Number(page) * 10;

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

  const notifications = await UserNotification.find()
    .select(
      "from createdAt title content route fromModel read contentType search"
    )
    .populate("from", "name nickname profile keyword isActive state")
    .sort({ createdAt: -1 })
    .limit(Number(limit));

  const filterNotifications = notifications.map((i) => {
    const notiObj = i.toObject();
    const read = notiObj.read?.some(
      (i: any) => i.readBy.toString() === user._id.toString()
    );
    return { ...notiObj, read: read ? true : false };
  }) as NotificationType[];
  return Response.json(filterNotifications);
}

export async function POST() {
  return Response.json({ name: "notifications post" });
}

export async function PUT() {
  return Response.json({ name: "notifications put" });
}

export async function DELETE() {
  return Response.json({ name: "notifications delete" });
}
