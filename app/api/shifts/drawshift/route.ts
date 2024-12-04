import { getUser } from "@/data/user";
import ShiftModel from "@/models/shifts/model";
import {
    ADMIN_FINANCE_EDITOR_GROUP_ADMIN,
    ADMIN_HOD_EDITOR_GROUP_ADMIN,
} from "@/roles";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user || !ADMIN_FINANCE_EDITOR_GROUP_ADMIN.includes(user.role))
    return new Response("error", { status: 401 });

  if (!ADMIN_HOD_EDITOR_GROUP_ADMIN.includes(user.role))
    return Response.json({ error: "no allow!" });

  const body = (await request.json()) as { employees: string[]; data: any[] };

  const { employees, data } = body;

  const response = await Promise.all(
    employees.map(async (employee) => {
      await Promise.all(
        data.map(async (shift) => {
          const { schedule, ...other } = shift;

          try {
            await ShiftModel.findOneAndUpdate(
              { employee, date: shift.date },
              {
                ...other,
                schedule: schedule,
                createdBy: user._id,
              },
              { new: true, upsert: true }
            );
          } catch (error: any) {
            return { error: error.message, ...shift };
          }
        })
      );
    })
  );

  return Response.json(response);
}
