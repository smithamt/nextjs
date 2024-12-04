import { Schema, model } from "mongoose";

import mongoose from "mongoose";
import ProfileSchema from "../profiles/model";

 

export const otherNameSchema = new Schema({
  name: String,
  language: { type: Schema.Types.ObjectId, ref: "Language" },
});

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  profile: ProfileSchema,
  profileCollection: { type: Schema.Types.ObjectId, ref: "ImageCollection" },

  // otherName: [otherNameSchema],
  keyword: String,
  description: String,
  allowHalfOff: Boolean,
  rolesAndResponsibilities: {
    type: String,
  },
  budget: {
    type: Number,
  },

  company: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: true,
    select: false,
  },
  branch: [{ type: Schema.Types.Mixed, ref: "Branch" }],
  goals: {
    type: String,
  },
  policies: {
    type: String,
  },
  ref: String,
  color: {
    text: String,
    back: String,
  },
  isPublic: { type: Boolean, default: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
});

const DepartmentModel =
  mongoose.models.Department || model("Department", departmentSchema);

export default DepartmentModel;
