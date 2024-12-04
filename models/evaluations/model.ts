import mongoose, { model, Schema } from "mongoose";

const LEVEL_TO_SHOW_EVELUATION = ["manager", "staff", "all"];

const evaluationSchema = new Schema(
  {
    name: String,
    skillType: { type: String, enum: ["people", "job"] },
    appraisalType: {
      type: String,
      enum: ["probation-end", "year-end"],
      default: "probation-end",
    },
    levelType: { type: String, enum: LEVEL_TO_SHOW_EVELUATION, default: "all" },
    description: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "Employee" },
    company: { type: Schema.Types.ObjectId, ref: "Company" },
    isPublic: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const EvaluationModel =
  mongoose.models.Evaluation || model("Evaluation", evaluationSchema);

export default EvaluationModel;
