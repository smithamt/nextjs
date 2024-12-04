import mongoose, { Schema, model } from "mongoose";
import EmployeeModel from "../employees/model";

const messageSchema = new Schema(
  {
    message_id: Number,
    chat: { type: Schema.Types.ObjectId, ref: "Telegram" },
    date: Date,
    text: String,

    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      require: true,
    },
    from: { type: Schema.Types.ObjectId, refPath: "fromModel" },
    fromModel: {
      type: String,
      default: "Telegram",
      enum: ["Employee", "Telegram"],
    },
    fromBot: { type: Boolean },

    seen: [{ type: Schema.Types.ObjectId, ref: EmployeeModel }],
  },
  { timestamps: true }
);

const MessageSchema =
  mongoose.models.Message || model("Message", messageSchema);

export default MessageSchema;
