import { getDaysBetweenDates } from "@/lib/utils";
import AttendanceModel from "@/models/attendances/model";
import ShiftModel from "@/models/shifts/model";
import { LeaveRequestType, RequestItemType } from "@/types";
import dayjs from "dayjs";

export const updateAttendanceLeaveApproved = async (
  leave: RequestItemType,
  leaveRequest: LeaveRequestType
) => {
  const { from, to } = leave;
  let dates = getDaysBetweenDates(new Date(from), new Date(to));
  console.log("dates", dates, from, to);

  // if (from && to) {
  //   let currentDate = dayjs(from);
  //   while (currentDate.isBefore(to) || currentDate.isSame(to)) {
  //     dates.push(new Date(currentDate.format("YYYY-MM-DD")));
  //     currentDate = currentDate.add(1, "day");
  //   }
  //   console.log("alldate", dates, dates.length, from, to);
  // }

  await Promise.all(
    dates.map(async (date) => {
      const day = dayjs(date).format("YYYY-MM-DD");
      const applicationFormatDate = new Date(day).toISOString();
      const toFindData = {
        employee: leaveRequest.employee,
        date: applicationFormatDate,
      };

      const attendanceData = {
        ref: leaveRequest._id,
        date: applicationFormatDate,
        employee: leaveRequest.employee,
        status: leave.leave.name,
        leave: leave.leave._id,
        fromModel: leave.fromModel,
      };

      try {
        await AttendanceModel.findOneAndUpdate(toFindData, attendanceData, {
          upsert: true,
        });
        await ShiftModel.findOneAndUpdate(
          toFindData,
          { status: leave.leave.name, ref: leaveRequest._id },
          { upsert: true }
        );
      } catch (error: any) {
        console.log("attendances error", error);
        throw Error(error.message);
      }
    })
  );
};
