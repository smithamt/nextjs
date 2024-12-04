import { HoverCard, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { EmployeeType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import EmployeeProfilePopup from "./popup";

function EmployeeProfile({
  employee,
  to = "",
  ago,
  read = false,
  description,
}: {
  employee: EmployeeType;
  to: string;
  ago?: string;
  read?: boolean;
  description?: string;
}) {
  const src = employee.profile?.image
    ? `/api/images/${employee.profile.image}/100/100`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <div className="flex w-full">
      <Image
        src={src}
        width={50}
        height={50}
        className={cn(
          "min-h-[50px] shadow-sm rounded-full p-0.5 max-h-[50px]",
          employee?.state && employee.state !== "normal"
            ? "bg-red-500"
            : "bg-gray-400",
          employee?.position?.isHeadOfDepartment && "bg-blue-500"
        )}
        alt="profile"
      />

      <HoverCard>
        <HoverCardTrigger asChild>
          <Link href={to} className="px-2">
            <p>
              <span className="font-semibold hover:underline cursor-pointer">
                {employee?.nickname || employee?.name}{" "}
              </span>

              {description && (
                <span className="font-[400] text-[.8rem]">{description}</span>
              )}
            </p>
            <p className="text-xs">{employee.employeeId}</p>
            {employee?.isActive?.isActive && (
              <div className="w-3 h-3 rounded-full cart-bg right-0.5 bottom-0.5 p-[1px]">
                <div className="w-full h-full rounded-full bg-green-500"></div>
              </div>
            )}
            {ago && (
              <span
                className={cn(
                  "text-xs",
                  read ? "inactive-text" : "text-[#0966FF]"
                )}
              >
                {ago}
              </span>
            )}
          </Link>
        </HoverCardTrigger>
        <EmployeeProfilePopup src={src} employee={employee} />
      </HoverCard>
    </div>
  );
}

export default EmployeeProfile;
