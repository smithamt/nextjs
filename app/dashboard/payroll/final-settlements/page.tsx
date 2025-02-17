import BackArrowWithTitle from "@/components/app/arrow";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Final Settlement",
  description: "Generated by create next app",
  icons: {
    icon: "/vite.svg",
  },
};

function PayrollFinalSettlements() {
  return (
    <div className="h-screen w-full">
      <div className="flex items-center justify-between">
        <BackArrowWithTitle to="/dashboard/payroll">
          Final Settlement
        </BackArrowWithTitle>
      </div>
    </div>
  );
}

export default PayrollFinalSettlements;
