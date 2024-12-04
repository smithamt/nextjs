import mongoose, { Schema, model } from "mongoose";
import ProfileSchema from "../profiles/model";

const conversationSchema = new Schema(
  {
    name: { type: String },
    profile: ProfileSchema,
    group: String,
    type: { type: String, enum: ["group", "telegram", "telegram-group"] },
    telegram: { type: Schema.Types.ObjectId, ref: "Telegram" },

    users: [{ type: Schema.Types.ObjectId, refPath: "fromUser" }],
    fromUser: {
      type: String,
      enum: ["Employee", "Telegram"],
      default: "Telegram",
    },
    isTelegramBot: { type: Boolean, default: false },

    lastMessage: String,
    lastMessageRead: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
    lastMessageAt: Date,
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ConversationModel =
  mongoose.models.Conversation || model("Conversation", conversationSchema);

export default ConversationModel;
