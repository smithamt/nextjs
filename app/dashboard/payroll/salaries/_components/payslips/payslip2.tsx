// import dayjs from "dayjs";
import dayjs from "dayjs";
import Image from "next/image";
import { FC } from "react";
import { PayslipPrintPreviewType } from "./payslip1";

const PrintPreview: FC<PayslipPrintPreviewType> = ({
  printRef,
  salary,
  company,
}) => {
  const {
    date,
    perDay,
    offDays,
    lateAmount,
    earlyOutAmount,
    employee,
    empCurrency,
    serviceDays,
    deductions,
    earning,
    netSalary,
    absences,
  } = salary;

  const pageStyle = `
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

  const currencySymbol = company?.currency ? company?.currency.symbol : "";

  const sortEarningLeaves = salary.leaveDays.filter(
    (i) => !i.isPublicHoliday && i.amount > 0
  );
  const sortDeductionLeave = salary.leaveDays.filter((i) => i.amount < 0);
  const holidays = salary.leaveDays.filter((l) => l.isPublicHoliday);

  return (
    <div ref={printRef} className="a5-container bg-white text-black text-xs">
      <style>{pageStyle}</style>
      <div className="p-4">
        <div className="flex">
          <Image
            alt="profile"
            width={130}
            height={80}
            className="w-full h-full"
            src={"/assets/payslip"}
          />
          <div className="px-4">
            <p className="font-bold text-xl">{company?.name}</p>
            <p className="font-bold mt-4">အာရှပစိဖိတ်အပြည်ပြည်ဆိုင်ရာဟိုတယ်</p>
          </div>
        </div>
        <div className="rounded px-2 mt-2 flex text-xs flex-col">
          <h1 className="mb-4 text-lg font-bold text-center border border-black  rounded-sm">
            Employee Payslip
          </h1>
          <div className="flex">
            <div className="text-left flex-1 px-1">
              <TextCom title="ID" text={employee.employeeId} />
              <TextCom
                title="Name"
                text={
                  <p className="pl-1">
                    {employee.name + " "}
                    {employee.employeeId && (
                      <span className="text-[10px]">({employee.nickname})</span>
                    )}
                  </p>
                }
              />
              <TextCom
                title="Joined Date"
                text={
                  employee.joinedDate
                    ? dayjs(employee.joinedDate).format("YYYY-MM-DD")
                    : ""
                }
              />
            </div>
            <div className="text-left flex-1 px-1">
              <TextCom title="Position" text={salary.position?.name} />
              <TextCom title="Department" text={salary.department?.name} />
              <TextCom title="Pay Period" text={dayjs(date).format("MMMM")} />
            </div>
          </div>
          <div className="flex text-xs min-h-[160px] mt-4 border border-black">
            <div className="flex-1 border-r border-black">
              <div className="flex items-center border-b border-black  justify-between">
                <p className="text-center font-bold py-2 w-2/3 border-r border-black">
                  Earning
                </p>
                <p className="text-center font-bold py-2 w-1/3">Amount</p>
              </div>
              {[
                {
                  name: "Basic Salary",
                  value: `${salary?.salary} ${currencySymbol}`,
                },
                {
                  name: "Total Working Days",
                  value: serviceDays,
                },
                { name: "Total Day Off", value: offDays },
              ].map((i, k) => {
                return (
                  <ShowValue title={i.name} amount={`${i.value}`} key={k} />
                );
              })}
              {salary.overtime > 0 && (
                <ShowValue
                  title="Overtime"
                  amount={`${salary.overtimeAmount.toFixed(
                    0
                  )} ${currencySymbol}`}
                />
              )}
              {sortEarningLeaves.map((i, k) => {
                return (
                  <div
                    key={k}
                    className="flex items-center justify-between px-2 pt-2"
                  >
                    <p>{i.name}</p>
                    <p>1</p>
                  </div>
                );
              })}
              {holidays.length > 0 && (
                <div className="flex items-center justify-between px-2 pt-2">
                  <p>Public Holiday</p>
                  <p>{holidays.length}</p>
                </div>
              )}
              {salary.totalAllowances.map((i: any, k: number) => {
                return (
                  <div
                    key={k}
                    className="flex items-center justify-between px-2 pt-2"
                  >
                    <p>{i.name}</p>
                    <p>
                      {i.amount} {currencySymbol}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="flex-1">
              <div className="flex items-center border-black border-b justify-between">
                <p className="text-center font-bold py-2 w-2/3 border-black  border-r">
                  Deductions
                </p>
                <p className="text-center font-bold py-2 w-1/3">Amount</p>
              </div>
              {sortDeductionLeave.map((leave, k) => {
                return (
                  leave.amount !== 0 && (
                    <ShowValue
                      key={k}
                      title={leave.name}
                      amount={`${leave.amount.toFixed(0)} ${currencySymbol}`}
                    />
                  )
                );
              })}
              {[
                {
                  name: "Absences",
                  value: absences
                    ? `${-(absences * perDay).toFixed(0)} ${currencySymbol}`
                    : `0 ${currencySymbol}`,
                },
                {
                  name: "Late/ EarlyOut",
                  value: `${(lateAmount + earlyOutAmount).toFixed(2)} ${currencySymbol}`,
                },
              ].map((i, k) => {
                return (
                  <ShowValue title={i.name} amount={`${i.value}`} key={k} />
                );
              })}
              {salary.absences > 0 && (
                <ShowValue
                  title="Overtime"
                  amount={`${salary.absences.toFixed(0)} ${currencySymbol}`}
                />
              )}
              {salary.totalDeductions.map((i: any, k: number) => {
                return (
                  <div key={k} className="flex items-center justify-between">
                    <p>{i.name}</p>
                    <p>{i.amount}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex text-xs border-b border-black border-x">
            <div className="flex items-center h-full justify-between flex-1 border-r border-black">
              <p className="p-2 h-full font-bold w-2/3 border-r border-black ">
                Gross payable
              </p>
              <p className="text-right pr-2 font-bold w-1/3">
                {earning?.toFixed(0)} {currencySymbol}
              </p>
            </div>
            <div className="flex items-center h-full justify-between flex-1">
              <p className="p-2 text h-full font-bold w-2/3 border-r border-black ">
                Total Deductions
              </p>
              <p className="text-right pr-2 font-bold w-1/3">
                {deductions.toFixed(0)} {currencySymbol}
              </p>
            </div>
          </div>
          <div className="py-4 text-lg font-semibold flex items-center justify-between px-2 text-center">
            Net Payable:{" "}
            <span className="font-semibold">
              {Math.round(netSalary)?.toLocaleString("en-US")} {currencySymbol}
            </span>
          </div>
          <p className="border-4 border-double px-2 text-center py-2 border-black">
            Signature Required
          </p>
          <div className="flex justify-between text-xs">
            <div className="flex-1 pr-2">
              <div className="flex py-4">
                <p>Employee&apos;s Sign:</p>
                <div className="border-b border-black flex-1"></div>
              </div>
              <div className="flex py-4">
                <p>Date:</p>
                <div className="border-b border-black flex-1"></div>
              </div>
            </div>
            <div className="flex-1 pl-2">
              <div className="flex py-4">
                <p>CEO&apos;s Sign:</p>
                <div className="border-b border-black flex-1"></div>
              </div>
              <div className="flex py-4">
                <p>Date:</p>
                <div className="border-b border-black flex-1"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintPreview;

interface TextComProps {
  title: string;
  text?: React.ReactNode;
}

export const TextCom: FC<TextComProps> = ({ title, text }) => {
  return (
    <div className="flex py-1">
      <p className="font-bold w-[75px]">{title}</p>: {text}
    </div>
  );
};

interface ShowValueProps {
  title: string;
  amount: string;
}

const ShowValue: FC<ShowValueProps> = ({ title, amount }) => {
  return (
    <div className="flex items-center justify-between px-2 pt-2">
      <p>{title}</p>
      <p>{amount}</p>
    </div>
  );
};
