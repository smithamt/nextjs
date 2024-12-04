import { BranchType } from "@/types";
import mongoose, { Schema, model } from "mongoose";
import ProfileSchema from "../profiles/model";

const branchSchema = new Schema<BranchType>(
  {
    name: { type: String, required: true },
    keyword: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      latitude: Number,
      longitude: Number,
      radius: Number,
    },
    profile: ProfileSchema,
    profileCollection: { type: Schema.Types.ObjectId, ref: "ImageCollection" },
    description: { type: String },
    ref: String,
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    color: { text: String, back: String },
    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  { timestamps: true }
);

const BranchModel = mongoose.models.Branch || model("Branch", branchSchema);

export default BranchModel;
