import ChooseData from "@/components/data/choose/page";
import SearchInput from "@/components/input/search";
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function SalaryRootHeader() {
  return (
    <div className="space-x-2 flex items-center justify-between p-2">
      <div className="flex items-center space-x-2">
        <ChooseData state="planner" title={"branches"} />
        <div className="min-w-[180px] h-full hidden xl:flex">
          <ChooseData state="planner" title={"departments"} />
        </div>
        <div className="min-w-[180px] h-full hidden xl:flex">
          <ChooseData state="planner" title={"positions"} />{" "}
        </div>
        <Popover>
          <PopoverTrigger
            className={cn(
              buttonVariants({ variant: "outline", className: "lg:hidden" })
            )}
          >
            ...
          </PopoverTrigger>
          <PopoverContent className="space-y-1 p-1">
            <p className="p-2 font-bold">Filter</p>
            <div className="w-full h-full xl:hidden">
              <ChooseData
                className="w-full"
                state="planner"
                title={"branches"}
              />
            </div>
            <div className="w-full h-full xl:hidden">
              <ChooseData
                className="w-full"
                state="planner"
                title={"departments"}
              />
            </div>
            <div className="w-full h-full xl:hidden">
              <ChooseData
                className="w-full"
                state="planner"
                title={"positions"}
              />
            </div>
          </PopoverContent>
        </Popover>
        <SearchInput />
      </div>
    </div>
  );
}

export default SalaryRootHeader;
