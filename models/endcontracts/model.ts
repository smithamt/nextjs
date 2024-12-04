import mongoose, { model, Schema } from "mongoose";
import { ENUM_REF_ID } from "../appraisals/model.js";

export const contractTypes = ["endContract", "renewalContract", "contract"];

const endContractModel = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee" },
    reason: String,
    endDate: { type: Date, required: true },
    refId: { type: String, enum: ENUM_REF_ID },
    startClearanceNow: { type: Boolean, default: false },
    textEditor: {
      type: Schema.Types.ObjectId,
      ref: "TextEditor",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "solved"],
      default: "pending",
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const EndContractModel =
  mongoose.models.EndContract || model("EndContract", endContractModel);
export default EndContractModel;
