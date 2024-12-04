import mongoose, { Schema, model } from "mongoose";
import CompanyModel from "../companies/model";
import EmployeeModel from "../employees/model";
import ProfileSchema from "../profiles/model";

const fingerprintMachineSchema = new Schema(
  {
    name: { type: String, require: true },
    profile: ProfileSchema,
    company: { type: Schema.Types.ObjectId, ref: CompanyModel, require: true },
    ipAddress: { type: String },
    port: Number,

    isPublic: { type: Boolean, default: true },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: EmployeeModel,
    },
  },
  { timestamps: true }
);

const FingerprintMachineSchema =
  mongoose.models.FingerprintMachine ||
  model("FingerprintMachine", fingerprintMachineSchema);
export default FingerprintMachineSchema;
