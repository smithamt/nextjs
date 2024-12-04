"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const NextOrPreviousButtons = ({ className }: { className?: string }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const next = Number(searchParams.get("next") || "0");

  const handler = (shift: number) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("next", shift.toString());
    return `${pathname}?${currentParams.toString()}`;
  };

  return (
    <div className={cn("flex select-none h-[38px] min-w-44", className)}>
      <Link
        href={handler(next - 1)}
        className="flex items-center px-4 rounded-l-sm ml-2 hover text-sm py-1 hover"
      >
        <IoIosArrowBack size={16} />
      </Link>
      <Link
        href={handler(0)}
        className="flex items-center px-4 ml-2 hover text-sm py-1 font-semibold"
      >
        {next ? "Today" : "Date"}
      </Link>
      <Link
        href={handler(next + 1)}
        className="flex items-center px-4 rounded-r-sm ml-2 hover text-sm py-1 hover"
      >
        <IoIosArrowForward size={16} />
      </Link>
    </div>
  );
};

export default NextOrPreviousButtons;
