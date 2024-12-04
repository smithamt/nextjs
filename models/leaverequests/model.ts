import connectMongo from "@/config/mongo";
import { getDaysBetweenDates } from "@/lib/utils";
import { LeaveRequestType, StatusType } from "@/types";
import dayjs from "dayjs";
import mongoose, { Schema, model } from "mongoose";
import AttendanceModel from "../attendances/model";
import Company from "../companies/model";
import DepartmentModel from "../departments/model";
import EmployeeModel from "../employees/model";
import HolidayModel from "../holidays/model";
import ImageCollectionModel from "../imagescollections/model";
import LeaveModel from "../leaves/model";
import ShiftModel from "../shifts/model";

const RequestItem = new Schema({
  leave: {
    type: Schema.Types.ObjectId,
    refPath: "leaves.fromModel",
    required: true,
  },
  fromModel: {
    type: String,
    required: true,
    default: "Leave",
    enum: [LeaveModel.modelName, HolidayModel.modelName],
  },
  from: Date,
  to: Date,
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  attendedFiles: { type: Schema.Types.ObjectId, ref: ImageCollectionModel },
  rejectReason: String,
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },
});

const leaveRequestSchema = new Schema<LeaveRequestType>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: EmployeeModel,
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: Company,
      required: true,
      select: false,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: DepartmentModel,
      required: true,
      select: false,
    },
    ref: String,
    leaves: [RequestItem],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectReason: String,
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: EmployeeModel,
    },
    reason: {
      type: String,
      maxlength: [
        500,
        "The value of path `{PATH}` (`{VALUE}`) exceeds the maximum allowed length ({MAXLENGTH}).",
      ],
    },
    address: {
      type: String,
      maxlength: [
        500,
        "The value of path `{PATH}` (`{VALUE}`) exceeds the maximum allowed length ({MAXLENGTH}).",
      ],
    },
    emergencyContactName: { type: String, maxlength: 100 },
    emergencyContactNumber: { type: String, maxlength: 15 },
    emergencyContactRelationship: { type: String, maxlength: 15 },

    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  { timestamps: true }
);


leaveRequestSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate() as { status?: StatusType };
  console.log("update leavearequest", this.getUpdate(), this.getQuery());
  if (update.status !== "approved") return next();

  await connectMongo();

  const query = this.getQuery();

  const leaveRequest = (await LeaveRequestModel.findOne(query).populate(
    "leaves.leave",
    "name"
  )) as LeaveRequestType | undefined;

  if (!leaveRequest) throw new Error("leave request not found!");

  const leave = leaveRequest.leaves.find(
    (l) => l._id.toString() === query["leaves._id"]
  );

  if (!leave) throw new Error("leave request not found!");

  const { from, to } = leave;

  let dates = getDaysBetweenDates(new Date(from), new Date(to));
  console.log("dates", dates);

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

  next();
});

const LeaveRequestModel =
  mongoose.models.LeaveRequest || model("LeaveRequest", leaveRequestSchema);

export default LeaveRequestModel;
