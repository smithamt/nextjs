import connectMongo from "@/config/mongo";
import EmployeeModel from "@/models/employees/model";
import { ADMIN } from "@/roles";
import { TitleType } from "@/types";
import { Types } from "mongoose";
import { cookies } from "next/headers";
import { getUser } from "./user";

export const getEmployeeQuery = async (
  searchParams: { [key: string]: string | string[] | undefined },
  state?: TitleType
) => {
  await connectMongo();
  const user = await getUser();
  if (!user) return;
  const query: any = { isPublic: true };

  let position = searchParams.position as string;
  let department = searchParams.department as string;
  let branch = searchParams.branch as string;

  if (!department)
    department = cookies().get(`${user.role}${state}departments`)?.value || "";
  if (!position)
    position = cookies().get(`${user.role}${state}positions`)?.value || "";
  if (!branch)
    branch = cookies().get(`${user.role}${state}branches`)?.value || "";

  const search = searchParams.search as string;
  if (search) {
    const searchPattern = new RegExp(search, "i");
    query.$or = [
      { name: { $regex: searchPattern } },
      { keyword: { $regex: searchPattern } },
      { employeeId: { $regex: searchPattern } },
      { type: { $regex: searchPattern } },
    ];
  }

  if (Types.ObjectId.isValid(department)) query.department = department;
  if (Types.ObjectId.isValid(position)) query.position = position;
  if (Types.ObjectId.isValid(branch)) query.branch = branch;

  if (user.role !== ADMIN) query.department = user.department;
  if (user.role !== ADMIN) query.branch = user.branch;

  return query;
};

export const getEmployees = async (
  searchParams: { [key: string]: string | string[] | undefined },
  state?: TitleType
) => {
  await connectMongo();
  const page = (searchParams.page || "1") as string;
  const query = await getEmployeeQuery(searchParams, state);

  const limit = Number(page) * 10;
  const employees = await EmployeeModel.find(query)
    .select(
      "name profile employeeId nickname contactNo isActive email currentAddress"
    )
    .populate("position", "name isHeadOfDepartment")
    .limit(limit);

  const count = await EmployeeModel.countDocuments(query);

  return { employees, count };
};
