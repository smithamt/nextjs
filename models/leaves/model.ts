import { LeaveType } from "@/types";
import mongoose, { Schema, model } from "mongoose";
import ProfileSchema from "../profiles/model";

const leaveSchema = new Schema<LeaveType>(
  {
    name: { type: String, required: true },
    keyword: String,
    allowDays: { type: Number, required: true },

    profile: ProfileSchema,
    profileCollection: { type: Schema.Types.ObjectId, ref: "ImageCollection" },

    minimumDays: Number,
    saveMinimumDay: [{ type: Schema.Types.ObjectId, ref: "Department" }],
    carriableMonths: { type: Number, default: 0 },
    carriableYears: { type: Number, default: 0 },
    ref: String,
    gender: {
      type: String,
      enum: ["Male", "Female", "All"],
      default: "All",
      required: true,
    },
    maritalStatus: {
      type: [String],
      enum: ["Single", "Married", "Divorced", "Widowed", "Separated", "All"],
      default: ["All"],
      required: true,
    },
    employeeType: { type: String, default: "All" },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    carryLeave: { type: Schema.Types.ObjectId, ref: "Leave" },
    excludeDays: [{ type: Schema.Types.Mixed, ref: "Leave" }],
    branch: [{ type: Schema.Types.Mixed, ref: "Branch" }],
    allDepartment: { type: Boolean, default: false },
    department: [{ type: Schema.Types.ObjectId, ref: "Department" }],
    paidType: {
      type: String,
      enum: ["Paid", "Unpaid", "HalfPaid"],
      required: true,
    },
    employeeServiceMonths: { type: Number, required: true },
    calculateWithServiceDays: { type: Boolean },
    resettingDate: { type: Date },
    countries: { type: [String] },
    color: { text: String, back: String },

    startDate: Date,
    endDate: Date,

    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);

const LeaveModel = mongoose.models.Leave || model("Leave", leaveSchema);
export default LeaveModel;
