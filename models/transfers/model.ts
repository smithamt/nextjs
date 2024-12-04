import mongoose from "mongoose";
import DepartmentModel from "../departments/model";
import EmployeeModel from "../employees/model";
import PositionModel from "../positions/model";

const transferSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: EmployeeModel,
      required: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DepartmentModel,
      required: true,
    },
    reason: { type: String },
    transferType: {
      type: String,
      enum: [PositionModel.modelName, DepartmentModel.modelName],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    state: { type: String, enum: ["published", "draft"] },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: EmployeeModel },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: EmployeeModel },
  },
  { timestamps: true }
);

const TransferModel =
  mongoose.models.Transfer || mongoose.model("Transfer", transferSchema);

export default TransferModel;
