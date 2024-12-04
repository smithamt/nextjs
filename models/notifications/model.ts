import { NotificationType } from "@/types";
import mongoose, { Schema, model } from "mongoose";
import Company from "../companies/model";

const UserNotificationSchema = new Schema<NotificationType>(
  {
    ref: String,
    title: String,
    route: String,
    message: String,
    company: { type: Schema.Types.ObjectId, ref: Company, required: true },
    content: { type: Schema.Types.ObjectId, refPath: "contentModel" },
    contentModel: String,
    contentType: String,
    toAll: { type: Boolean, default: false },
    toUser: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
    search: { type: Schema.Types.Mixed },
    from: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "fromModel",
    },
    fromModel: {
      type: String,
      required: true,
      default: "Employee",
      enum: ["Employee", "Company"],
    },
    read: [
      {
        readBy: {
          type: Schema.Types.ObjectId,
          ref: "Employee",
        },
        readAt: Date,
      },
    ],
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const UserNotification =
  mongoose.models.UserNotification ||
  model("UserNotification", UserNotificationSchema);
export default UserNotification;
