import mongoose, { Schema, model } from "mongoose";
import ProfileSchema from "../profiles/model";

const positionSchema = new Schema(
  {
    name: { type: String, required: true },
    keyword: { type: String, required: true },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },

    profile: ProfileSchema,
    profileCollection: { type: Schema.Types.ObjectId, ref: "ImageCollection" },

    level: Number,
    allDepartment: { type: Boolean, default: false },
    department: [{ type: Schema.Types.ObjectId, ref: "Department" }],
    isHeadOfDepartment: { type: Boolean, default: false },
    workPeriods: String,
    employeeClassification: String,
    wageInformation: String,
    insuranceType: String,
    budgetCode: String,
    contractType: String,
    compensationRegion: String,
    color: { back: String, text: String },
    ref: String,
    description: String,
    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  { timestamps: true }
);

const PositionModel =
  mongoose.models.Position || model("Position", positionSchema);
export default PositionModel;
