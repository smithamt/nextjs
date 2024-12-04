import mongoose, { Schema, model } from "mongoose";

const ImageSchema = new Schema(
  {
    state: String,
    author: { type: Schema.Types.ObjectId, ref: "Employee" },
    image: {
      fieldname: String,
      originalname: String,
      encoding: String,
      mimetype: String,
      filename: String,
      path: String,
      buffer: { type: Buffer, select: false },
      size: Number,
      extension: String,
    },
    status: {
      type: String,
      enum: ["draft", "public", "delete"],
    },
    ref: String,
    description: { type: String },
    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);

const Image = mongoose.models.Image || model("Image", ImageSchema);

export default Image;
