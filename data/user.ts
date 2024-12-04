"use server";
import connectMongo from "@/config/mongo";
import { verifySession } from "@/lib/session";
import { authMiddleware } from "@/middlewares/auth";
import CompanyModel from "@/models/companies/model";
import { EmployeeType } from "@/types";
import { cache } from "react";
import EmployeeModel from "../models/employees/model";

export const getUser = cache(async () => {
  await connectMongo();
  const session = await verifySession();
  if (!session) return;
  const sub = await authMiddleware(session.sub as string);
  console.log("from getUser()", sub);
  if (!sub) return;
  const data = await EmployeeModel.findOneAndUpdate(
    { _id: sub },
    { isActive: { isActive: true, activeAt: new Date() } }
  );
  const response = userDTO(data) as EmployeeType;
  return response;
});

export const getCompany = cache(async () => {
  await connectMongo();
  const user = await getUser();
  if (!user) return;
  if (!user) return;
  const data = await CompanyModel.findOne({
    _id: user.company,
  });
  return data;
});

export const getRole = cache(async () => {
  await connectMongo();
  const session = await verifySession();
  if (!session) return;
  const sub = await authMiddleware(session.sub as string);
  if (!sub) return;
  const data = await EmployeeModel.findOneAndUpdate(
    { _id: sub },
    { isActive: { isActive: true, activeAt: new Date() } }
  ).select("role");
  return data.role;
});

function userDTO(user: EmployeeType) {
  return {
    role: user.role,
    _id: user._id,
    name: user.name,
    nickname: user.nickname,
    employeeId: user.employeeId,
    profile: user.profile,
    position: user.position,
    department: user.department,
    branch: user.branch,
    company: user.company,
    gender: user.gender,
  };
}
