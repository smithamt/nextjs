import mongoose, { Schema } from "mongoose";

const textEditorSchema = new Schema(
  {
    name: { type: String },
    content: { type: String },
    module: { type: String, enum: ["endcontract", "contract"] },
    ref: String,
    state: { type: String, enum: ["published", "draft"], default: "draft" },
    company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const TextEditorModel =
  mongoose.models.TextEditor || mongoose.model("TextEditor", textEditorSchema);

export default TextEditorModel;
