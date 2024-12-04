import EmployeeModel from "@/models/employees/model";
import mongoose, { model, Schema } from "mongoose";
import { ENUM_REF_ID } from "../appraisals/model";
import CompanyModel from "../companies/model";
import ContractModel from "../contracts/model";

const contractSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: EmployeeModel },
    reason: String,
    newSalary: { type: Number, require: true },
    effectiveDate: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },
    refId: { type: String, enum: ENUM_REF_ID },
    contract: { type: Schema.Types.ObjectId, ref: ContractModel },

    company: { type: Schema.Types.ObjectId, ref: CompanyModel },
    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: EmployeeModel },
  },
  { timestamps: true }
);

const RenewalContractModel =
  mongoose.models.Contract || model("Contract", contractSchema);
export default RenewalContractModel;
