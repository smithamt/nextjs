"use client";
import { Button } from "@/components/ui/button";
import { WarningType } from "@/types";
import { FC, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PrintPage from "./print";

type PrintPreview = {
  data: string;
  company: string;
};

const WarningPrintBtn: FC<PrintPreview> = ({ data: l, company: c }) => {
  const warning = JSON.parse(l) as WarningType;
  const printRef = useRef<any>();

  const handlePrints = useReactToPrint({
    content: () => printRef.current,
  });

  return (
    <div className="h-full w-full overflow-y-auto p-2">
      <Button onClick={handlePrints}>Print</Button>
      <div className="hidden">
        <PrintPage warning={warning} printRef={printRef} />
      </div>
    </div>
  );
};

export default WarningPrintBtn;
