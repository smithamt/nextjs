import mongoose, { model, Schema } from "mongoose";
import CommentModel from "../comments/model";
import CompanyModel from "../companies/model";
import DepartmentModel from "../departments/model";
import DevelopmentplanModel from "../developmentplans/model";
import EmployeeModel from "../employees/model";
import EvaluationModel from "../evaluations/model";

export const ENUM_REF_ID = [
  "probation-end",
  "one-year-end",
  "two-year-end",
  "three-year-end",
];

const appraisalSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: EmployeeModel },
    status: {
      type: String,
      enum: ["approved", "rejected", "pending"],
      default: "pending",
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: EmployeeModel },
    reviewedBy: { type: Schema.Types.ObjectId, ref: EmployeeModel },
    evaluations: [
      {
        evaluation: { type: Schema.Types.ObjectId, ref: EvaluationModel },
        rating: Number,
        comment: String,
        comments: [{ type: Schema.Types.ObjectId, ref: CommentModel }],
      },
    ],
    developmentplans: [
      {
        developmentplan: {
          type: Schema.Types.ObjectId,
          ref: DevelopmentplanModel,
        },
        plan: String,
      },
    ],
    employeeComments: String,
    refId: {
      type: String,
      enum: ENUM_REF_ID,
    },
    state: {
      type: String,
      enum: ["published", "draft", "scheduled"],
      default: "draft",
    },

    isPublic: { type: Boolean, default: true },
    company: { type: Schema.Types.ObjectId, ref: CompanyModel, required: true },
    department: { type: Schema.Types.ObjectId, ref: DepartmentModel },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: EmployeeModel,
      required: true,
    },
  },
  { timestamps: true }
);

const AppraisalModel =
  mongoose.models.Appraisal || model("Appraisal", appraisalSchema);
export default AppraisalModel;
