import { Schema } from "mongoose";

const ProfileSchema = new Schema(
  {
    state: String,
    image: { type: Schema.Types.ObjectId, ref: "Image" },
    extension: String,
    mimetype: String,
  },
  { timestamps: true }
);

export default ProfileSchema;
