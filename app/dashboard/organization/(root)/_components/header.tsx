"use client";
import SearchInput from "@/components/input/search";
import { Button } from "@/components/ui/button";
import { organizationroutes } from "@/constants/routes/organization";
import { usePathname, useRouter } from "next/navigation";
import pluralize from "pluralize";

function OrganizationHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const title = pathname.split("/")[3];
  const route = organizationroutes.find((r) => r.name === title);

  return (
    <div className="py-4 px-2 flex justify-between items-center w-full h-20">
      <div>
        <p className="font-bold text-lg capitalize">{route?.name}</p>
        <p className="text-xs inactive-text">{route?.description}</p>
      </div>
      <div className="flex items-center space-x-2">
        <SearchInput />
        <Button
          onClick={() => router.push(`/dashboard/organization/${title}/create`)}
          className="capitalize"
        >
          Create {title === "leaves" ? "leave" : pluralize.singular(title)}
        </Button>
      </div>
    </div>
  );
}

export default OrganizationHeader;
