import LeaveRequestModel from "@/models/leaverequests/model";
import { NextRequest } from "next/server";
import { getLeaveRequestQuery } from "../action";
import { getUser } from "@/data/user";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user)
    return Response.json({ error: "User not found!" }, { status: 404 });

  const q = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(q);
  const query = await getLeaveRequestQuery(searchParams, user);

  const data = await LeaveRequestModel.countDocuments(query);

  return Response.json(data);
}
