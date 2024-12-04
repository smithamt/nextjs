import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import PayrollDashboardCardLayout from "./cardlayout";
import SalaryModel from "@/models/salaries/model";

async function FinalSettlementSalaryPreview() {
  const data = await SalaryModel.find()
    .populate({
      path: "company",
      select: "currency",
      populate: { path: "currency", select: "symbol" },
    })
    .populate("employee", "name profile nickname employeeId")
    .limit(6);

  return (
    <PayrollDashboardCardLayout
      headerContext={
        <Link
          href="/dashboard/payroll/final-settlements"
          className={cn(
            buttonVariants({
              className: "border-0 inactive-text",
              variant: "outline",
            })
          )}
        >
          Check All
        </Link>
      }
      mainTitle="Final Settlement Statement"
      contentTitle="Salary"
      description="Check unread messages, comments and other things that may require your
          attention."
    >
      {data.map((i, k) => {
        const src = i.employee?.profile?.image
          ? `/api/images/${i.employee.profile?.image}/100/100`
          : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

        return (
          <div
            key={k}
            className="flex items-center justify-between hover p-2 rounded-md"
          >
            <div className="flex items-center">
              <Image
                width={30}
                height={30}
                className="rounded-full shadow"
                src={src}
                alt={i.employee.name}
              />
              <div className="px-2">
                <p className="font-semibold text-sm">{i.employee.name}</p>
                <p className="text-xs font-semibold inactive-text">
                  {i.employee.employeeId}
                </p>
              </div>
            </div>
            <p>
              {Math.round(i.netSalary).toLocaleString("en-us")}{" "}
              {i.company.currency?.symbol}
            </p>
          </div>
        );
      })}
    </PayrollDashboardCardLayout>
  );
}

export default FinalSettlementSalaryPreview;
