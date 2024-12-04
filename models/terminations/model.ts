import mongoose, { Schema, model } from "mongoose";

export const terminationSchemaData = {
  employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  terminationDate: { type: Date, required: true },
  reason: { type: String },
  why: [String],
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  department: { type: Schema.Types.ObjectId, ref: "Department" },
  company: { type: Schema.Types.ObjectId, ref: "Company" },

  createdBy: { type: Schema.Types.ObjectId, ref: "Employee" },
  isPublic: { type: Boolean, default: true },
};

const terminationSchema = new Schema(terminationSchemaData, {
  timestamps: true,
});

const TerminationModel =
  mongoose.models.Termination || model("Termination", terminationSchema);

export default TerminationModel;
