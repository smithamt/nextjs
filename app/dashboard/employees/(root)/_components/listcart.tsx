"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlignJustify, Grid2x2 } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function EmployeeListCartNavigation() {
  const pathname = usePathname();
  const activecart = pathname.includes("/cart");
  const activelist = pathname.includes("/list");

  return (
    <div className="flex items-center">
      <Link
        className={cn(
          buttonVariants({
            variant: "outline",
            className: "border rounded-l-lg",
          }),
          activecart && "cart-bg"
        )}
        href={"/dashboard/employees/cart"}
      >
        <Grid2x2 className="w-4" />
      </Link>
      <Link
        className={cn(
          buttonVariants({
            variant: "outline",
            className: "border rounded-r-lg",
          }),
          activelist && "cart-bg"
        )}
        href={"/dashboard/employees/list"}
      >
        <AlignJustify className="w-4" />
      </Link>
    </div>
  );
}

export default EmployeeListCartNavigation;
