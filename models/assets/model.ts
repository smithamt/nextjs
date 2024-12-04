import mongoose, { Schema, model } from "mongoose";
import ProfileSchema from "../profiles/model";

const assetSchema = new Schema(
  {
    name: { type: String, required: true },
    keyword: String,
    type: String,
    profile: ProfileSchema,
    profileCollection: { type: Schema.Types.ObjectId, ref: "ImageCollection" },

    forAll: Boolean,
    forDepartment: [{ type: Schema.Types.ObjectId, ref: "Department" }],
    amount: Number,
    currency: { type: Schema.Types.ObjectId, ref: "Currency" },
    ref: String,
    condition: String,
    lifecycle: String,
    purchaseDate: Date,
    depreciation: Number,
    maintenanceSchedule: String,
    assetPerformance: String,
    auditInformation: String,
    color: { back: String, text: String },
    isPublic: { type: Boolean, default: true },

    department: { type: Schema.Types.ObjectId, ref: "Department" },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  },
  { timestamps: true }
);

const AssetSchema = mongoose.models.Asset || model("Asset", assetSchema);
export default AssetSchema;
