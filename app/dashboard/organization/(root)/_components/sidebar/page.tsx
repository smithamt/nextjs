"use client";
import SidebarLink from "@/components/sidebar/link";
import { Button } from "@/components/ui/button";
import { organizationroutes } from "@/constants/routes/organization";
import { roles } from "@/roles";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";

function OrganizationSidebar({ role }: { role: string }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex flex-col space-y-1 px-4 p-2 min-h-full relative border-b">
      {organizationroutes
        .filter((i) => {
          const foundRole = roles.find((r) => r.name === role);
          return foundRole && foundRole[i.name];
        })
        .map((route, index) => (
          <SidebarLink expanded={expanded} route={route} key={index} />
        ))}
      <Button
        onClick={() => setExpanded(!expanded)}
        variant={"ghost"}
        className="w-[36px] p-1 hover absolute bottom-2 right-2"
      >
        {expanded ? (
          <ChevronsLeft className="w-6" />
        ) : (
          <ChevronsRight className="w-6" />
        )}
      </Button>
    </div>
  );
}

export default OrganizationSidebar;
