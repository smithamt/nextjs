import ChooseData from "@/components/data/choose/page";
import SearchInput from "@/components/input/search";
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import RelationTitles from "./title";
import { TitleType } from "@/types";

function RelationsRootHeader({ state }: { state: TitleType }) {
  return (
    <div className="space-x-2 flex items-center justify-between p-2">
      <RelationTitles />
      <div className="flex items-center justify-end w-full space-x-2">
        <ChooseData state={state} title={"branches"} />
        <div className="min-w-[180px] h-full hidden xl:flex">
          <ChooseData state={state} title={"departments"} />
        </div>
        <div className="min-w-[180px] h-full hidden xl:flex">
          <ChooseData state={state} title={"positions"} />
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
                state={state}
                title={"branches"}
              />
            </div>
            <div className="w-full h-full xl:hidden">
              <ChooseData
                className="w-full"
                state={state}
                title={"departments"}
              />
            </div>
            <div className="w-full h-full xl:hidden">
              <ChooseData
                className="w-full"
                state={state}
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

export default RelationsRootHeader;

// import ChooseData from "@/components/data/choose/page";
// import SearchInput from "@/components/input/search";
// import RelationTitles from "./title";

// function RelationHeader() {
//   return (
//     <div className="p-2 flex items-center justify-between">
//       <RelationTitles />
//       <div className="flex items-center space-x-2">
//         <ChooseData state="relations" title={"branches"} />
//         <ChooseData state="relations" title={"departments"} />
//         <ChooseData state="relations" title={"positions"} />
//       </div>
//     </div>
//   );
// }

// export default RelationHeader;
