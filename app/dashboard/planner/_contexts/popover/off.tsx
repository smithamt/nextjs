import { usePopup } from "@/app/_context/dialog";
import { useHasUser } from "@/app/_context/hasuser.context";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { AttendanceType, ShiftType } from "@/types";
import axios from "axios";
import { Calendar, CheckCircle } from "lucide-react";
import { useState } from "react";
import { DataType } from "./popover";

function CreateOff({
  data,
  status,
}: {
  data: DataType;
  status: "Off" | "Morning Half Off" | "Evening Half Off";
}) {
  const [loading, setLoading] = useState(false);
  const { closeDialog } = usePopup();
  const { user } = useHasUser();

  const isOff = data?.shift?.status === status;
  const buttonText = isOff ? `Remove Day ${status}` : `Create ${status}`;

  const createOff = async () => {
    if (!data.employee || !data.date) return;

    const newShift = data.shift
      ? {
          ...data.shift,
          status: isOff ? `Removed Day ${status}` : status,
          ref: `Create day ${status} from planner by ${user.name}`,
        }
      : {
          date: data.date,
          employee: data.employee._id,
          new: true,
          status: isOff ? `Removed Day ${status}` : status,
          ref: `Create day ${status} from planner by ${user.name}`,
        };

    data.updateShift(newShift as ShiftType);
    //@ts-ignore
    data.updateAttendance(newShift as AttendanceType);

    try {
      setLoading(true);
      await axios.post("/api/shifts", newShift);
      closeDialog();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <DropdownMenuItem
      disabled={loading}
      className="p-2"
      onClick={() => createOff()}
    >
      <div
        className="mr-2"
        style={{ position: "relative", display: "inline-block" }}
      >
        <Calendar size={16} />
        <CheckCircle
          size={4}
          color="green"
          style={{ position: "absolute", top: 0, right: 0 }}
        />
      </div>
      <span>{loading ? "Creating..." : buttonText}</span>
      <DropdownMenuShortcut>⇧⌘O</DropdownMenuShortcut>
    </DropdownMenuItem>
  );
}

export default CreateOff;
