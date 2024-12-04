import mongoose, { Schema, model } from "mongoose";

const commentSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    comment: String,
    oldComments: [
      {
        comment: String,
        editedAt: Date,
      },
    ],
    edited: Boolean,
    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  { timestamps: true }
);

const CommentModel =
  mongoose.models.Comment || model("Comment", commentSchema);

export default CommentModel;
