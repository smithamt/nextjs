import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AppraisalType, EmployeeType, RefIDType } from "@/types";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import CheckAppraisalExists from "./check";

type ProbationDetailProps = {
  employee: EmployeeType & {
    status: "oneYearEnd" | "probationEnd";
    refId: RefIDType;
    appraisal: AppraisalType;
  };
  user: EmployeeType;
};

const styles = {
  oneYearEnd: {
    backgroundColor: "rgba(239,240,252,255)",
    border: `1px solid #b4b4f5`,
    color: "#a19af5",
  },
  probationEnd: {
    backgroundColor: "rgba(254,243,220,255)",
    border: `1px solid #fab274`,
    color: "#ff8114",
  },
};

function ProbationDetail({ employee, user }: ProbationDetailProps) {
  const existAppraisal = employee.appraisal;

  const src = employee?.profile?.image
    ? `/api/images/${employee.profile?.image}/150/150`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div
          className={cn(
            "flex items-center justify-between p-1 mb-1 rounded-md w-full",
            existAppraisal ? "bg-blue-500/50 hover:bg-blue-600/50" : "hover"
          )}
        >
          <div className="flex">
            <Image
              width={40}
              height={40}
              className="rounded-full"
              alt="profile"
              src={src}
            />
            <div className="px-2">
              <Link
                href={
                  existAppraisal
                    ? `/dashboard/employees/appraisals/${existAppraisal._id}?employee=${employee._id}&refId=${employee.refId}`
                    : `/dashboard/employees/create/appraisal/${employee._id}?employee=${employee._id}&refId=${employee.refId}`
                }
                className="font-semibold hover:underline flex items-center justify-between"
              >
                {employee.nickname ? employee.nickname : employee.name}
                <span>({dayjs(employee.joinedDate).format("YYYY-MM-DD")})</span>
              </Link>
              <p className="font-semibold inactive-text text-xs">
                {employee.position?.name}
              </p>
            </div>
          </div>
          <div
            className="border rounded-lg p-1 w-[120px] center flex-col font-semibold"
            style={styles[employee.status] || {}}
          >
            <Label>{employee.status}</Label>
            <p>
              {dayjs(employee.joinedDate)
                .add(employee.status === "probationEnd" ? 3 : 12, "M")
                .format("YYYY-MM-DD")}
            </p>
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <CheckAppraisalExists
          role={user.role}
          existAppraisal={existAppraisal}
          employee={employee}
          existContract={undefined}
        />
      </HoverCardContent>
    </HoverCard>
  );
}

export default ProbationDetail;
