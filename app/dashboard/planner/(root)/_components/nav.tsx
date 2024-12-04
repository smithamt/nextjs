"use client";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function PlannerDayWeekNavbar({ className }: { className?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const week = pathname.includes("/week");
  const day = pathname.includes("/day");

  const currentParams = new URLSearchParams(searchParams.toString());

  return (
    <Tabs defaultValue="account" className={cn("min-w-44", className)}>
      <TabsList className="grid w-full grid-cols-2">
        <Link
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm py-1.5 text-sm font-medium transition-all",
            week && "cart-bg"
          )}
          href={`/dashboard/planner/week?${currentParams.toString()}`}
        >
          Week
        </Link>{" "}
        <Link
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm  py-1.5 text-sm font-medium transition-all",
            day && "cart-bg"
          )}
          href={`/dashboard/planner/day?${currentParams.toString()}`}
        >
          Day
        </Link>
      </TabsList>
    </Tabs>
  );
}

export default PlannerDayWeekNavbar;
