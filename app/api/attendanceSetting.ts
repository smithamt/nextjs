import mongoose, { Schema, model } from "mongoose";

 

const minuteCutRate = new Schema({
  title: { type: String, enum: ["late", "earlyOut"] },
  allowMinutesPerMonth: { type: Number, default: 60, max: 600 },
  allowMinutesPerDay: { type: Number, default: 60, max: 600 }, // Per day
  allowTimePerMonth: { type: Number, default: 30, max: 31 },
  minuteCutRate: { type: Number, default: 1, max: 10 }, // Multiply
  customCut: {
    rate: Number,
    currency: { type: Schema.Types.ObjectId, ref: "Currency" },
  }, // Per Minute
});

export const MinuteCutRateModel =
  mongoose.models.MinuteCutRate || model("MinuteCutRate", minuteCutRate);

const attendanceSetting = new Schema(
  {
    title: { type: String, require: true },
    department: [{ type: Schema.Types.ObjectId, ref: "Department" }],
    allDepartment: { type: Boolean, default: true },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    late: { type: Schema.Types.ObjectId, ref: "MinuteCutRate" },
    earlyOut: { type: Schema.Types.ObjectId, ref: "MinuteCutRate" },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  { timestamps: true }
);

const AttendanceSetting =
  mongoose.models.AttendanceSetting ||
  model("AttendanceSetting", attendanceSetting);
export default AttendanceSetting;
