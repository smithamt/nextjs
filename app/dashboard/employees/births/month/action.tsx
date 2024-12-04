import EmployeeModel from "@/models/employees/model";
import { ADMIN } from "@/roles";
import { EmployeeType } from "@/types";

export const getBirthMonthsDashboard = async ({
  user,
  searchParams,
}: {
  user: EmployeeType;
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const { next = 0 } = searchParams;
  const monthOfMay = new Date().getMonth() + (next ? Number(next) : 1) + 1;
  const matchQuery: any = {
    isPublic: true,
    company: user.company,
    monthOfBirth: monthOfMay,
  };

  if (ADMIN !== user.role) matchQuery.department = user.department;

  const employees = await EmployeeModel.aggregate([
    {
      $project: {
        username: 1,
        nickname: 1,
        name: 1,
        profile: 1,
        employeeId: 1,
        department: 1,
        company: 1,
        dateOfBirth: 1,
        isPublic: 1,
        joinedDate: 1,
        monthOfBirth: { $month: "$dateOfBirth" },
      },
    },
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: "departments",
        localField: "department",
        foreignField: "_id",
        as: "departmentDetails",
      },
    },
    {
      $unwind: {
        path: "$departmentDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
    { $limit: 6 },
  ]).exec();

  return employees;
};

export const getBirthMonths = async ({
  user,
  searchParams,
  state = "month",
}: {
  user: EmployeeType;
  searchParams: { [key: string]: string | string[] | undefined };
  state: "month" | "week" | "day";
}) => {
  const { next = 0 } = searchParams;
  const monthOfMay = new Date().getMonth() + (next ? Number(next) : 1) + 1;
  const matchQuery: any = {
    isPublic: true,
    company: user.company,
    monthOfBirth: monthOfMay,
  };

  if (ADMIN !== user.role) matchQuery.department = user.department;

  const employees = await EmployeeModel.aggregate([
    {
      $project: {
        username: 1,
        nickname: 1,
        name: 1,
        profile: 1,
        employeeId: 1,
        department: 1,
        company: 1,
        dateOfBirth: 1,
        isPublic: 1,
        joinedDate: 1,
        monthOfBirth: { $month: "$dateOfBirth" },
      },
    },
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: "departments",
        localField: "department",
        foreignField: "_id",
        as: "departmentDetails",
      },
    },
    {
      $unwind: {
        path: "$departmentDetails",
        preserveNullAndEmptyArrays: true,
      },
    },
  ]).exec();

  return employees;
};
