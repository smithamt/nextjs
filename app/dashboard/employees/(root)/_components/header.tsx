import ChooseData from "@/components/data/choose/page";
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import EmployeeListCartNavigation from "./listcart";
import BackArrowWithTitle from "@/components/app/arrow";
import SearchInput from "@/components/input/search";

function EmployeeRootHeader() {
  return (
    <div className="space-x-2 flex items-center justify-between p-2">
      <div className="flex items-center space-x-2">
        <BackArrowWithTitle to="/dashboard/employees">
          Employees
        </BackArrowWithTitle>
        <ChooseData state="employees" title={"branches"} />
        <div className="min-w-[180px] h-full hidden xl:flex">
          <ChooseData state="employees" title={"departments"} />
        </div>
        <div className="min-w-[180px] h-full hidden xl:flex">
          <ChooseData state="employees" title={"positions"} />{" "}
        </div>
        <Popover>
          <PopoverTrigger
            className={cn(
              buttonVariants({ variant: "outline", className: "2xl:hidden" })
            )}
          >
            ...
          </PopoverTrigger>
          <PopoverContent className="space-y-1 p-1">
            <p className="p-2 font-bold">Filter</p>
            <div className="w-full h-full xl:hidden">
              <ChooseData
                className="w-full"
                state="employees"
                title={"branches"}
              />
            </div>
            <div className="w-full h-full xl:hidden">
              <ChooseData
                className="w-full"
                state="employees"
                title={"departments"}
              />
            </div>
            <div className="w-full h-full xl:hidden">
              <ChooseData
                className="w-full"
                state="employees"
                title={"positions"}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <EmployeeListCartNavigation />
      <SearchInput />
    </div>
  );
}

export default EmployeeRootHeader;
