import mongoose, { Schema } from "mongoose";
import CurrencyModel from "../currencies/model";
import DepartmentModel from "../departments/model";
import EmployeeModel from "../employees/model";
import CompanyModel from "../companies/model";

const salarySchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: EmployeeModel,
      required: true,
    },
    date: { type: Date, required: true },
    month: { type: String, required: true },
    department: { type: Schema.Types.ObjectId, ref: CurrencyModel },
    totalServiceHours: { type: Number },
    totalWorkingHours: { type: Number },
    empCurrency: { type: Schema.Types.ObjectId, ref: DepartmentModel },
    serviceHours: { type: Number },
    position: { type: Schema.Types.ObjectId, ref: EmployeeModel },
    perDay: { type: Number },
    perHour: { type: Number },
    serviceDays: { type: Number },
    offDays: { type: Number },
    salary: { type: Number },
    leaveDays: [{ type: Schema.Types.Mixed }],
    leaveDayAmount: { type: Number },
    leaves: { type: Number },
    lateMinutes: { type: Number },
    lateAmount: { type: Number },
    earlyOutMinutes: { type: Number },
    earlyOutAmount: { type: Number },
    absences: { type: Number },
    overtime: { type: Number },
    overtimeAmount: { type: Number },
    totalAllowances: [{ type: Schema.Types.Mixed }],
    totalDeductions: [{ type: Schema.Types.Mixed }],
    employeeDeductions: [{ type: Schema.Types.ObjectId, ref: "Deduction" }],
    earning: { type: Number },
    allowances: { type: Number },
    deductions: { type: Number },
    netSalary: { type: Number },
    attendances: { type: Number },
    shifts: { type: Number },
    paidStatus: { type: String, enum: ["Pending", "Paid", "Unpaid"] },
    checked: { type: Boolean, default: true },
    paid: { type: Boolean, default: false },
    paidBy: { type: Schema.Types.ObjectId, ref: EmployeeModel },
    remark: { type: String, max: 300 },
    ref: String,
    company: { type: Schema.Types.ObjectId, ref: CompanyModel },
    isPublic: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: EmployeeModel },
  },
  { timestamps: true }
);

const SalaryModel =
  mongoose.models.Salary || mongoose.model("Salary", salarySchema);
export default SalaryModel;
