import mongoose, { Schema, model } from "mongoose";

const allowanceSchema = new Schema(
  {
    name: { type: String, required: true },
    keyword: String,
    description: String,
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    amount: { type: Number, required: true },
    minimumWorkingDaysPerMonth: Number,
    frequency: {
      type: String,
      enum: ["Monthly", "Yearly", "Once"],
      required: true,
    },
    isTaxable: { type: Boolean, default: false },
    currency: { type: Schema.Types.ObjectId, ref: "Currency" },
    color: { back: String, text: String },
    ref: String,

    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  {
    timestamps: true,
  }
);

const AllowanceSchema =
  mongoose.models.Allowance || model("Allowance", allowanceSchema);

export default AllowanceSchema;
