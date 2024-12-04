import ChooseData from "@/components/data/choose/page";
import ChooseEmployee from "@/components/data/employees/button";
import SearchInput from "@/components/input/search";
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { UserRound } from "lucide-react";
import Link from "next/link";
import { BsThreeDots } from "react-icons/bs";
import { MdFingerprint } from "react-icons/md";
import PlannerChildHeader from "./child.header";

function PlannerRootHeader() {
  return (
    <div className="p-2">
      <div className="flex items-center justify-between">
        <p className="text-[20px] md:text-[40px] leading-10 font-bold flex text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 py-2">
          {dayjs().format("MMMM YYYY")}
        </p>
        <div className="flex items-center gap-2">
          <ChooseEmployee title={'Draw Shift'} to={"/dashboard/planner/drawshift/"} />
          <Link
            href={"/dashboard/planner/fingerprints/users"}
            className="p-1 hover border rounded-sm h-[36px] w-[36px] center"
          >
            <UserRound size={22} />
          </Link>
          <Link
            href={"/dashboard/planner/fingerprints"}
            className="p-1 hover border rounded-sm h-[36px] w-[36px] center"
          >
            <MdFingerprint size={22} />
          </Link>
          <SearchInput />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex flex-1 items-center gap-2">
          <ChooseData state="planner" title={"branches"} />
          <ChooseData
            state="planner"
            title={"departments"}
            className="min-w-[180px] h-full hidden xl:flex"
          />
          <ChooseData
            state="planner"
            title={"positions"}
            className="min-w-[180px] h-full hidden xl:flex"
          />
          <Popover>
            <PopoverTrigger
              className={cn(
                buttonVariants({ variant: "outline", className: "xl:hidden" })
              )}
            >
              <BsThreeDots />
            </PopoverTrigger>
            <PopoverContent className="space-y-1 p-1">
              <p className="p-2 font-bold">Filter</p>
              <ChooseData
                className="w-full h-full xl:hidden"
                state="planner"
                title={"branches"}
              />
              <ChooseData
                className="w-full h-full xl:hidden"
                state="planner"
                title={"departments"}
              />
              <ChooseData
                className="w-full h-full xl:hidden"
                state="planner"
                title={"positions"}
              />
            </PopoverContent>
          </Popover>
        </div>
        <PlannerChildHeader />
      </div>
    </div>
  );
}

export default PlannerRootHeader;
