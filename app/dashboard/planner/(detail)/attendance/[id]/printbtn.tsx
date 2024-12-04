"use client";
import { Button } from "@/components/ui/button";
import { CompanyType, LeaveRequestType } from "@/types";
import { FC, useRef } from "react";
import { useReactToPrint } from "react-to-print";

type PrintPreview = {
  data: string;
  company: string;
};

const ResignationPrintBtn: FC<PrintPreview> = ({ data: l, company: c }) => {
  const leaveRequest = JSON.parse(l) as LeaveRequestType;
  const company = JSON.parse(c) as CompanyType;
  const printRef = useRef<any>();

  const handlePrints = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div className="h-full w-full overflow-y-auto p-2">
      <Button onClick={handlePrints}>Print</Button>
      <div className="hidden">
        {/* <PrintPage
          leaveRequest={leaveRequest}
          company={company}
          printRef={printRef}
        /> */}
      </div>
    </div>
  );
};

export default ResignationPrintBtn;
