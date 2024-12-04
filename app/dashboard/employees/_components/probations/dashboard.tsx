import { getUser } from "@/data/user";
import Link from "next/link";
import { getProbationEndEmployeeDataDashboard } from "./action";
import ProbationDetail from "./employee";

async function EmployeeProbationsDashboard({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const probations = await getProbationEndEmployeeDataDashboard({
    user,
    searchParams,
    state: "month",
  });
  return (
    <div className="w-full h-auto p-2">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold">Birth Month Employees</p>
        <Link
          href={"/dashboard/employees/probations/month"}
          className="text-xs hover:underline"
        >
          View all
        </Link>
      </div>
      {probations.employees.map((employee, index) => (
        <ProbationDetail user={user} employee={employee} key={index} />
      ))}
    </div>
  );
}

export default EmployeeProbationsDashboard;
