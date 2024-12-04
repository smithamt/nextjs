import mongoose, { model, Schema } from "mongoose";
import { otherNameSchema } from "../departments/model";

const developmentplanSchema = new Schema(
  {
    question: String,
    otherName: [otherNameSchema],
    description: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    isPublic: { type: Boolean, default: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);

const DevelopmentplanModel =
  mongoose.models.Developmentplan ||
  model("Developmentplan", developmentplanSchema);
export default DevelopmentplanModel;
