import connectMongo from "@/config/mongo";
import RenewalContractModel from "@/models/renewals/model";
import EmployeeContractClient from "./client";

async function EmployeeContracts({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  await connectMongo();
  const { size = 10, page = 1 } = searchParams;
  const limit = Number(size) * Number(page);
  const contracts = await RenewalContractModel.find()
    .select("-textEditor")
    .populate({
      path: "employee",
      select: "name profile employeeId nickname",
      populate: {
        path: "position",
        select: "name",
      },
    })
    .limit(limit)
    .lean();

  const count = await RenewalContractModel.countDocuments();

  return (
    <EmployeeContractClient
      contracts={JSON.stringify(contracts)}
      count={count}
    />
  );
}

export default EmployeeContracts;
