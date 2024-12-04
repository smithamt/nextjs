import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { EmployeeType, RefIDType } from "@/types";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import CheckAppraisalExists from "./content";

type AppraisalEmployeeType = EmployeeType & {
  appraisal: { _id: string };
  refId: RefIDType;
  contract: { _id: string };
};

function WeekEmployees({
  next,
  data,
  week,
}: {
  next: string;
  data: { total: number; employees: AppraisalEmployeeType[] };
  week: Date[];
}) {
  return week.map((day, dayIndex) => {
    const dayemployees = data.employees.filter(
      (emp) => dayjs(emp.joinedDate).format("DD") === dayjs(day).format("DD")
    );

    return (
      <div className="border-r border-b flex-1" key={dayIndex}>
        <div className="p-1">
          <p
            className={cn(
              "font-bold w-6 h-6 rounded-full center",
              dayjs(day).format("MMMM") !==
                dayjs()
                  .add(Number(next || "0"), "month")
                  .format("MMMM") && "inactive-text",
              dayjs(day).format("YYYY-MM-DD") ===
                dayjs().format("YYYY-MM-DD") && "bg-blue-500 text-white"
            )}
          >
            {dayjs(day).format("D")}
          </p>
        </div>
        <div className="p-1 space-y-1 flex flex-col gap-[2px] pb-2">
          {dayemployees?.map((emp, index) => {
            const existAppraisal = emp.appraisal;
            const existContract = emp.contract;

            const src = emp?.profile?.image
              ? `/api/images/${emp.profile?.image}/150/150`
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

            return (
              <HoverCard key={index}>
                <HoverCardTrigger>
                  <div
                    className={cn(
                      "flex items-center justify-between p-1 rounded-md w-full",
                      existAppraisal &&
                        "bg-blue-500 hover:bg-blue-600 text-white",
                      existContract &&
                        "bg-green-500 hover:bg-green-600 text-white",
                      !existAppraisal && !existContract && "hover"
                    )}
                  >
                    <Image
                      className="rounded-full"
                      width={40}
                      height={40}
                      src={src}
                      alt="@profile"
                    />
                    <div className="px-2 flex-1">
                      <div className="flex items-center justify-between">
                        <Link
                          href={
                            existAppraisal
                              ? `/dashboard/employees/appraisals/${existAppraisal._id}?employee=${emp._id}&refId=${emp.refId}`
                              : `/dashboard/employees/create/appraisal/${emp._id}?employee=${emp._id}&refId=${emp.refId}`
                          }
                          className="font-semibold hover:underline"
                        >
                          {emp.nickname ? emp.nickname : emp.name}
                        </Link>
                      </div>
                      <p className="font-semibold text-[10px]">
                        {emp.position?.name}
                        {"/ "}
                        <span>
                          {dayjs(emp.joinedDate).format("YYYY-MM-DD")}
                        </span>
                      </p>
                    </div>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent>
                  <CheckAppraisalExists
                    //@ts-ignore
                    existAppraisal={existAppraisal}
                    employee={emp}
                  />
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      </div>
    );
  });
}

export default WeekEmployees;
