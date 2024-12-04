import { cn } from "@/lib/utils";
import { CompanyType, SalaryType } from "@/types";
import dayjs from "dayjs";
import { FC } from "react";
import { ChildCom } from "../../[id]/payroll";

export const pageStyle = `
    @page {
      size: A5;
    }
    @media print {
      body {
        width: 148mm;
        height: 208mm;
      }
    }
    .a5-container {
      width: 148mm;
      height: 208mm;
    }
  `;

export type PayslipPrintPreviewType = {
  printRef: any;
  salary: SalaryType;
  company: CompanyType;
};

const PayslipPrintPreview1: FC<PayslipPrintPreviewType> = ({
  printRef,
  salary,
  company,
}) => {
  const {
    date,
    perDay,
    perHour,
    offDays,
    lateMinutes,
    earlyOutMinutes,
    employee,
    position,
    department,
    empCurrency,
    totalAllowances,
    totalDeductions,
    serviceDays,
    deductions,
    earning,
    netSalary,
  } = salary;

  const payable = [
    { name: "Service Days", data: serviceDays, rate: perDay },
    { name: "OverTime", data: 1, rate: perHour },
    { name: "Day Off", data: offDays, rate: perDay },
  ];
  const basicSalary = salary.salary;

  return (
    <div ref={printRef} className="a5-container cart-bg text-xs">
      <style>{pageStyle}</style>
      <div className="p-4">
        <div className="flex items-center justify-between py-4">
          <p className="font-semibold text-lg px-2">{company?.name}</p>
          <p className="font-[800] ml-2 text-blue-500 text-[20px]">
            {company?.name}
          </p>
          <p className="font-[800] text-blue-600 text-[25px] tracking-wider">
            PAYSLIP
          </p>
        </div>
        <div className="flex justify-between mt-2">
          <div className="flex-1">
            <p className="bg-blue-500 text-white px-2 text-center py-1 rounded-lg">
              Employee Information
            </p>
            <div className="p-2">
              <p className="font-bold">{employee?.employeeId}</p>
              <p>
                {employee?.name}
                {employee?.nickname && ` ( ${employee?.nickname} )`}
              </p>
              <p> {position?.name}</p>
              <p>{employee?.contactNo}</p>
              <p className="font-bold">{department?.name}</p>
            </div>
          </div>
          <div className="flex-1 ml-1">
            <p className="bg-blue-500 text-white px-2 text-center py-1 rounded-lg">
              Pay Period
            </p>
            <p className="text-xl text-center font-bold py-4">
              {dayjs(date).format("MMMM")}
            </p>
          </div>
        </div>
        <div className="">
          <div className="flex bg-gray-200 rounded-sm py-1 mb-1">
            {["Earning", "Total", "Rate", "Amount"].map((title, index) => {
              return (
                <p className="flex-1 font-bold text-center" key={index}>
                  {title}
                </p>
              );
            })}
          </div>
          <div className="flex items-center justify-between px-2 py-1">
            <p>Basic Salary</p>
            <p>
              {basicSalary} {empCurrency?.symbol}
            </p>
          </div>
          {payable.map((i, k) => {
            if (i.data <= 0) return;
            return (
              <div key={k}>
                <div className="flex items-center justify-between px-2 py-1">
                  <p className="w-1/3">{i.name}</p>
                  <p className="w-4 text-right">{i.data}</p>
                  <p className="w-1/4 text-right">
                    {i.rate?.toFixed(2)} {salary?.empCurrency?.symbol}
                  </p>
                  <p className="w-1/4 text-right">
                    {(i.data * salary.perDay).toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
          {salary.absences > 0 && (
            <div className="text-red-500">
              <div className="flex items-center justify-between px-2 py-1">
                <p className="w-1/3">Absences</p>
                <p className="w-4 text-right">{salary.absences}</p>
                <p className="w-1/4 text-right">
                  {(perHour * 1.1).toFixed(2)} {salary?.empCurrency?.symbol}
                </p>
                <p className="w-1/4 text-right">
                  {(salary?.absences * salary?.perDay).toFixed(2)}
                </p>
              </div>
            </div>
          )}
          {salary.overtime > 0 && (
            <div>
              <div className="flex items-center justify-between px-2 py-1">
                <p className="w-1/3">Overtime</p>
                <p className="w-4 text-right">{salary.overtime}</p>
                <p className="w-1/4 text-right">
                  {(perHour * 1.1).toFixed(2)} {salary?.empCurrency?.symbol}
                </p>
                <p className="w-1/4 text-right">
                  {salary?.overtimeAmount.toFixed(2)}
                </p>
              </div>
            </div>
          )}
          {salary.leaveDays.length > 0 && (
            <div className="">
              <p className="font-bold rounded-sm text-center bg-gray-200 py-1 mt-1">
                Leave Days
              </p>
              {salary.leaveDays.map((leave, index) => {
                if (leave.value <= 0) return;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between px-2 py-1"
                  >
                    <p className="relative w-1/3">
                      {leave.name}
                      <span className="text-[10px] absolute top-0 px-1">
                        {leave.type}
                      </span>
                    </p>
                    <p className="w-4 text-right">{leave.value}</p>
                    <p className="w-1/4 text-right">
                      {leave.rate?.toFixed(2)} {empCurrency?.symbol}
                    </p>
                    <p className="w-1/4 text-right">
                      {leave.amount?.toFixed(2)} {empCurrency?.symbol}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          {totalAllowances?.length > 0 && (
            <div>
              <p className="font-bold text-center bg-gray-200 rounded-sm py-1 my-1">
                Allowance
              </p>
              <div className=" px-2 py-1">
                {totalAllowances.map((allowance, index) => {
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2"
                    >
                      <p>{allowance.name}</p>
                      <p>
                        {allowance.amount} {allowance.currency?.symbol}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div className="bg-gray-300 mt-1 rounded-sm justify-between items-center px-2 py-1 flex">
            <p>Gross Payable</p>
            <p>
              {earning?.toFixed(2)} {empCurrency?.symbol}
            </p>
          </div>
          {totalDeductions.length > 0 && (
            <div>
              <p className="font-bold mt-1 text-center bg-gray-200 py-1 my-1">
                Deduction
              </p>
              {lateMinutes < 0 &&
                !salary?.employee?.safeLate &&
                !salary?.employee?.useFlexibleWorkingHour && (
                  <ChildCom
                    name="Late"
                    count={lateMinutes.toFixed(2)}
                    amount={`${(lateMinutes * perHour).toFixed(2)}`}
                  />
                )}
              {earlyOutMinutes < 0 &&
                !salary?.employee?.safeEarlyOut &&
                !salary?.employee?.useFlexibleWorkingHour && (
                  <ChildCom
                    name="EarlyOut"
                    count={earlyOutMinutes.toFixed(2)}
                    amount={`${(lateMinutes * perHour).toFixed(2)}`}
                  />
                )}
              {deductions >= 0 &&
                totalDeductions.map((allowance, index) => {
                  const amount = allowance.deductBySalary
                    ? allowance.deductBySalary * perDay
                    : allowance.amount;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between px-2 py-1"
                    >
                      <p>{allowance.name}</p>
                      <p>
                        {amount} {allowance.currency?.symbol}
                      </p>
                    </div>
                  );
                })}
              <div className="bg-gray-300 justify-between items-center px-2 py-1 flex">
                <p>Total Deductions</p>
                <p>{deductions?.toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="w-1/2 bg-blue-500 text-white ml-auto mt-1 px-2 py-1 flex items-center justify-between">
          <p className="text-normal">Net Payable</p>
          <p>
            {Math.round(netSalary)}{" "}
            {company?.currency ? company.currency?.symbol : ""}
          </p>
        </div>
        <div className="flex justify-between text-[12px] mt-10">
          <SignDate label="Employee's Sign" />
          <SignDate label="CEO's Sign" />
        </div>
      </div>
    </div>
  );
};

export default PayslipPrintPreview1;

export const SignDate = ({
  label,
  className,
}: {
  label: string;
  className?: string;
}) => {
  return (
    <div className={cn("flex-1 px-2", className)}>
      <div className="flex py-2">
        <p>{label}:</p>
        <div className="border-b border-black flex-1"></div>
      </div>
      <div className="flex py-2">
        <p>Date:</p>
        <div className="border-b border-black flex-1"></div>
      </div>
    </div>
  );
};
