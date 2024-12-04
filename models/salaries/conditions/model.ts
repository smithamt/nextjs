import mongoose, { model, Schema } from "mongoose";

const salaryConditionSchema = new Schema(
  {
    name: { type: String, require: true },
    employee: { type: Schema.Types.ObjectId, ref: "Employee" },
    month: { type: String },
    type: { type: String, enum: ["deduction", "addition"] },
    salaryType: {
      type: String,
      enum: ["salary", "finalSettlement"],
      require: true,
    },
    amount: { type: Number },
    currency: { type: Schema.Types.ObjectId, ref: "Currency" },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SalaryConditionModel =
  mongoose.models.SalaryCondition ||
  model("SalaryCondition", salaryConditionSchema);
export default SalaryConditionModel;
