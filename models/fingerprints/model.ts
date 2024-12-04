import mongoose, { Schema, model } from "mongoose";

const fingerPrintData = new Schema(
  {
    userSn: { type: Number },
    deviceUserId: String,
    employee: { type: Schema.Types.ObjectId, ref: "Employee" },
    recordTime: Date,
    recordTimeString: { type: String },
    isPublic: { type: Boolean, default: true },
    ip: String,
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const FingerprintData =
  mongoose.models.FingerPrintData || model("FingerPrintData", fingerPrintData);

export default FingerprintData;
