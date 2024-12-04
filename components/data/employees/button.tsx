"use client";
import { useHasUser } from "@/app/_context/hasuser.context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "@/constants/app/axios";
import { cn } from "@/lib/utils";
import { EmployeeType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ReactNode, useState } from "react";
import { FaCaretDown } from "react-icons/fa";

function ChooseEmployee({ title, to }: { title: ReactNode; to: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { user } = useHasUser();
  const { data = [], isLoading } = useQuery({
    queryKey: ["choose-employees", user.role, query],
    queryFn: async () => {
      const response = await axios.get("/api/employees/choose", {
        params: { search: query },
      });
      return response.data as EmployeeType[];
    },
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>
          {title}
          <FaCaretDown
            className={cn(
              "w-4 ml-2 transition-all duration-300",
              open && "transform rotate-180"
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1 mx-2">
        <Input
          className=""
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search By Name"
        />
        <div className="max-h-[500px] overflow-y-auto flex flex-col gap-2 pt-2">
          {isLoading && (
            <>
              <Skeleton className="w-full min-h-8 rounded-sm" />
              <Skeleton className="w-full min-h-8 rounded-sm" />
              <Skeleton className="w-full min-h-8 rounded-sm" />
              <Skeleton className="w-full min-h-8 rounded-sm" />
            </>
          )}
          {data.map((employee, index) => {
            return (
              <Link
                className="p-2 hover rounded-sm"
                href={to + employee._id}
                onClick={() => setOpen(false)}
                key={index}
              >
                {employee.name}
              </Link>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ChooseEmployee;
