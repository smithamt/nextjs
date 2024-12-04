import { useHasUser } from "@/app/_context/hasuser.context";
import { SignDate } from "@/app/dashboard/payroll/salaries/_components/payslips/payslip1";
import { Label } from "@/components/ui/label";
import { WarningType } from "@/types";
import dayjs from "dayjs";
import Image from "next/image";
import { FC } from "react";

const pageStyle = `
  @page {
    size: A4;
  }
  @media print {
    body {
      width: 210mm;
      height: 297mm;
    }
  }
  .a4-container {
    width: 210mm;
    height: 297mm;
  }
`;

type PrintPreview = {
  printRef?: any;
  warning: WarningType;
};

const WarningPrint: FC<PrintPreview> = ({ printRef, warning }) => {
  const { formatDate, company } = useHasUser();

  const src = warning.employee?.profile
    ? `/api/images/${warning.employee.profile?.image}/350/350`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <div ref={printRef} className="a4-container cart-bg border relative">
      <style>{pageStyle}</style>
      <div className="p-10">
        <div className="mb-4">
          <div className="absolute top-6 left-8">
            <Image fill src={"/assets/payslip.png"} alt={"profile"} />
          </div>
          <div>
            <p className="font-bold text-xl text-center mb-2">
              {company?.name}
            </p>
            {company?.otherName?.map((i, k) => (
              <p key={k} className="font-bold text-lg text-center">
                {i.name}
              </p>
            ))}
          </div>
        </div>
        <div className="text-center border border-black py-2 my-2 font-bold">
          DISCIPLINARY ACTION
        </div>
        <div className="flex">
          <Image width={112} height={128} src={src} alt={"profile"} />
          <div className="px-2 grid grid-cols-2 gap-1">
            <p title="Employee Name">
              {warning.employee.name} ({warning.employee.nickname})
            </p>
            <p title="Employee ID">{warning.employee.employeeId}</p>
            <p title="Position">{warning.employee.position?.name}</p>
            <p title="Department">{warning.employee.department?.name}</p>
            <p title="Joined Date">
              {dayjs(warning.employee.joinedDate).format(formatDate)}
            </p>
            <p title="Issue Date">
              {dayjs(warning.issuedDate).format(formatDate)}
            </p>
          </div>
        </div>
        <div className="text-center border border-black py-2 my-2 font-bold">
          Sanction and Disciplinary Action
        </div>
        <p>{warning.warningState?.name}</p>
        <div className="my-2">
          <Label className="underline">Details of Incident</Label>{" "}
          <Label>({warning.title})</Label>
          <div className="border border-black p-2 mt-2 min-h-[50px]">
            {warning.detailsOfIncident}
          </div>
        </div>
        <div className="mt-2">
          <Label className="underline">Corrective Action</Label>
          <div className="border border-black p-2 mt-2 min-h-[50px]">
            {warning.correctiveAction}
          </div>
        </div>{" "}
        <div className="mt-2">
          <Label className="underline">Employee Comment</Label>
          <div className="border border-black p-2 mt-2 min-h-[50px]">
            {warning.employeeComments}
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-4 mt-2">
          <div className="mt-2">
            <Label className="underline">Witnessed By</Label>
            <div className="mt-2 flex items-center">
              {warning.witnessedBy.map((w, k) => (
                <div key={k}>
                  <p title="ID:">{w.employeeId}</p>
                  <p title="Name:">
                    {w.name} ({w.nickname})
                  </p>
                </div>
              ))}
            </div>
          </div>{" "}
          <div className="mt-2">
            <Label className="underline">Issued By</Label>
            <div className="mt-2 flex items-center">
              {warning.issuedBy.map((w, k) => (
                <div key={k}>
                  <p title="ID:">{w.employeeId}</p>
                  <p title="Name:">
                    {w.name} ({w.nickname})
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <Label className="underline">Approved By</Label>
            <div className="mt-2 flex items-center">
              <div>
                <p title="ID:">{warning.approvedBy?.employeeId}</p>
                <p title="Name:">
                  {warning.approvedBy?.name} ({warning.approvedBy?.nickname})
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[280px] ml-auto text-[12px] mt-10">
          <SignDate label="Employee's Sign" />
        </div>
        <div className="text-xs font-semibold bottom-2 right-2 absolute">
          @apihr
        </div>
      </div>
    </div>
  );
};

export default WarningPrint;
