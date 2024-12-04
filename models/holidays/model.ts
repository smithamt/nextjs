import mongoose, { Schema, model } from "mongoose";
import ProfileSchema from "../profiles/model";

const holidaySchema = new Schema(
  {
    name: { type: String, required: true },
    keyword: { type: String },
    profile: ProfileSchema,
    profileCollection: { type: Schema.Types.ObjectId, ref: "ImageCollection" },
    department: [{ type: Schema.Types.ObjectId, ref: "Department" }],
    allDepartment: Boolean,
    date: { type: Date, required: true },
    paidType: {
      type: String,
      enum: ["Paid", "Unpaid", "HalfPaid"],
      default: "Paid",
    },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    ref: String,
    description: { type: String },
    countries: { type: [String], default: ["All"] },
    excludeCountries: [{ type: String }],
    excludeDays: [{ type: Schema.Types.Mixed, ref: "Leave" }],
    icon: String,
    color: { back: String, text: String },

    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  {
    timestamps: true,
  }
);

const HolidayModel = mongoose.models.Holiday || model("Holiday", holidaySchema);

export default HolidayModel;
