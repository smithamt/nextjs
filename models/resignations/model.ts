import mongoose, { Schema, model } from "mongoose";
import CommentModel from "../comments/model";
import Company from "../companies/model";
import DepartmentModel from "../departments/model";
import EmployeeModel from "../employees/model";

const resignationSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: EmployeeModel,
      required: true,
    },
    resignationDate: { type: Date, required: true, default: Date.now() },
    reason: String,
    isEmergency: { type: Boolean, default: false },
    why: [String],
    comments: [{ type: Schema.Types.ObjectId, ref: CommentModel }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    hrStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: EmployeeModel },
    approvedByHR: { type: Schema.Types.ObjectId, ref: EmployeeModel },
    department: { type: Schema.Types.ObjectId, ref: DepartmentModel },
    company: { type: Schema.Types.ObjectId, ref: Company },
    exitInterviewDate: Date,
    autoBanned: Boolean,
    finalWorkingDay: Date,
    state: {
      type: String,
      enum: ["published", "draft", "scheduled"],
      default: "published",
    },

    isPublic: { type: Boolean, default: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: EmployeeModel,
      required: true,
    },
  },
  { timestamps: true }
);

const ResignationModel =
  mongoose.models.Resignation || model("Resignation", resignationSchema);

export default ResignationModel;
