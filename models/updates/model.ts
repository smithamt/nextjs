import mongoose, { model, Schema } from "mongoose";
import EmployeeModel from "../employees/model";

const updateSchema = new Schema(
  {
    title: String,
    context: { type: Schema.Types.ObjectId, refPath: "fromModel" },
    fromModel: String,
    employee: { type: Schema.Types.ObjectId, ref: EmployeeModel },
    data: Schema.Types.Mixed,
    updatedAt: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

const UpdateSchema = mongoose.models.Update || model("Update", updateSchema);
export default UpdateSchema;
