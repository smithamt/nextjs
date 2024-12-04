import { getEmployeeQuery } from "@/data/employees";
import EmployeeModel from "@/models/employees/model";
import { EmployeeType } from "@/types";
import { Types } from "mongoose";

export const getLeaveRequestQuery = async (
  searchParams: any,
  user: EmployeeType
) => {
  const { pending, startDate, endDate, leave } = searchParams;
  const empQuery = await getEmployeeQuery(searchParams, "leaveRequests");
  const employees = await EmployeeModel.find(empQuery).select("id");

  const query: any = {
    isPublic: true,
    company: user.company,
    employee: { $in: employees.map((e) => e._id) },
  };

  if (startDate && endDate) {
    query["leaves.from"] = {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string),
    };
  }

  if (Types.ObjectId.isValid(leave as string)) query["leaves.leave"] = leave;
  if (pending === "true") query.status = "pending";
  return query;
};
