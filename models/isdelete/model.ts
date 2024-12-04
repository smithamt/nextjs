import { custommodels } from "@/data/models";
import mongoose, { model, Schema } from "mongoose";
import EmployeeModel from "../employees/model";

custommodels;

const removeSchema = new Schema(
  {
    title: String,
    context: { type: Schema.Types.ObjectId, refPath: "fromModel" },
    fromModel: String,
    deletedBy: { type: Schema.Types.ObjectId, ref: EmployeeModel },
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const RemoveModel = mongoose.models.Remove || model("Remove", removeSchema);

export default RemoveModel;
