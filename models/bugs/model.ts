import mongoose, { model, Schema } from "mongoose";

const bugSchema = new Schema(
  {
    title: { type: String, require: true },
    employee: { type: Schema.Types.ObjectId, ref: "Employee" },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    details: String,
    imageCollection: { type: Schema.Types.ObjectId, ref: "ImageCollection" },
    status: {
      type: String,
      enum: ["pending", "accepted", "solved"],
      default: "pending",
    },
    approvedBy: { type: String },
  },
  { timestamps: true }
);

const BugSchema = mongoose.models.Bug || model("Bug", bugSchema);
export default BugSchema;
