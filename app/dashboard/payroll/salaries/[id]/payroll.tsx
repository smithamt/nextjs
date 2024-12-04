import BackArrowWithTitle from "@/components/app/arrow";
import { Button } from "@/components/ui/button";
import { CompanyType, SalaryType } from "@/types";
import { FC } from "react";
import SalaryPrintBtn from "./printbtn";

interface EmpPayrollProps {
  salary: SalaryType;
  loading?: boolean;
  date: string;
  company: CompanyType;
}

const EmpPayroll: FC<EmpPayrollProps> = ({
  salary,
  loading = false,
  date,
  company,
}) => {
  const container = "cart-bg px-4 py-2 rounded-lg mb-2";

  return (
    <div className="p-2 h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <BackArrowWithTitle to={"/dashboard/payroll/salaries"}>
          {salary.employee.name} Payroll Detail
        </BackArrowWithTitle>
      </div>
      <div className="flex max-w-[1200px] mx-auto w-full">
        <div className="w-[70%] pr-4 ">
          <div className={container}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-lg">Basic Salary</p>
              <p className="font-semibold">
                {salary?.salary ? salary.salary : <span>Request Salary</span>}
                {salary?.empCurrency?.symbol}
              </p>
            </div>
            {[
              {
                name: "Working Hour",
                value: salary?.serviceHours,
              },
              {
                name: "Per Day",
                value: salary?.perDay?.toFixed(2),
              },
              {
                name: "Per hour",
                value: salary?.perHour?.toFixed(2),
              },
            ].map((i, k) => {
              return (
                <ChildCom
                  loading={loading}
                  name={i.name}
                  count={`${i.value}`}
                  amount={"0"}
                  key={k}
                />
              );
            })}
          </div>
          <div className={container}>
            <p className="font-bold text-lg">Attendances</p>
            <ChildCom
              loading={loading}
              name={"Total Service Day"}
              count={`${salary?.serviceDays}`}
              amount={`${
                salary && (salary?.serviceDays * salary?.perDay)?.toFixed(2)
              }`}
            />
            <ChildCom
              loading={loading}
              name={"Total Off Days"}
              count={`${salary?.offDays}`}
              amount={`${
                salary && (salary.offDays * salary.perDay).toFixed(2)
              }`}
            />
            <ChildCom
              loading={loading}
              name={"Absences"}
              count={`${salary?.absences}`}
              amount={`-${
                salary && (salary.absences * salary.perDay).toFixed(2)
              }`}
            />
            <ContainerRoll
              loading={loading}
              data={salary ? salary.leaveDays : []}
              title={"Leave Days"}
              header={"Days"}
            />
            <ContainerRoll
              loading={loading}
              data={[
                {
                  name: "Late",
                  value: `${
                    salary?.lateMinutes
                      ? -(salary.lateMinutes * 60).toFixed(0)
                      : 0
                  } mins`,
                  amount: salary
                    ? (salary?.lateMinutes * salary?.perHour)?.toFixed(2)
                    : 0,
                  isSafe: salary?.employee?.safeLate,
                },
                {
                  name: "Early Out",
                  value: `${
                    salary?.earlyOutMinutes
                      ? -(salary.earlyOutMinutes * 60).toFixed(0)
                      : 0
                  } mins`,
                  amount: salary
                    ? (salary?.earlyOutMinutes * salary?.perHour).toFixed(2)
                    : 0,
                  isSafe: salary?.employee.safeEarlyOut,
                },
                {
                  name: "Overtime",
                  value: salary?.overtime,
                  amount: salary?.overtimeAmount?.toFixed(2),
                },
              ]}
              title={"Attendance Hours"}
              header={"Hours"}
            />
            <div className="px-2 flex items-center justify-between">
              <p>Use Flexible Working Hour</p>
              <p>{salary?.employee.useFlexibleWorkingHour ? "Yes" : "No"}</p>
            </div>
          </div>
          <div className={container}>
            <p className="font-bold text-lg">Allowances</p>
            <HeaderCom type={""} />
            <p>
              {salary?.totalAllowances.map((i: any, k: number) => {
                return (
                  <ChildCom
                    loading={loading}
                    key={k}
                    name={i.name}
                    count={"0"}
                    amount={`${i.amount} ${i.currency?.symbol}`}
                  />
                );
              })}
            </p>
            <p className="font-bold text-lg">Deductions</p>
            <HeaderCom type={""} />
            <p>
              {salary?.totalDeductions.map((i: any, k: number) => {
                const amount = i.deductBySalary
                  ? i.deductBySalary * salary?.perDay
                  : i.amount;
                return (
                  <ChildCom
                    loading={loading}
                    key={k}
                    name={i.name}
                    count={"0"}
                    amount={amount}
                  />
                );
              }, [])}
            </p>
          </div>
          <div className={container}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-lg">Gross Payable</p>
              <p
                className={`${
                  loading &&
                  "min-w-[100px] min-h-[20px] skeleton-loader rounded-lg"
                }`}
              >
                {salary && Math.round(salary?.netSalary)}{" "}
                {salary?.empCurrency?.symbol}
              </p>
            </div>
          </div>
        </div>
        <div className="w-[30%]">
          <div className="cart-bg rounded-lg px-4 py-2">
            <p>Payment history</p>
            <p className="text-xs text-blue-600 hover:underline cursor-pointer">
              View Payment History
            </p>
          </div>
          <>
            <SalaryPrintBtn
              data={JSON.stringify(salary)}
              company={JSON.stringify(company)}
            />
            <Button
              className={`w-full text-white shadow mt-2 cursor-pointer ${
                salary?.paid
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {salary?.paid ? "Edit" : "Mark as Paid"}
            </Button>
          </>
        </div>
      </div>
    </div>
  );
};

export default EmpPayroll;

interface ChildComProps {
  needCut?: boolean;
  name: string;
  count: string;
  amount: string;
  loading?: boolean;
}

export const ChildCom: FC<ChildComProps> = ({
  name,
  count,
  amount,
  loading = false,
  needCut,
}) => {
  return (
    <div
      className={`${
        needCut && "border border-green-200"
      } mb-1 flex items-center justify-between ${
        !loading && "cursor-pointer"
      } p-2 rounded-lg`}
    >
      <p className="w-[200px]">{name}</p>
      <p
        className={`text-right w-1/4 ${
          loading && "skeleton-loader rounded-lg min-w-10 h-[20px]"
        }`}
      >
        {!loading && count}
      </p>
      <p
        className={`text-right w-1/4 ${
          loading && "skeleton-loader rounded-lg min-w-20 h-[20px]"
        }`}
      >
        {!loading && amount}
      </p>
    </div>
  );
};

const HeaderCom = ({ type }: { type: string }) => {
  return (
    <div className="flex items-center justify-between px-2 py-2 font-semibold text-xs">
      <p className="w-[200px]">Type</p>
      <p>Total {type}</p>
      <p>Total Amount</p>
    </div>
  );
};

interface ContainerRollProps {
  data: any[];
  title: string;
  header: string;
  loading: boolean;
}

const ContainerRoll: FC<ContainerRollProps> = ({
  title,
  data,
  header,
  loading,
}) => {
  return (
    <div className="w-full">
      <p className="font-bold text-center border-t border-b p-1 my-1">
        {title}
      </p>
      <HeaderCom type={header} />
      {data?.map((i) => {
        return (
          <ChildCom
            needCut={i.isSafe}
            loading={loading}
            key={i.name}
            name={i.name}
            count={i.value}
            amount={`${Math.round(i.amount)}`}
          />
        );
      })}
    </div>
  );
};
