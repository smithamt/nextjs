"use client";
import { cn } from "@/lib/utils";
import { HelpCircle, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function SidebarSettingRoutes() {
  const pathname = usePathname();
  return (
    <div className="flex flex-col space-y-1">
      <Link
        className={cn(
          "capitalize flex items-center py-2 px-4 transition-all duration-100 ease-in-out rounded-md",
          pathname.includes("/dashboard/setting")
            ? "bg-[#293943] text-white"
            : "hover"
        )}
        href={"/dashboard/setting"}
      >
        <Settings className="w-4" />
        <span className="px-4">Setting</span>
      </Link>
      <a
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "capitalize flex items-center py-2 px-4 transition-all duration-100 ease-in-out rounded-md"
        )}
        href={"/help"}
      >
        <HelpCircle className="w-4" />
        <span className="px-4">Help</span>
      </a>
    </div>
  );
}

export default SidebarSettingRoutes;
