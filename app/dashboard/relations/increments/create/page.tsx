import EmployeeModel from "@/models/employees/model";
import CreateTerminationClient from "./client";

async function CreateLeaveRequest({ params }: { params: { id: string } }) {
  const user = await EmployeeModel.findOne({})
    .select("name nickname employeeId position department joinedDate")
    .populate("position department", "name");

  return <CreateTerminationClient employee={JSON.stringify(user)} edit="" />;
}

export default CreateLeaveRequest;
