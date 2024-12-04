import mongoose, { Schema, model } from "mongoose";

const scheduleRequest = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee" },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    from: String,
    to: String,
    name: String,
    notes: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);

const ScheduleRequest =
  mongoose.models.ScheduleRequest || model("ScheduleRequest", scheduleRequest);

export default ScheduleRequest;
