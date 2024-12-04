import { ImageCollectionType } from "@/types";
import mongoose, { Schema, model } from "mongoose";

export const imageCollectionSchema = new Schema<ImageCollectionType>(
  {
    author: { type: Schema.Types.ObjectId, refPath: "fromModel" },
    fromModel: {
      type: String,
      default: "Employee",
      enum: ["Employee", "Company"],
    },
    images: [{ type: Schema.Types.ObjectId, ref: "Image" }],
    status: { type: String, enum: ["draft", "public", "delete"] },
    ref: String,
    description: { type: String },

    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  { timestamps: true }
);

const ImageCollectionModel =
  mongoose.models.ImageCollection ||
  model("ImageCollection", imageCollectionSchema);

export default ImageCollectionModel;
