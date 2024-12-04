import { CompanyContractType } from "@/types";
import mongoose, { model, Schema } from "mongoose";
import CompanyModel from "../companies/model";
import TextEditorModel from "../editors/model";
import EmployeeModel from "../employees/model";
import LeaveModel from "../leaves/model";

const contractSchema = new Schema<CompanyContractType>(
  {
    name: { type: String },
    textEditor: [{ type: Schema.Types.ObjectId, ref: TextEditorModel }],
    company: { type: Schema.Types.ObjectId, ref: CompanyModel },
    leaves: [{ type: Schema.Types.ObjectId, ref: LeaveModel }],
    serviceHourPerDay: { type: Number, default: 8 },
    holidays: { type: Number }, // allow holidays in a year
    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: EmployeeModel },
  },
  { timestamps: true }
);

const ContractModel =
  mongoose.models.CompanyContract || model("CompanyContract", contractSchema);
export default ContractModel;
