"use client";
import NextPreviousEmployee from "@/components/buttons/employeeShift";
import NextOrPreviousButtons from "@/components/buttons/shift";
import { usePathname } from "next/navigation";
import PlannerDayWeekNavbar from "./nav";

function PlannerChildHeader() {
  const pathname = usePathname();
  const title = pathname.split("/")[3];
  return (
    <div className="flex items-center flex-wrap gap-2">
      {title === "week" && <NextOrPreviousButtons className="flex-1" />}
      {title === "week" && <NextPreviousEmployee className="flex-1" size={10} />}
      <PlannerDayWeekNavbar className="flex-1" />
    </div>
  );
}

export default PlannerChildHeader;
