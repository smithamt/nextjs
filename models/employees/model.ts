import { EmployeeType } from "@/types";
import mongoose, { Schema, model } from "mongoose";
import BranchModel from "../branches/model";
import CompanyModel from "../companies/model";
import CurrencyModel from "../currencies/model";
import DepartmentModel from "../departments/model";
import LanguageModel from "../languages/model";
import PositionModel from "../positions/model";
import ProfileSchema from "../profiles/model";

const employeeSchema = new Schema<EmployeeType>(
  {
    name: { type: String, required: true },
    nickname: String,
    employeeId: { type: String, required: true, unique: true },
    dateOfBirth: Date,
    position: { type: Schema.Types.ObjectId, ref: PositionModel },
    oldPositions: [{ type: Schema.Types.ObjectId, ref: "Position" }],
    joinedDate: { type: Date, required: true },
    probationMonth: { type: Number, default: 3 },
    fingerprintId: { type: String, unique: true },
    username: String,
    password: { type: String, select: false },

    department: { type: Schema.Types.ObjectId, ref: DepartmentModel },
    branch: { type: Schema.Types.ObjectId, ref: BranchModel },
    company: { type: Schema.Types.ObjectId, ref: CompanyModel, required: true },

    profile: ProfileSchema,
    profileCollection: { type: Schema.Types.ObjectId, ref: "ImageCollection" },
    cover: ProfileSchema,
    coverCollection: { type: Schema.Types.ObjectId, ref: "ImageCollection" },

    //planner helper
    schedule: {
      id: { type: Schema.Types.ObjectId, ref: "Schedule" },
      createdDate: Date,
      createdBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    },

    //salary
    salary: { type: Number },
    salaryType: { type: String },
    currency: { type: Schema.Types.ObjectId, ref: CurrencyModel },
    serviceHourPerDay: { type: Number, default: 8 },
    safeLate: { type: Boolean, default: true },
    safeEarlyOut: { type: Boolean, default: true },
    useFlexibleWorkingHour: { type: Boolean, default: false },
    onHoldSalary: Number,

    // contact and basic info
    email: { type: String, unique: true, sparse: true },
    contactNo: { type: String, default: "NA" },
    telegram: String,
    gender: { type: String, enum: ["Male", "Female"] },
    permanentAddress: String,
    currentAddress: String,
    passportNo: String,
    maritalStatus: { type: String, max: 100 },
    height: { type: String },
    weight: { type: String },
    emergencyContact: String,
    emergencyCall: String,
    degreeOfVision: String,
    hearingLevel: String,
    channels: String,
    nationality: String,
    idCardNo: { type: String },
    socialLink: { type: Schema.Types.ObjectId, ref: "SocialLink" },

    role: {
      type: String,
      default: "user",
      enum: ["admin", "editor", "group_admin", "user", "head_of_department"],
    },
    ref: String,

    employeeType: { type: String, max: 100 },
    levelOfEducation: { type: String },
    ethnicGroup: { type: String },

    computerSkill: { type: String },

    languages: [{ type: String, default: "en" }],
    anyCriminalHistory: String,
    //@ts-ignore
    language: {
      type: Schema.Types.ObjectId,
      ref: LanguageModel,
      default: "658459975d0d859592b940bc",
    },

    //clearance
    state: {
      type: String,
      enum: ["resign", "terminated", "endContract", "normal"],
      default: "normal",
    },

    isActive: { isActive: Boolean, activeAt: Date },
    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  {
    timestamps: true,
  }
);

const EmployeeModel =
  mongoose.models.Employee || model("Employee", employeeSchema);

export default EmployeeModel;
