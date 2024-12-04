import { CalendarDays } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ADMIN } from "@/roles";
import { EmployeeType } from "@/types";
import dayjs from "dayjs";
import Image from "next/image";

export function BirthdayEmployee({
  employee,
  size = 40,
  role,
}: {
  employee: EmployeeType;
  size: number;
  role: string;
}) {
  const src = employee?.profile?.image
    ? `/api/images/${employee.profile?.image}/150/150`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex p-1 rounded-md hover mb-1 w-full">
          <Image
            width={size}
            height={size}
            className="rounded-full"
            alt="profile"
            src={src}
          />
          <div
            style={{ width: `calc(100%-${size}px)` }}
            className="w-[calc(100%-40px)] flex justify-between"
          >
            <div
              className={`pl-2 text-xs ${size > 30 ? "" : "flex items-center justify-between"}`}
            >
              <p className="font-semibold">
                {employee.nickname ? employee.nickname : employee.name}
              </p>
              <p>{employee.employeeId}</p>
            </div>
            {ADMIN === role && size > 30 && (
              //@ts-ignore
              <p>{employee.departmentDetails.name}</p>
            )}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="right-0 bottom-full">
        <div className="flex justify-between space-x-4">
          <Image width={40} height={40} alt="profile" src={src} />
          <div className="space-y-1 w-[calc(100%-40px)]">
            <h4 className="text-sm font-semibold">@{employee.nickname}</h4>
            <p className="text-sm">
              Born in {dayjs(employee.dateOfBirth).format("DD MMM YYYY")}
            </p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined {dayjs(employee.joinedDate).format("DD MMMM YYYY")}
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
