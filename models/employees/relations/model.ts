import mongoose, { Schema, model } from "mongoose";

export const employeeRelationData = new Schema(
  {
    createdDate: { type: Date, default: new Date() },
    employee: { type: Schema.Types.ObjectId, ref: "Employee" },
    fromModel: {
      type: String,
      enum: ["Deduction", "Allowance", "Asset"],
      default: "Allowance",
      required: true,
    },
    id: {
      type: Schema.Types.ObjectId,
      refPath: "fromModel",
      require: true,
    },
    amount: Number,
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    isPublic: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const EmployeeRelationData =
  mongoose.models.EmployeeRelationData ||
  model("EmployeeRelationData", employeeRelationData);

export default EmployeeRelationData;
