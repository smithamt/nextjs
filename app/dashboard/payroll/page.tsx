import connectMongo from "@/config/mongo";
import { SalaryBarChartComponent } from "./_components/charts/bar/barchart";
import ThisMonthSalaryPreview from "./_components/layouts/salary";
import FinalSettlementSalaryPreview from "./_components/layouts/settlement";

async function Payroll() {
  await connectMongo();
  return (
    <div className="w-full h-screen p-2 overflow-y-auto">
      <SalaryBarChartComponent />
      <ThisMonthSalaryPreview />
      <FinalSettlementSalaryPreview />
      <ThisMonthSalaryPreview />
      <ThisMonthSalaryPreview />
    </div>
  );
}

export default Payroll;
