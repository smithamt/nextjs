"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { FC } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface NextPreviousEmployeeProps {
  size: number;
  className?: string;
}

const NextPreviousEmployee: FC<NextPreviousEmployeeProps> = ({
  size = 10,
  className,
}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const empNext = Number(searchParams.get("page") || 1);

  const handler = (shift: number) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("page", shift.toString());
    return `${pathname}?${currentParams.toString()}`;
  };

  return (
    <div
      className={cn(
        "shadow-sm cart-bg flex rounded-[4px] h-[36px] cursor-pointer items-center justify-between min-w-44",
        className
      )}
    >
      <Link
        href={handler(empNext < 2 ? empNext : empNext - 1)}
        className="flex-1 w-[50px] h-full center hover"
      >
        <IoIosArrowBack />
      </Link>
      <Link
        href={handler(1)}
        className="px-4 rounded-none center h-full border-0 hover center"
      >
        Employee
      </Link>
      <Link
        href={handler(empNext + 1)}
        className="flex-1 w-[50px] h-full center hover"
      >
        <IoIosArrowForward />
      </Link>
    </div>
  );
};

export default NextPreviousEmployee;
