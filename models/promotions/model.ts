import mongoose, { Schema, model } from "mongoose";

const promotionRequestSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    reviewedDate: { type: Date },
    oldPosition: {
      type: Schema.Types.ObjectId,
      ref: "Position",
      required: true,
    },
    newPosition: {
      type: Schema.Types.ObjectId,
      ref: "Position",
      required: true,
    },
    newSalary: Number,
    amount: Number,
    oldSalary: Number,

    date: Date,
    managerComment: String,
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    ref: String,
    reason: String,
    state: { type: String, enum: ["draft", "published", "scheduled"] },
    qualifications: [String],
    approvedByHR: { type: Schema.Types.ObjectId, ref: "Employee" },
    hrStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectReason: String,

    isPublic: { type: Boolean, default: true },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  { timestamps: true }
);

const PromotionRequestModel =
  mongoose.models.Promotion || model("Promotion", promotionRequestSchema);

export default PromotionRequestModel;
