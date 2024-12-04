import ShowNoText from "@/components/app/nodata";
import PaginationComponent from "@/components/app/pagination";
import EmployeeProfile from "@/components/profile/page";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { getEmployeeQuery } from "@/data/employees";
import { cn } from "@/lib/utils";
import EmployeeModel from "@/models/employees/model";
import { EmployeeType } from "@/types";
import Link from "next/link";

async function Employees({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { page = "1", size = "20" } = searchParams;
  const start = (Number(page) - 1) * Number(size);
  const employeeQuery = await getEmployeeQuery(searchParams, "employees");

  const employees = (await EmployeeModel.find(employeeQuery)
    .skip(start)
    .limit(Number(size))
    .populate("position department", "name isHeadOfDepartment")
    .lean()) as EmployeeType[];

  const count = await EmployeeModel.countDocuments(employeeQuery);

  return (
    <div className="h-full w-full p-2">
      <div className="h-[calc(100%-60px)] w-full overflow-y-auto">
        <div className="w-full mx-auto flex flex-wrap justify-start gap-2">
          {employees.length <= 0 && <ShowNoText>No employee found</ShowNoText>}
          {employees?.map((i, k) => (
            <Card className="min-w-[250px] flex-1" key={k}>
              <CardHeader className="p-1">
                <div className="flex">
                  <EmployeeProfile
                    employee={i}
                    to={`/dashboard/employees/${i.employeeId.toLowerCase()}`}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <p>{i.position?.name}</p>
                <p>{i.department?.name}</p>
              </CardContent>
              <CardFooter className="justify-end gap-2 p-2">
                <Link
                  href={`/dashboard/employees/contracts/${i.employeeId.toLowerCase()}`}
                  className={cn(buttonVariants({ variant: "default" }))}
                >
                  Contract
                </Link>
                <Link
                  className={cn(buttonVariants({ variant: "default" }))}
                  href={`/dashboard/employees/${i.employeeId.toLowerCase()}`}
                >
                  Detail
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <PaginationComponent count={count} initialSize={Number(size)} />
    </div>
  );
}

export default Employees;
