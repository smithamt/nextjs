"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

function TrashesNavigations() {
  const pathname = usePathname();
  return (
    <div className="p-2 space-x-1">
      {[
        {
          name: "leaveRequests",
          path: "/dashboard/trashes/leaveRequests",
        },
        {
          name: "warnings",
          path: "/dashboard/trashes/warnings",
        },
        {
          name: "positions",
          path: "/dashboard/trashes/positions",
        },
        {
          name: "departments",
          path: "/dashboard/trashes/departments",
        },
        {
          name: "attendances",
          path: "/dashboard/trashes/attendances",
        },
        {
          name: "employees",
          path: "/dashboard/trashes/employees",
        },
      ].map((i, k) => {
        const active = pathname.includes(i.path);
        return (
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "border-none text-[13px]",
              active ? "active-color active-color-hover" : "hover font-normal"
            )}
            href={i.path}
            key={k}
          >
            {i.name
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, i.name[0]?.toUpperCase())}
          </Link>
        );
      })}
    </div>
  );
}

export default TrashesNavigations;
