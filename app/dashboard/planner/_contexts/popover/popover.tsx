"use client";
import { usePopup } from "@/app/_context/dialog";
import { useHasUser } from "@/app/_context/hasuser.context";
import useClickOutside from "@/app/_hook/outside";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { actions, LIMIT_LEAVE_CREATING, roles } from "@/roles";
import { AttendanceType, EmployeeType, ShiftType } from "@/types";
import { PictureInPicture2, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from "react";
import CreateAttendanceArrived from "../../_components/arrived";
import LeavePopup from "../../_components/leaves";
import CreateOff from "./off";
import "./popover.css";
import PlannerPopoverSchedules from "./schedules/schedules";

export type DataType = {
  attendance: AttendanceType | undefined;
  shift: ShiftType | undefined;
  date: Date | undefined;
  employee: EmployeeType | undefined;
  updateAttendance: (data: AttendanceType) => void;
  updateShift: (data: ShiftType) => void;
};

type PopoverDataType = DataType & {
  open: boolean;
  sideOffset: number;
};

export interface PopoverContextType {
  data: PopoverDataType;
  setData: Dispatch<SetStateAction<PopoverDataType>>;
  closeDialog: () => void;
  handleContextMenu: (e: any) => void;
}

export const PopupContext = createContext<PopoverContextType | undefined>(
  undefined
);

const initialData = {
  open: false,
  sideOffset: 4,
  attendance: undefined,
  date: undefined,
  shift: undefined,
  employee: undefined,
  updateAttendance: () => {},
  updateShift: () => {},
};

export function PopoverProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PopoverDataType>(initialData);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const { user } = useHasUser();
  const foundRole = roles.find((r) => r.name === user.role);
  const closeRef = useRef(null);
  const closeDialog = () => setData(initialData);
  const popupWidth = 300;
  const popupHeight = 480;
  const padding = 40;

  const handleContextMenu = (event: {
    preventDefault: () => void;
    clientY: number;
    clientX: number;
  }) => {
    event.preventDefault();
    let top = event.clientY + 5;
    let left = event.clientX + 5;

    // Adjust if the popup goes beyond the right edge
    if (left + popupWidth + padding > window.innerWidth) {
      left = window.innerWidth - popupWidth - padding;
    }

    // Adjust if the popup goes beyond the bottom edge
    if (top + popupHeight + padding > window.innerHeight) {
      top = window.innerHeight - popupHeight - padding;
    }

    setPosition({ top, left });
  };

  const { setPopup } = usePopup();
  const { toast } = useToast();

  let href = data.employee
    ? "/dashboard/planner/attendance/" +
      data.employee?._id +
      "?date=" +
      (data.shift?.date || data.date)
    : "";

  if (data.attendance) href = href + "&attendance=" + data.attendance._id;
  if (data.shift) href = href + "&shift=" + data.shift._id;

  useClickOutside(closeRef, closeDialog);

  return (
    <PopupContext.Provider
      value={{ data, setData, closeDialog, handleContextMenu }}
    >
      {children}
      <DropdownMenu
        open={data.open}
        onOpenChange={(open) => setData((prev) => ({ ...prev, open }))}
      >
        <DropdownMenuContent
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            width: popupWidth,
            maxHeight: popupHeight,
          }}
          className="w-56"
        >
          <div className="flex items-center p-2">
            <Image
              width={30}
              height={30}
              className="rounded-full"
              src={
                data.employee?.profile?.image
                  ? `/api/images/${data.employee.profile?.image}/100/100`
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              }
              alt="profile"
            />
            <Label className="px-2">{data.employee?.name}</Label>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild className="p-2">
            <Link onClick={() => setData(initialData)} href={href.toString()}>
              <User className="mr-2 h-4 w-4" />
              <span>Detail</span>
              <DropdownMenuShortcut>⇧⌘O</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuGroup>
            <CreateOff status="Off" data={data} />
            <CreateOff status="Morning Half Off" data={data} />
            <CreateOff status="Evening Half Off" data={data} />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <PlannerPopoverSchedules data={data} />
          {foundRole?.attendances?.includes(actions.CREATE) && (
            <DropdownMenuItem
              onClick={() => {
                if (!data.employee) return;
                setPopup({
                  children: (
                    <CreateAttendanceArrived
                      employee={data.employee}
                      attendance={data.attendance}
                      shift={data.shift}
                      updateData={data.updateAttendance}
                    />
                  ),
                  title: "Test Dialog",
                });
              }}
              className="p-2"
            >
              <PictureInPicture2 className="mr-2 h-4 w-4" />
              <span>Attendance</span>
              <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}{" "}
          {!foundRole?.attendances?.includes(LIMIT_LEAVE_CREATING) && (
            <DropdownMenuItem
              onClick={() => {
                if (!data.employee) return;
                setPopup({
                  children: (
                    <LeavePopup
                      alreadyAtt={data.attendance?._id}
                      date={data.date || new Date()}
                      attendance={data.attendance}
                      employee={data.employee}
                      updateData={data.updateAttendance}
                    />
                  ),
                  title: "Adding Leave Attendance",
                });
              }}
              className="hover rounded-sm w-full p-2"
            >
              <PictureInPicture2 className="mr-2 h-4 w-4" />
              <span>Leave</span>
              <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
          <div
            onClick={() => {
              toast({
                title: "Scheduled: Catch up",
                description: "Friday, February 10, 2023 at 5:57 PM",
              });
            }}
            className="hover py-2 pl-8 rounded-sm w-full"
          >
            Name Window...
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </PopupContext.Provider>
  );
}

export function usePopover() {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
