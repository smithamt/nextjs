import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ADMIN } from "@/roles";
import {
    AppraisalType,
    EmployeeContractType,
    EmployeeType,
    RefIDType,
} from "@/types";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import { IoNotifications } from "react-icons/io5";

interface CheckAppraisalExistsProps {
  employee: EmployeeType & { refId: RefIDType };
  existAppraisal: AppraisalType | undefined;
  existContract: EmployeeContractType | undefined;
}

const CheckAppraisalExists: FC<CheckAppraisalExistsProps> = ({
  employee,
  existAppraisal,
  existContract,
}) => {
  return (
    <div>
      <div className="flex justify-between">
        <div>
          <p className="font-bold">
            {employee.name} ({employee.nickname})
          </p>
          <p>{employee.employeeId}</p>
          <p>{employee.department.name}</p>
          <p className="capitalize">{employee.refId}</p>
        </div>
        <Button variant={"ghost"}>
          {false ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <IoNotifications />
          )}
        </Button>
      </div>
      <div className="w-full flex items-center space-x-2 mt-2">
        {existContract && ADMIN === "admin" ? (
          <Link
            href={`/dashboard/employees/contracts/${existContract._id}`}
            className={cn(
              buttonVariants({
                variant: "default",
                className: "bg-green-500 hover:bg-green-600",
              })
            )}
          >
            Contract
          </Link>
        ) : (
          <Link
            href={`/dashboard/employees/cart/${employee._id}/reviews`}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Profile
          </Link>
        )}
        <Link
          href={
            existAppraisal
              ? `/dashboard/employees/appraisals/${existAppraisal._id}?employee=${employee._id}&refId=${employee.refId}`
              : `/dashboard/employees/appraisals/create?employee=${employee._id}&refId=${employee.refId}`
          }
          className={cn(buttonVariants({ variant: "default" }))}
        >
          {existAppraisal ? "Check Appraisal" : "Create Appraisal"}
        </Link>
      </div>
    </div>
  );
};

export default CheckAppraisalExists;
