import mongoose, { Schema, model } from "mongoose";

const languageSchema = new Schema(
  {
    name: String,
    key: String,
    jsonData: Schema.Types.Mixed,
    isPublic: { type: Boolean, default: true },
    ref: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
    },
  },
  { timestamps: true }
);

const LanguageModel =
  mongoose.models.Language || model("Language", languageSchema);
export default LanguageModel;
