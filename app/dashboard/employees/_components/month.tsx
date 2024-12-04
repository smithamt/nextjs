import ExportBtn from "@/components/page";
import { cn, getMonth } from "@/lib/utils";
import { EmployeeType, RefIDType } from "@/types";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

type AppraisalEmployeeType = EmployeeType & {
  appraisal: { _id: string };
  refId: RefIDType;
  contract: { _id: string };
};

async function EmployeeDashbaordCalendar({
  title,
  data,
  searchParams,
}: {
  title: "probations" | "births";
  data: { total: number; employees: AppraisalEmployeeType[] };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { next = 0 } = searchParams;
  const daysMatrix = getMonth(next ? Number(next) : 0, 6);
  const { employees, total } = data;

  return (
    <div className="w-full h-[calc(100%-150px)] p-4">
      <div className="grid grid-cols-7 grid-rows-6 w-full h-full cart-bg rounded-lg shadow-m">
        {daysMatrix.map((week, weekIndex) => {
          return (
            <Fragment key={weekIndex}>
              {week.map((day, dayIndex) => {
                const dayemployees = employees.filter(
                  (emp) =>
                    dayjs(emp.joinedDate).format("DD") ===
                    dayjs(day).format("DD")
                );

                return (
                  <div
                    className="border-r border-b flex-1 flex flex-col"
                    key={dayIndex}
                  >
                    <div className="p-1 flex items-center justify-between">
                      <p
                        className={cn(
                          "font-bold w-6 h-6 rounded-full center",
                          dayjs(day).format("MMMM") !==
                            dayjs()
                              .add(Number(next || "0"), "month")
                              .format("MMMM") && "inactive-text",
                          dayjs(day).format("YYYY-MM-DD") ===
                            dayjs().format("YYYY-MM-DD") &&
                            "bg-blue-500 text-white"
                        )}
                      >
                        {dayjs(day).format("D")}
                      </p>
                      {dayemployees.length && (
                        <Link
                          href={`/dashboard/employees/${title}/week?date=${dayjs(day).format("YYYY-MM-DD")}`}
                          className="text-xs inactive-text hover:underline"
                        >
                          {dayemployees.length} emps
                        </Link>
                      )}
                    </div>
                    <Link
                      href={`/dashboard/employees/${title}/week?date=${dayjs(day).format("YYYY-MM-DD")}`}
                      className="p-1 flex flex-row overflow-x-hidden hover flex-1"
                    >
                      {dayemployees?.map((emp, index) => {
                        const existAppraisal = emp.appraisal;
                        const existContract = emp.contract;

                        const src = emp?.profile?.image
                          ? `/api/images/${emp.profile?.image}/150/150`
                          : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

                        return (
                          <p
                            key={index}
                            className="min-w-[30px] max-w-[30px] h-10 rounded-full relative"
                          >
                            <Image
                              className={cn(
                                "rounded-full absolute min-w-[36px] max-w-[36px] p-[2px]",
                                existAppraisal &&
                                  "bg-blue-500 hover:bg-blue-600",
                                existContract && "bg-green-500 hover:bg-green-600"
                              )}
                              width={36}
                              height={36}
                              src={src}
                              alt="@profile"
                            />
                          </p>
                        );
                      })}
                    </Link>
                  </div>
                );
              })}
            </Fragment>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <p className="font-bold px-2">Total {total}</p>
        <ExportBtn data={JSON.stringify(employees)} title={title} />
      </div>
    </div>
  );
}

export default EmployeeDashbaordCalendar;
