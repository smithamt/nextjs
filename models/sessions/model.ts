import mongoose, { model, Schema } from "mongoose";

const sessionSchema = new Schema({
  expires: Date,
  session: Schema.Types.Mixed,
  user: { type: Schema.Types.ObjectId, ref: "Employee", select: false },
  isPublic: { type: Boolean, default: true },
});

const SessionSchema =
  mongoose.models.Session || model("Session", sessionSchema);
export default SessionSchema;
