import { SalaryIncrementType } from "@/types";
import mongoose, { Schema, model } from "mongoose";

const salaryIncrementSchema = new Schema<SalaryIncrementType>(
  {
    title: String,
    date: { type: Date },
    amount: { type: Number },
    employee: { type: Schema.Types.ObjectId, ref: "Employee" },
    informTo: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
    ref: String,
    reason: { type: String },
    schedule: { type: Date, default: null },
    status: { type: String, enum: ["draft", "published", "scheduled"] },
    state: { type: String, enum: ["draft", "published", "scheduled"] },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    isPublic: { type: Boolean, default: true },

    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
  },
  { timestamps: true }
);

const SalaryIncrement =
  mongoose.models.SalaryIncrement ||
  model("SalaryIncrement", salaryIncrementSchema);

export default SalaryIncrement;
