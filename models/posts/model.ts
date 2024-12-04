import mongoose, { Schema, model } from "mongoose";

const postSchema = new Schema(
  {
    title: String,
    ref: String,
    content: String,
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
    postBy: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "fromModel",
    },
    fromModel: {
      type: String,
      required: true,
      enum: ["Employee", "Company"],
    },
    forUser: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
    forUserFrontendHelper: { type: Schema.Types.Mixed },
    forAll: { type: Boolean, default: false },
    noted: [
      {
        notedBy: { type: Schema.Types.ObjectId, ref: "Employee" },
        notedAt: Date,
        readNotedBy: [{ type: Schema.Types.ObjectId, ref: "Employee" }],
      },
    ],
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    schedule: { type: Date, default: null },
    status: { type: String, enum: ["draft", "published"] },

    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || model("Post", postSchema);
export default Post;
