import mongoose, { Schema, model } from "mongoose";
import BranchModel from "../branches/model";
import CompanyModel from "../companies/model";
import DepartmentModel from "../departments/model";
import EmployeeModel from "../employees/model";

const warningSchema = new Schema(
  {
    issuedDate: { type: Date, required: true },
    title: { type: String, required: true },
    state: {
      type: String,
      enum: ["published", "draft", "scheduled"],
      default: "published",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: EmployeeModel,
    },
    scheduled: { type: Date },
    warningState: {
      type: Schema.Types.ObjectId,
      ref: "WarningState",
      required: true,
    },
    detailsOfIncident: { type: String },
    correctiveAction: { type: String },
    employee: {
      type: Schema.Types.ObjectId,
      ref: EmployeeModel,
      required: true,
    },
    informTo: [
      { type: Schema.Types.ObjectId, ref: EmployeeModel, required: true },
    ],
    employeeComments: { type: String },
    witnessedBy: [
      { type: Schema.Types.ObjectId, ref: EmployeeModel, required: true },
    ],
    issuedBy: [
      { type: Schema.Types.ObjectId, ref: EmployeeModel, required: true },
    ],
    company: { type: Schema.Types.ObjectId, ref: CompanyModel, required: true },
    department: { type: Schema.Types.ObjectId, ref: DepartmentModel },
    branch: { type: Schema.Types.ObjectId, ref: BranchModel },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: EmployeeModel,
      required: true,
    },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const WarningModel = mongoose.models.Warning || model("Warning", warningSchema);

export default WarningModel;
