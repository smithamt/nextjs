import { cn } from "@/lib/utils";
import { EmployeeType } from "@/types";
import dayjs from "dayjs";
import { CalendarDays, Earth, Mail, MapPin, Phone } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { Button } from "../ui/button";
import { HoverCardContent } from "../ui/hover-card";

function EmployeeProfilePopup({
  employee,
  src,
}: {
  employee: EmployeeType;
  src: string;
}) {
  return (
    <HoverCardContent side="left" className="w-80 max-h-80">
      <div className="flex flex-col justify-between h-full">
        <div className="flex justify-between">
          <Image
            width={80}
            height={80}
            className={cn(
              "rounded-full max-w-[80px] max-h-[80px]",
              "shadow-sm rounded-full p-0.5 relative",
              employee?.state && employee.state !== "normal"
                ? "bg-red-500"
                : "bg-gray-400",
              employee?.position?.isHeadOfDepartment && "bg-blue-500"
            )}
            alt="profile"
            src={src}
          />
          <div className="space-y-1 flex-1 px-4 mb-2">
            <h4 className="text-sm font-semibold">@{employee.nickname}</h4>
            <p className="text-sm">{employee.position?.name}</p>
            <p className="text-sm">{employee.department?.name}</p>
            <div className="flex items-center pt-2">
              <Phone className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                {employee.contactNo}
              </span>
            </div>
            <div className="flex items-center pt-2">
              <Mail className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                {employee.email}
              </span>
            </div>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Joined {dayjs(employee.joinedDate).format("MMMM YYYY")}
              </span>
            </div>
            <div className="flex items-center pt-2">
              <MapPin className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                {employee.currentAddress}
              </span>
            </div>
            <div className="flex items-center pt-2">
              <Earth className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                {moment(employee.isActive?.activeAt).fromNow()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant={"outline"} className="flex-1">
            Edit Profile
          </Button>
          <Button className="w-20">Message</Button>
        </div>
      </div>
    </HoverCardContent>
  );
}

export default EmployeeProfilePopup;
