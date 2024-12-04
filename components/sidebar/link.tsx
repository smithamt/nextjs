"use client";
import { useHasUser } from "@/app/_context/hasuser.context";
import { cn } from "@/lib/utils";
import { RouteType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function SidebarLink({
  route,
  expanded = false,
}: {
  route: RouteType;
  expanded?: boolean;
}) {
  const [notifications, setNotifications] = useState(
    route.noti ? (route.noti <= 9 ? route.noti?.toString() : "+9") : ""
  );

  const { company } = useHasUser();

  const pathname = usePathname();
  const active = pathname.includes(route.path);

  const src = company.profile?.image
    ? `/api/images/${company.profile.image}/50/50`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <Link
      onClick={() => setNotifications("")}
      className={cn(
        "capitalize flex items-center py-2 transition-all duration-100 ease-in-out rounded-[4px] relative",
        active ? "bg-[#293943] text-white" : "hover",
        expanded ? "w-46" : "xl:w-46"
      )}
      href={route.realpath || route.path}
    >
      {notifications && (
        <span className="w-4 h-4 absolute right-1 top-1 bg-red-500 text-[10px] text-white rounded-full center">
          {/* @ts-ignore */}
          {notifications}
        </span>
      )}
      <span className="center min-w-[45px]">
        {route.name === "organization" ? (
          <Image
            className="rounded-full"
            width={30}
            height={30}
            alt="@company"
            src={src}
          />
        ) : (
          route.icon
        )}
      </span>
      <span
        className={cn(
          "overflow-hidden whitespace-nowrap font-semibold tracking-normal transition-all px-2 duration-300 ease-in-out",
          expanded ? "w-32" : "w-0 opacity-0 xl:opacity-100 xl:w-32"
        )}
      >
        {route.name
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, route.name[0]?.toUpperCase())}
      </span>
    </Link>
  );
}

export default SidebarLink;
