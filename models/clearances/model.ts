import mongoose, { Schema, model } from "mongoose";

const clearanceSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    from: { type: Schema.Types.ObjectId, refPath: "fromModel" },
    fromModel: { type: String },
    startingDate: { type: Date, default: new Date() },
    hrApprover: { type: Schema.Types.ObjectId, ref: "Employee" },
    hodApprover: { type: Schema.Types.ObjectId, ref: "Employee" },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    finalWorkingDay: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  { timestamps: true }
);

const ClearanceModel =
  mongoose.models.Clearance || model("Clearance", clearanceSchema);

export default ClearanceModel;
