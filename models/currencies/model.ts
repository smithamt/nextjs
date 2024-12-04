import mongoose, { Schema, model } from "mongoose";

 

const currencySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    keyword: {
      type: String,
      required: true,
      unique: true,
    },
    symbol: {
      type: String,
      required: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
    color: {
      text: String,
      back: String,
    },
    ref: String,
    isPublic: {
      type: Boolean,
      default: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee" },
  },
  { timestamps: true }
);

const CurrencyModel =
  mongoose.models.Currency || model("Currency", currencySchema);
export default CurrencyModel;
