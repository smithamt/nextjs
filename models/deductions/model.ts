import mongoose, { Schema, model } from "mongoose";

const deductionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    keyword: { type: String },
    description: {
      type: String,
      max: 1000,
    },
    amount: {
      type: Number,
    },
    deductBySalary: {
      type: Number,
      max: 10,
    },
    currency: {
      type: Schema.Types.ObjectId,
      ref: "Currency",
      default: "6582faf962f3937d4c843d35",
    },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    frequency: {
      type: String,
      enum: ["Monthly", "Yearly", "Once"],
      required: true,
      default: "Once",
    },
    ref: String,
    color: {
      back: String,
      text: String,
    },
    icon: String,

    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  {
    timestamps: true,
  }
);

const DeductionSchema =
  mongoose.models.Deduction || model("Deduction", deductionSchema);

export default DeductionSchema;
