import mongoose, { Schema, model } from "mongoose";
import ProfileSchema from "../profiles/model";
import { otherNameSchema } from "../departments/model";
const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    otherName: [otherNameSchema],
    payslip: { type: String },

    profile: ProfileSchema,
    profileCollection: { type: Schema.Types.ObjectId, ref: "ImageCollection" },

    cover: ProfileSchema,
    coverCollection: { type: Schema.Types.ObjectId, ref: "ImageCollection" },

    logo: {
      url: String,
      id: { type: Schema.Types.ObjectId, ref: "Image" },
    },
    nameHistory: { changeDate: Date },
    keyword: String,
    description: String,

    startingDate: { type: Date, default: new Date() },
    overtimeRate: { type: Number, default: 1.1 },
    formatDate: {
      type: String,
      enum: ["YYYY-MM-DD", "DD-MM-YYYY", "MM-DD-YYYY", "DD MMM, YYYY"],
    },

    //policy
    warningPolicy: {
      policy: {
        type: Schema.Types.ObjectId,
        ref: "OffPolicy",
      },
      usedBy: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
      },
    },
    offPolicy: {
      policy: {
        type: Schema.Types.ObjectId,
        ref: "OffPolicy",
      },
      usedBy: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
      },
    },
    attendanceSetting: {
      setting: {
        type: Schema.Types.ObjectId,
        ref: "AttendanceSetting",
      },
      usedBy: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
      },
    },

    currency: { type: Schema.Types.ObjectId, ref: "Currency" },
    overtimeRequestAllowHours: {
      type: Number,
      default: 2,
      validate: {
        validator: function (number: number) {
          console.log("start validation", number);
          return number < 16;
        },
        message: (props: any) =>
          `Maximum hour is 16 hours! not allow ${props.value} hours`,
      },
    },
    offDayRate: { type: Number, default: 1 },
    holidayRate: { type: Number, default: 1 },
    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  {
    timestamps: true,
  }
);

const CompanyModel = mongoose.models.Company || model("Company", companySchema);
export default CompanyModel;
