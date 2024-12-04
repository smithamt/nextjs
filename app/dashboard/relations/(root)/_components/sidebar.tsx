"use client";
import SidebarLink from "@/components/sidebar/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RouteType } from "@/types";
import { ChevronsLeft } from "lucide-react";
import { useState } from "react";

function RelationSidebar({
  requestroutes,
  relationroutes,
}: {
  requestroutes: RouteType[];
  relationroutes: RouteType[];
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex flex-col space-y-1 p-2 h-full relative">
      <p className="text-xs font-bold">Requests</p>
      {requestroutes.map((route, index) => (
        <SidebarLink expanded={expanded} route={route} key={index} />
      ))}
      <p className="text-xs font-bold">Employees</p>
      {relationroutes.map((route, index) => (
        <SidebarLink expanded={expanded} route={route} key={index} />
      ))}
      <Button
        onClick={() => setExpanded(!expanded)}
        variant={"ghost"}
        className="w-[36px] p-1 hover mt-auto absolute bottom-2 right-2"
      >
        <ChevronsLeft
          className={cn(
            "w-6 transition-all duration-300",
            expanded && "transform rotate-180"
          )}
        />
      </Button>
    </div>
  );
}

export default RelationSidebar;
