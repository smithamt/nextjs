import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "@/constants/app/axios";
import { ScheduleType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, UserPlus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DataType } from "../popover";
import SchedulePopupDetail from "./schedule";

function PlannerPopoverSchedules({ data }: { data: DataType }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const { data: schedules = [], isLoading } = useQuery({
    queryKey: ["employee-schedules", data.employee?.department],
    queryFn: async () => {
      const response = await axios.get(
        `/api/schedules/department/${data.employee?.department}`
      );
      return response.data as ScheduleType[];
    },
  });

  const filterSchedules = query
    ? schedules.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      )
    : schedules;

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub open={open} onOpenChange={setOpen}>
        <DropdownMenuSubTrigger>
          <UserPlus className="mr-2 h-4 w-4" />
          <span>Schedules</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent
            onFocus={(e) => e.stopPropagation()}
            className="w-[200px]"
          >
            {schedules.length > 10 && (
              <Input
                onFocus={(e) => e.stopPropagation()}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search with name"
              />
            )}
            <div className="max-h-[400px] overflow-y-auto w-full">
              {isLoading && (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              )}
              {filterSchedules.map((schedule, index) => {
                return (
                  <SchedulePopupDetail
                    key={index}
                    schedule={schedule}
                    data={data}
                  />
                );
              })}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                className="flex p-2"
                href={"/dashboard/organization/schedules/create?from=planner"}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                <span>Create Schedule...</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
}

export default PlannerPopoverSchedules;
