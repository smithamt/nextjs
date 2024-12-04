import mongoose, { Schema, model } from "mongoose";

 

const ExchangeRateSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "Currency",
      required: true,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "Currency",
      required: true,
    },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    rate: {
      type: Number,
      required: true,
    },
    ref: String,
    lastUpdated: {
      type: Date,
      default: Date.now,
    },

    isPublic: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee", required: true },
  },
  { timestamps: true }
);

const ExchangeModel =
  mongoose.models.Exchange || model("Exchange", ExchangeRateSchema);

export default ExchangeModel;
