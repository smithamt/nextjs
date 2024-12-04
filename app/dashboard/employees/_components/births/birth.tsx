import { getUser } from "@/data/user";
import Link from "next/link";
import { getBirthMonthsDashboard } from "../../births/month/action";
import { BirthdayEmployee } from "./employee";

async function EmployeeBirthdayDashboard({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const employees = await getBirthMonthsDashboard({ user, searchParams });
  return (
    <div className="w-full h-auto p-2">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold">Birth Month Employees</p>
        <Link
          href={"/dashboard/employees/births/month"}
          className="text-xs hover:underline"
        >
          View all
        </Link>
      </div>
      {employees.map((employee, index) => (
        <BirthdayEmployee
          employee={employee}
          key={index}
          size={40}
          role={user.role}
        />
      ))}
    </div>
  );
}

export default EmployeeBirthdayDashboard;
