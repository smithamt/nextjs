"use client";
import NextOrPreviousButtons from "@/components/buttons/shift";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dayjs from "dayjs";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaCaretDown } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";

function EmployeeMonthViewHeader({
  title,
}: {
  title: "births" | "probations";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "0";
  const active = pathname.split("/")[4];
  return (
    <div className="w-full items-center justify-between flex p-2">
      <div className="flex items-center p-2">
        <div
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full center cursor-pointer hover:bg-black/5"
        >
          <IoArrowBackOutline size={20} />
        </div>
        <div className="hidden lg:inline text-lg font-semibold px-4 capitalize">
          {title}
        </div>
      </div>
      <p className="text-[20px] md:text-[40px] leading-10 font-bold flex text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500">
        {dayjs().add(Number(next), "month").format("MMMM")}
      </p>
      <div className="flex items-center space-x-2">
        <NextOrPreviousButtons />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className=" capitalize">
              <span className="pr-2">{active || "Month"}</span> <FaCaretDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mx-2">
            <DropdownMenuItem className="p-2" asChild>
              <Link href={"/dashboard/employees/probations/day"}>Day</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-2" asChild>
              <Link href={"/dashboard/employees/probations/week"}>Week</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-2" asChild>
              <Link href={"/dashboard/employees/probations/month"}>Month</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default EmployeeMonthViewHeader;
