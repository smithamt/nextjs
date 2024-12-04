import connectMongo from "@/config/mongo";
import WarningModel from "@/models/warnings/model";
import { NextRequest } from "next/server";
import { getWarningQuery } from "../action";

export async function GET(request: NextRequest) {
  await connectMongo();
  const q = request.nextUrl.searchParams;
  const searchParams = Object.fromEntries(q);
  const query = await getWarningQuery({ searchParams });
  const count = await WarningModel.countDocuments(query);

  return Response.json(count);
}
