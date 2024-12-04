import { getUser } from "@/data/user";
import { roles } from "@/roles";
import { LeaveAdjustmentType, LeaveType } from "@/types";
import dayjs from "dayjs";
import { Types } from "mongoose";
import { getTotalLeave } from "./getTotalLeave";
import AttendanceModel from "@/models/attendances/model";
import EmployeeModel from "@/models/employees/model";
import LeaveModel from "@/models/leaves/model";

export const getAllLeaveAdjustments = async (
  searchParams: {
    [key: string]: string | string[] | undefined;
  },
  employeeIds: string[]
) => {
  const user = await getUser();
  if (!user) return;
  const { leave, size, pageParam } = searchParams;
  const start = (Number(pageParam) - 1) * Number(size);

  const foundRole = roles.find((r) => r.name === user.role);
  const allowReadRole =
    foundRole?.allRecord && foundRole.allRecord.includes("leaveAdjustments");

  if (!leave) return { error: "leave not found" };

  const attendances = await AttendanceModel.find({
    leave,
    employee: { $in: employeeIds },
  }).select("leaves employee date leave department");

  let leaveObj = (await LeaveModel.findById(leave)) as LeaveType;
  // .populate( "carryLeave");

  if (!leaveObj) return { error: "leave not found" };

  const employees = await EmployeeModel.find({
    _id: { $in: employeeIds },
  }).select(
    "joinedDate name nickname maritalStatus contactInfo employeeId gender nationality"
  );

  const excludedDays = await AttendanceModel.find({
    employee: { $in: employeeIds },
    $or: [
      { status: { $in: leaveObj.excludeDays } },
      {
        leave: {
          $in: leaveObj.excludeDays.filter((i) =>
            Types.ObjectId.isValid(i.toString())
          ),
        },
      },
    ],
  }).select("employee date");

  const dataArray: any = [];

  await Promise.all(
    employees.map(async (employee) => {
      const empAttendances = attendances.filter(
        (attendance) =>
          attendance.employee.toString() === employee._id.toString() &&
          (dayjs(employee.joinedDate).isBefore(dayjs(attendance.date)) ||
            dayjs(employee.joinedDate).isSame(dayjs(attendance.date)))
      );

      const excludeAttendances = excludedDays.filter(
        (attendance) =>
          attendance.employee.toString() === employee._id.toString() &&
          (dayjs(employee.joinedDate).isBefore(dayjs(attendance.date)) ||
            dayjs(employee.joinedDate).isSame(dayjs(attendance.date)))
      );

      const leave: LeaveAdjustmentType = getTotalLeave({
        employee,
        leaveObj,
        allLeaves: empAttendances,
        excludedDays: excludeAttendances,
      });

      //calculate carry leave
      if (leaveObj.carryLeave) {
        const attendances = await AttendanceModel.find({
          leave: leaveObj.carryLeave._id,
          employee: { $in: employeeIds },
        }).select("leaves employee date leave department");

        const empAttendances = attendances.filter(
          (attendance) =>
            attendance.employee.toString() === employee._id.toString() &&
            (dayjs(employee.joinedDate).isBefore(dayjs(attendance.date)) ||
              dayjs(employee.joinedDate).isSame(dayjs(attendance.date)))
        );

        const excludeAttendances = excludedDays.filter(
          (attendance) =>
            attendance.employee.toString() === employee._id.toString() &&
            (dayjs(employee.joinedDate).isBefore(dayjs(attendance.date)) ||
              dayjs(employee.joinedDate).isSame(dayjs(attendance.date)))
        );

        const carryLeave = getTotalLeave({
          employee,
          leaveObj: leaveObj.carryLeave,
          allLeaves: empAttendances,
          excludedDays: excludeAttendances,
        });

        leave.carryLeave = carryLeave.nowAvailable;
        leave.nowAvailable = leave.nowAvailable + carryLeave.nowAvailable;
      }

      dataArray.push(leave);
    })
  );

  return dataArray;
};
