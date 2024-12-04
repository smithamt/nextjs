import mongoose, { Schema, model } from "mongoose";

const webPushSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee" },
    subscription: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

const WebPushModel = mongoose.models.WebPush || model("WebPush", webPushSchema);

export default WebPushModel;
