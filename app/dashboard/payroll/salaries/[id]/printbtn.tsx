"use client";
import { Button } from "@/components/ui/button";
import { CompanyType, SalaryType } from "@/types";
import { FC, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PayslipPrintPreview1 from "../_components/payslips/payslip1";

type PrintPreview = {
  data: string;
  company: string;
};

const SalaryPrintBtn: FC<PrintPreview> = ({ data: l, company: c }) => {
  const salary = JSON.parse(l) as SalaryType;
  const company = JSON.parse(c) as CompanyType;
  const printRef = useRef<any>();

  const handlePrints = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div className="w-full my-2">
      <Button className="w-full" onClick={handlePrints}>Print</Button>
      <div className="hidden">
        <PayslipPrintPreview1
          printRef={printRef}
          salary={salary}
          company={company}
        />
      </div>
    </div>
  );
};

export default SalaryPrintBtn;
