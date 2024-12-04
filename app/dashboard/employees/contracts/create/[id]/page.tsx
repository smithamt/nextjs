import { getUser } from "@/data/user";
import EmployeeModel from "@/models/employees/model";
import RenewalContractModel from "@/models/renewals/model";
import CreateRenewalContractClient from "./client";
import ContractModel from "@/models/contracts/model";

async function CreateEmployeeRenewalContract({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;

  const employee = await EmployeeModel.findById(params.id);
  const existContract = await RenewalContractModel.exists({
    employee: employee._id,
    refId: searchParams.refId,
  });
  employee.existContract = existContract;
  const contracts = await ContractModel.find({
    isPublic: true,
    company: user.company,
  })
    .populate("textEditor")
    .lean();
  employee.refId = searchParams.refId;
  employee.score = searchParams.score;

  return (
    <CreateRenewalContractClient
      employee={JSON.stringify(employee)}
      contracts={JSON.stringify(contracts)}
    />
  );
}

export default CreateEmployeeRenewalContract;
