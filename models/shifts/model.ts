import { Schema, model } from "mongoose";

import { AttendanceType, ShiftType } from "@/types";
import mongoose from "mongoose";
import AttendanceModel from "../attendances/model";
import EmployeeModel from "../employees/model";
import ScheduleModel from "../schedules/model";

const shift = new Schema<ShiftType>(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: EmployeeModel,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    schedule: {
      type: Schema.Types.ObjectId,
      ref: ScheduleModel,
    },
    status: {
      type: String,
    },
    ref: String,
    remarkBy: { type: Schema.Types.ObjectId, ref: EmployeeModel },
    remark: String,
    createdBy: { type: Schema.Types.ObjectId, ref: EmployeeModel },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export function isPastDate(date: Date) {
  let now = new Date();
  now.setHours(0, 0, 0, 0);
  return date < now;
}

export const handleShiftUpdate = async ({
  schedule,
  date,
  findQuery,
  status,
}: {
  schedule: string;
  date: Date;
  findQuery: any;
  status: string;
}) => {
  const updateData: any = {};

  if (schedule) {
    updateData.schedule = schedule;
    updateData.ref = `change schedule due to change shift`;
  }

  const existAttendance = (await AttendanceModel.findOne(
    findQuery
  )) as AttendanceType;

  if (schedule && existAttendance) {
    await AttendanceModel.findOneAndUpdate(
      findQuery,
      {
        status:
          existAttendance.status !== "Arrived"
            ? "Working Day"
            : existAttendance.status,
        $unset: { leave: "" },
        schedule,
      },
      { new: true }
    );
  }

  if (status === "Off") {
    await AttendanceModel.findOneAndUpdate(
      findQuery,
      {
        ...updateData,
        $unset: { leave: 1, halfOff: 1 },
        $set: {
          status: existAttendance?.checkIn?.time ? "Arrived" : status,
        },
      },
      { new: true, upsert: true }
    );
  } else if (status === "Morning Half Off" || status === "Evening Half Off") {
    await AttendanceModel.findOneAndUpdate(
      findQuery,
      {
        ...updateData,
        $unset: { leave: 1 },
        $set: { halfOff: status },
      },
      { new: true, upsert: true }
    );
  }

  if (status === "Removed Day Off") {
    if (existAttendance) {
      if (isPastDate(new Date(date))) {
        if (!existAttendance.leave) {
          await AttendanceModel.updateOne(findQuery, {
            ...updateData,
            $unset: { leave: 1, halfOff: 1 },
            $set: {
              status:
                existAttendance.checkIn?.time && existAttendance.checkOut?.time
                  ? "Arrived"
                  : "no status",
            },
          });
        }
      } else {
        console.log(existAttendance);
        if (existAttendance.status !== "Arrived")
          await AttendanceModel.findByIdAndDelete(existAttendance._id);
      }
    }
  }
  return existAttendance;
};

// shift.pre("findOneAndUpdate", async function (next) {
//   console.log("udpatelk", this.getUpdate());
//   const schedule = this.getUpdate()?.schedule;
//   const status = this.getUpdate()?.status;
//   const findQuery = this._conditions;
//   const date = this.getUpdate()?.date;

//   await handleShiftUpdate({ schedule, status, findQuery, date });
//   next();
// });

// shift.pre("save", async function (next) {
//   const schedule = this.schedule;
//   const status = this.status;
//   const findQuery = { employee: this.employee, date: this.date };
//   await handleShiftUpdate({ schedule, status, findQuery, date: this.date });
//   next();
// });

const ShiftModel = mongoose.models.Shift || model("Shift", shift);

export default ShiftModel;
