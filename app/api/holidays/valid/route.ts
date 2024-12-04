import { getUser } from "@/data/user";
import { ADMIN_FINANCE_EDITOR_GROUP_ADMIN } from "@/roles";
import { NextRequest } from "next/server";
import AttendanceModel from "../../../../models/attendances/model";
import EmployeeModel from "../../../../models/employees/model";
import HolidayModel from "../../../../models/holidays/model";

export async function GET(request: NextRequest) {
  const user = await getUser();
  if (!user || !ADMIN_FINANCE_EDITOR_GROUP_ADMIN.includes(user.role))
    return new Response("error", { status: 401 });

  const searchParams = request.nextUrl.searchParams;
  const employee = searchParams.get("employee");
  if (!employee)
    return new Response("employee id is required!", { status: 401 });

  const employeeObj = await EmployeeModel.findById(employee).select(
    "company department branch joinedDate gender nationality"
  );

  if (!employeeObj)
    return new Response("user not found to find valid holidays", {
      status: 404,
    });

  const holidays = await HolidayModel.find({
    company: user.company,
    isPublic: true,
    excludeCountries: { $nin: [user.nationality] },
    countries: { $in: ["All", user.nationality] },
  }).select("_id name");

  const currentYear = new Date().getFullYear();
  const alreadyExist = await AttendanceModel.find({
    employee,
    leave: { $in: holidays.map((i) => i._id) },
    $and: [
      { date: { $lte: new Date(), $gte: employeeObj.joinedDate } },
      {
        date: {
          $gte: new Date(`${currentYear}-01-01`),
          $lt: new Date(`${currentYear + 1}-01-01`),
        },
      },
    ],
  }).populate("leave", "name");

  const response = await HolidayModel.find({
    isPublic: true,
    _id: { $nin: alreadyExist.map((i) => i.leave) },
    company: employeeObj.company,
    excludeCountries: { $nin: [employeeObj.nationality] },
    countries: { $in: ["All", employeeObj.nationality] },
    $and: [
      { date: { $lte: new Date(), $gte: employeeObj.joinedDate } },
      {
        date: {
          $gte: new Date(`${currentYear}-01-01`),
          $lt: new Date(`${currentYear + 1}-01-01`),
        },
      },
    ],
  });
  return Response.json(response);
}

export async function POST() {
  return Response.json({ name: "leaves post" });
}

export async function PUT() {
  return Response.json({ name: "leaves put" });
}

export async function DELETE() {
  return Response.json({ name: "leaves delete" });
}
