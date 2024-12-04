import EmployeeModel from "@/models/employees/model";
import CreateResignationRequestClient from "./client";

async function CreateResignationRequest({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await EmployeeModel.findOne({})
    .select("name nickname employeeId position department joinedDate")
    .populate("position department", "name");

  return (
    <CreateResignationRequestClient employee={JSON.stringify(user)} edit={""} />
  );
}

export default CreateResignationRequest;
