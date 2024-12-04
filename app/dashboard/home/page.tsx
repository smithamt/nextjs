import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BarChartComponent } from "./_components/charts/bar/barchart";
import { LineChartComponent } from "./_components/charts/line/linechart";
import { PieChartDonut } from "./_components/charts/pie/piechartdonut";

async function Home() {
  return (
    <div className="h-screen p-2 w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="font-bold text-lg">Home</p>
        <Link
          href={"/dashboard/home/attendance"}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Attendance
        </Link>
      </div>
      <div className="flex flex-wrap space-x-4">
        <div className="w-[400px] mb-4">
          <PieChartDonut />
        </div>
        <div>
          <LineChartComponent />
        </div>
      </div>
      <div className="w-full">
        <BarChartComponent />
      </div>
    </div>
  );
}

export default Home;
