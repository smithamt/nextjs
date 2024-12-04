import AllowanceSchema from "@/models/allowances/model";
import AssetSchema from "@/models/assets/model";
import BranchModel from "@/models/branches/model";
import ClearanceModel from "@/models/clearances/model";
import ContractModel from "@/models/contracts/model";
import CurrencyModel from "@/models/currencies/model";
import DeductionSchema from "@/models/deductions/model";
import DepartmentModel from "@/models/departments/model";
import EmployeeModel from "@/models/employees/model";
import FingerprintMachineSchema from "@/models/fingerprintmachines/model";
import HolidayModel from "@/models/holidays/model";
import LanguageModel from "@/models/languages/model";
import LeaveRequestModel from "@/models/leaverequests/model";
import LeaveModel from "@/models/leaves/model";
import PositionModel from "@/models/positions/model";
import PromotionRequestModel from "@/models/promotions/model";
import SalaryConditionModel from "@/models/salaries/conditions/model";
import ScheduleModel from "@/models/schedules/model";
import TerminationModel from "@/models/terminations/model";
import TransferModel from "@/models/transfers/model";
import WarningModel from "@/models/warnings/model";

export const custommodels = {
  departments: { model: DepartmentModel, populate: "", select: "" },
  contracts: { model: ContractModel, populate: "", select: "" },
  positions: { model: PositionModel, populate: "", select: "" },
  schedules: { model: ScheduleModel, populate: "", select: "" },
  holidays: { model: HolidayModel, populate: "", select: "" },
  leaves: { model: LeaveModel, populate: "", select: "" },
  branches: { model: BranchModel, populate: "", select: "" },
  allowances: { model: AllowanceSchema, populate: "", select: "" },
  deductions: {
    model: DeductionSchema,
    populate: { path: "currency", select: "name" },
    select: "",
  },
  assets: {
    model: AssetSchema,
    populate: { path: "currency", select: "name" },
    select: "",
  },
  currencies: { model: CurrencyModel, populate: "", select: "" },
  languages: { model: LanguageModel, populate: "", select: "" },
  salaryConditions: { model: SalaryConditionModel },
  leaveRequests: { model: LeaveRequestModel },
  warnings: { model: WarningModel },
  employees: { model: EmployeeModel },
  clearances: { model: ClearanceModel },
  transfers: { model: TransferModel },
  trainings: { model: TransferModel },
  terminations: { model: TerminationModel },
  promotions: { model: PromotionRequestModel },
  fingerprints: { model: FingerprintMachineSchema },
};
