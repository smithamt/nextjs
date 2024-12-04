import mongoose, { Schema } from "mongoose";
import CompanyModel from "../companies/model";
import DepartmentModel from "../departments/model";
import EmployeeModel from "../employees/model";

const scheduleSchema = new Schema(
  {
    isPublic: { type: Boolean, default: true },
    name: { type: String },
    from: { type: String, required: true },
    to: { type: String, required: true },
    company: {
      type: Schema.Types.ObjectId,
      ref: CompanyModel,
      required: true,
      select: false,
    },
    allDepartment: { type: Boolean, select: false, default: false },
    department: [{ type: Schema.Types.ObjectId, ref: DepartmentModel }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
    },
    request: {
      requestBy: { type: Schema.Types.ObjectId, ref: EmployeeModel },
      department: { type: Schema.Types.ObjectId, ref: DepartmentModel },
      requestDate: { type: Date },
      approvedBy: { type: Schema.Types.ObjectId, ref: EmployeeModel },
    },
    ref: String,
    notes: String,
    color: { back: String, text: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: EmployeeModel },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

const ScheduleModel =
  mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);
export default ScheduleModel;
