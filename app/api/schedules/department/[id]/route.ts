import { getUser } from "@/data/user";
import { Types } from "mongoose";
import { NextRequest } from "next/server";
import ScheduleModel from "../../../../../models/schedules/model";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user) return new Response("error", { status: 401 });

  const { id } = params;

  console.log("params", params);
  const query: any = {
    company: user.company,
    isPublic: true,
  };

  if (Types.ObjectId.isValid(id))
    query.$or = [{ department: id }, { allDepartment: true }];

  const response = await ScheduleModel.find(query).sort({ from: 1 });
  return Response.json(response);
}
