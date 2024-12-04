import EmployeeModel from "@/models/employees/model";
import CreatePromotionRequestClient from "./client";

async function CreatePromotionRequest({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await EmployeeModel.findOne({})
    .select("name nickname employeeId position department joinedDate")
    .populate("position department", "name");

  const positions: any[] = [];

  return (
    <CreatePromotionRequestClient
      position={JSON.stringify(positions)}
      employee={JSON.stringify(user)}
      edit={searchParams.edit as string}
    />
  );
}

export default CreatePromotionRequest;
