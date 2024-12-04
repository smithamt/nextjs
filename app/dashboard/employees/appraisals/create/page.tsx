import connectMongo from "@/config/mongo";
import AppraisalModel from "@/models/appraisals/model";
import DevelopmentPlanModel from "@/models/developmentplans/model";
import EmployeeModel from "@/models/employees/model";
import EvaluationModel from "@/models/evaluations/model";
import { notFound } from "next/navigation";
import CreateAppraisal from "./client";

async function Appraisals({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  await connectMongo();
  const { employee: id, refId } = searchParams;
  const employee = await EmployeeModel.findById(id)
    .select("name profile employeeId position department")
    .populate("position department", "name");
  const evaluations = await EvaluationModel.find();
  const developmentplans = await DevelopmentPlanModel.find();
  if (!employee) return notFound();
  const appraisal = await AppraisalModel.findOne({
    employee: employee._id,
    refId,
  }).populate(
    "evaluations.evaluation developmentplans.developmentplan",
    "name question"
  );

  return (
    <CreateAppraisal
      data={JSON.stringify({
        searchParams,
        employee,
        developmentplans,
        evaluations,
        appraisal,
      })}
    />
  );
}

export default Appraisals;
