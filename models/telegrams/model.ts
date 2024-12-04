import mongoose, { Schema, model } from "mongoose";

const telegramUserSchema = new Schema(
  {
    id: { type: String, unique: true, required: true },
    is_bot: { type: Boolean },
    first_name: String,
    last_name: String,
    username: String,
    language_code: String,
    promptTokens: Number,
    completionTokens: Number,
    employee: { type: Schema.Types.ObjectId, ref: "Employee" },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    department: { type: Schema.Types.ObjectId, ref: "Department" },
    isPublic: { type: Boolean, default: true },
    isEmployee: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const TelegramSchema =
  mongoose.models.Telegram || model("Telegram", telegramUserSchema);

export default TelegramSchema;
