import mongoose, { model, Schema } from "mongoose";

 

const activityLogSchema = new Schema(
  {
    employee: { type: Schema.Types.ObjectId, ref: "Employee" },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    time: { type: Date, default: new Date() },
    baseUrl: String,
    referer: String,
    query: { type: Schema.Types.Mixed },
    body: { type: Schema.Types.Mixed },
    to: String,
    method: String,
  },
  { timestamps: true }
);

const ActivityLogSchema =
  mongoose.models.ActivityLog || model("ActivityLog", activityLogSchema);
export default ActivityLogSchema;
