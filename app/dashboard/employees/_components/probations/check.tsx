import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ADMIN } from "@/roles";
import {
  AppraisalType,
  EmployeeContractType,
  EmployeeType,
  RefIDType,
  RoleType,
} from "@/types";
import Link from "next/link";
import { FC } from "react";
import { IoNotifications } from "react-icons/io5";

interface CheckAppraisalExistsProps {
  employee: EmployeeType & { refId: RefIDType };
  existAppraisal: AppraisalType | undefined;
  existContract: EmployeeContractType | undefined;
  role: RoleType;
}

const CheckAppraisalExists: FC<CheckAppraisalExistsProps> = ({
  employee,
  existAppraisal,
  existContract,
  role,
}) => {
  return (
    <>
      <div className="flex justify-between">
        <div>
          <p className="font-bold text-lg">
            {employee.name} ({employee.nickname})
          </p>
          <p>{employee.employeeId}</p>
          <p>{employee.department.name}</p>
          <p className="capitalize">{employee.refId}</p>
        </div>
        <Button variant={"ghost"}>
          <IoNotifications className="mr-2 h-4 w-4" />
        </Button>
      </div>
      <div className="w-full flex items-center space-x-2 mt-2">
        {existContract && ADMIN === role ? (
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
              : `/dashboard/employees/create/appraisal/${employee._id}?employee=${employee._id}&refId=${employee.refId}`
          }
          className={cn(buttonVariants({ variant: "default" }))}
        >
          {existAppraisal ? "Check Appraisal" : "Create Appraisal"}
        </Link>
      </div>
    </>
  );
};

export default CheckAppraisalExists;
