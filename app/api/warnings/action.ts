import connectMongo from "@/config/mongo";
import { getEmployeeQuery } from "@/data/employees";
import EmployeeModel from "@/models/employees/model";

export const getWarningQuery = async ({
  searchParams,
}: {
  searchParams: any;
}) => {
  await connectMongo();

  const { startDate, endDate, pending } = searchParams;
  const empQuery = await getEmployeeQuery(searchParams, "warnings");
  const employees = await EmployeeModel.find(empQuery).select("id");

  const query: any = {
    isPublic: true,
    employee: { $in: employees.map((e) => e._id) },
  };

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string),
    };
  }

  if (pending === "true") query.status = "pending";

  return query;
};
