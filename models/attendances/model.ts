import { AttendanceType } from "@/types";
import mongoose, { Schema, model } from "mongoose";
import EmployeeModel from "../employees/model";
import HolidayModel from "../holidays/model";
import LeaveModel from "../leaves/model";
import ScheduleModel from "../schedules/model";

const checkInFieldSchema = new Schema({
  time: Date,
  device: String,
  method: {
    type: String,
    enum: ["website", "fingerprint", "mobile", "planner", "import"],
  },
  location: {
    type: {
      type: [String],
    },
    coordinates: {
      type: [Number],
    },
  },
  status: String,
  remark: { type: String, max: 500 },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },
});

const Leave = LeaveModel;
const Holiday = HolidayModel;

const attendanceSchema = new Schema<AttendanceType>(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    leave: { type: Schema.Types.ObjectId, refPath: "fromModel" },
    fromModel: { type: String, enum: ["Leave", "Holiday"] },
    date: { type: Date, required: true },
    overtime: Number,
    overtimeRequest: { type: Schema.Types.ObjectId, ref: "OvertimeRequest" },
    ref: String,
    schedule: { type: Schema.Types.ObjectId, ref: ScheduleModel },
    remarkBy: { type: Schema.Types.ObjectId, ref: EmployeeModel },
    remark: String,
    status: { type: String, default: "no status" },
    halfOff: { type: String, enum: ["Morning Half Off", "Evening Half Off"] },
    checkIn: checkInFieldSchema,
    checkOut: checkInFieldSchema,

    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  { timestamps: true }
);

// attendanceSchema.pre("save", async function (next) {
//   const { status, leave, employee } = this;

//   if (status === "Off" || status === "no status" || status === "Absence")
//     await AttendanceModel.updateOne(
//       { _id: this._id },
//       { $unset: { leave: 1 } }
//     );

//   if (leave) {
//     const leaveObj = await Leave.findById(leave);
//     const user = await EmployeeModel.findById(employee);

//     if (leaveObj) {
//       const validLeave = filterLeaves(leaveObj, user);
//       if (!user) return;

//       if (leaveObj) {
//         const validleave = filterLeaves(leaveObj, user);
//         if (!validleave) throw new Error("invalid leave");

//         const attendances = await AttendanceModel.find({
//           leave,
//           employee: user._id,
//         }).select("leaves employee date leave department");

//         const excludeAttendances = await AttendanceModel.find({
//           employee: user._id,
//           $or: [
//             { status: { $in: leaveObj.excludeDays } },
//             {
//               leave: {
//                 $in: leaveObj.excludeDays.filter((i) =>
//                   Types.ObjectId.isValid(i)
//                 ),
//               },
//             },
//           ],
//         }).select("employee date");

//         const isRemainLeave = getTotalLeave({
//           employee: user,
//           leaveObj,
//           allLeaves: attendances,
//           excludedDays: excludeAttendances,
//         });
//         if (!isRemainLeave.nowAvailable) {
//           console.log("leave is gone");
//           throw new Error("invalid leave");
//         }

//         await ShiftModel.findOneAndUpdate(
//           this._conditions,
//           { status: leaveObj.name },
//           { upsert: true }
//         );
//       }
//       if (!validLeave) throw new Error("invalid leave");
//     }
//   }

//   next();
// });

// attendanceSchema.pre("findOneAndUpdate", async function (next) {
//   const specialData = this;
//   const status = specialData._update.schedule || specialData._update.status;
//   const leave = specialData._update.leave;

//   if (leave) {
//     let leaveObj = await Leave.findById(leave);
//     const user = await EmployeeModel.findById(
//       specialData._conditions.employee
//     );
//     if (!user) return;

//     if (leaveObj) {
//       const validleave = filterLeaves(leaveObj, user);
//       if (!validleave) throw new Error("invalid leave");

//       const attendances = await AttendanceModel.find({
//         leave,
//         employee: user._id,
//       }).select("leaves employee date leave department");

//       const excludeAttendances = await AttendanceModel.find({
//         employee: user._id,
//         $or: [
//           { status: { $in: leaveObj.excludeDays } },
//           {
//             leave: {
//               $in: leaveObj.excludeDays.filter((i) =>
//                 Types.ObjectId.isValid(i)
//               ),
//             },
//           },
//         ],
//       }).select("employee date");

//       const isRemainLeave = getTotalLeave({
//         employee: user,
//         leaveObj,
//         allLeaves: attendances,
//         excludedDays: excludeAttendances,
//       });

//       if (!isRemainLeave.nowAvailable) {
//         console.log("leave is gone");
//         throw new Error("invalid leave");
//       }

//       await ShiftModel.findOneAndUpdate(
//         this._conditions,
//         { status: leaveObj.name },
//         { upsert: true }
//       );
//     }
//   }

//   if (status === "Off" || status === "no status" || status === "Absence")
//     await AttendanceModel.updateOne(specialData._conditions, {
//       $unset: { leave: 1 },
//     });

//   next();
// });

const AttendanceModel =
  mongoose.models.Attendance || model("Attendance", attendanceSchema);

export default AttendanceModel;
