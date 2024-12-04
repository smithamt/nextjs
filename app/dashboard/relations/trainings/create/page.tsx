import EmployeeModel from "@/models/employees/model";
import CreateTerminationClient from "./client";

async function CreateTraining({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await EmployeeModel.findOne({})
    .select("name nickname employeeId position department joinedDate")
    .populate("position department", "name");

  return <CreateTerminationClient employee={JSON.stringify(user)} edit="" />;
}

export default CreateTraining;
