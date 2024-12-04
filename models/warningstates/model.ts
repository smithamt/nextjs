import mongoose, { Schema, model } from "mongoose";
import CompanyModel from "../companies/model";
import EmployeeModel from "../employees/model";

const warningStateSchema = new Schema(
  {
    name: { type: String, require: true },
    durationMonth: { type: Number, require: true, default: 1 },
    company: { type: Schema.Types.ObjectId, ref: CompanyModel, required: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: EmployeeModel,
      required: true,
    },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const WarningStateSchema =
  mongoose.models.WarningState || model("WarningState", warningStateSchema);

export default WarningStateSchema;
