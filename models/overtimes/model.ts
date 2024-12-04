import mongoose, { Schema, model } from "mongoose";

const OvertimeRequestSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    ref: String,
    attendance: {
      type: Schema.Types.ObjectId,
      ref: "Attendance",
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      select: false,
    },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    shift: { type: Schema.Types.ObjectId, ref: "Shift" },
    overtimeHours: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    requestedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  { timestamps: true }
);

const OvertimeRequest =
  mongoose.models.OvertimeRequest ||
  model("OvertimeRequest", OvertimeRequestSchema);

export default OvertimeRequest;
