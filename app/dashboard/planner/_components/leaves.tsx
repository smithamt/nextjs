import { usePopup } from "@/app/_context/dialog";
import { Footer } from "@/app/_context/footer";
import { useHasUser } from "@/app/_context/hasuser.context";
import SpinLoading from "@/components/loadings/spinloading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/constants/app/axios";
import { cn } from "@/lib/utils";
import { AttendanceType, EmployeeType, HolidayType, LeaveType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { FaSortDown, FaSortUp } from "react-icons/fa";

interface LeavePopupProps {
  alreadyAtt: string | undefined | null;
  date: Date;
  attendance: AttendanceType | undefined;
  employee: EmployeeType;
  updateData: (data: AttendanceType) => void;
}

export type EmployeeLeaveDaysProps = {
  loading: boolean;
  attendances: AttendanceType[];
};

const LeavePopup: FC<LeavePopupProps> = ({
  alreadyAtt,
  employee,
  date,
  attendance,
  updateData,
}) => {
  const [selectedLeave, setSelectedLeave] = useState<
    LeaveType | HolidayType | null
  >(null);
  const [chooseLeave, setChooseLeave] = useState(false);
  const [reason, setReason] = useState("");

  const { toast } = useToast();
  const { user } = useHasUser();
  const { closeDialog } = usePopup();

  const updateLeave = async (data: any) => {
    const udata = {
      ...attendance,
      ...data,
      notif: "from popup",
      employee: employee._id,
      date: new Date(date).toISOString(),
      remarkBy: user._id,
      remark: reason
        ? reason
        : `Created ${selectedLeave ? selectedLeave.name : "Leave"} By ${
            user?.name
          }`,
      ref: window.location.href,
      _id: alreadyAtt,
    };

    updateData(udata as unknown as AttendanceType);
    try {
      // create post because limit edit attendance in put request
      const response = await axios.post(`/api/attendances`, udata);
      response.data;
      closeDialog();
    } catch (error: any) {
      toast({
        title: "Error found",
        description: error.response?.data?.error || error.message,
      });
    }
  };

  return (
    <>
      <div className="h-[90%] p-2">
        <p className="text-xs font-semibold pt-2 px-2">Leave Type</p>
        <ToSelectedLeave
          setChooseLeave={setChooseLeave}
          error={chooseLeave}
          employee={employee}
          selectedLeave={selectedLeave}
          setSelectedLeave={setSelectedLeave}
        />
        <p className="text-xs font-semibold pt-2 px-2">Remark</p>
        <Textarea
          onChange={(e) => setReason(e.target.value)}
          className="on border w-full rounded-lg h-[100px] p-2"
          placeholder={`Enter Remark for this leave default text is "Created ${
            selectedLeave ? selectedLeave.name : "Leave"
          } By ${user?.name}"`}
        />
      </div>
      <Footer
        onConfirm={function (): void {
          if (!selectedLeave) {
            return setChooseLeave(true);
          }
          updateLeave({
            status: selectedLeave.name,
            leave: selectedLeave._id,
            //@ts-ignore
            isPublicHoliday: selectedLeave.isPublicHoliday,
          });
        }}
      />
    </>
  );
};

export default LeavePopup;

interface ToSelectedLeaveTypes {
  selectedLeave: LeaveType | HolidayType | null;
  setSelectedLeave: (leave: LeaveType | HolidayType | null) => void;
  employee: EmployeeType;
  error: boolean;
  setChooseLeave: (isLeave: boolean) => void;
}

const getLeaves = async (id: string) => {
  const response = await axios.get(`/api/leaves/already/${id}`);
  return response.data;
};

const queryFn = async (title: string, params: any) => {
  const response = await axios.get(`/api/${title}`, {
    params,
  });
  return response.data;
};

const ToSelectedLeave: FC<ToSelectedLeaveTypes> = ({
  setSelectedLeave,
  selectedLeave,
  employee,
  error,
  setChooseLeave,
}) => {
  const [open, setOpen] = useState(false);
  const { role } = useHasUser();

  const { data, isLoading } = useQuery({
    queryKey: ["employeeLeaves", employee._id],
    queryFn: () => getLeaves(employee._id),
  });

  const { data: holidays = [], isLoading: holidayLoading } = useQuery({
    retry: false,
    queryKey: ["valid-holidays", role, employee._id],
    queryFn: (): Promise<HolidayType[]> =>
      queryFn("holidays/valid", { employee: employee._id }),
  });

  const { data: leaves = [], isLoading: leaveLoading } = useQuery({
    retry: false,
    queryKey: ["valid-leaves", role, employee._id],
    queryFn: (): Promise<HolidayType[]> =>
      queryFn("leaves/valid", { employee: employee._id }),
  });

  return (
    <DropdownMenu onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div
          style={{
            color: selectedLeave?.color?.back,
            textShadow: `1px 1px 1px ${selectedLeave?.color?.text}`,
          }}
          className={`border ${
            error && "border-red-500"
          } hover h-[40px] px-4 rounded-lg flex items-center justify-between`}
          onClick={() => setOpen(!open)}
        >
          <p>{selectedLeave ? selectedLeave.name : "Choose Leave Type"}</p>
          {open ? <FaSortUp size={20} /> : <FaSortDown size={20} />}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="min-w-[400px] h-[450px] overflow-y-auto">
        {isLoading || holidayLoading || leaveLoading ? (
          <SpinLoading />
        ) : (
          <>
            <div className="px-2 py-2 flex items-center justify-between font-semibold text-xs space-x-2">
              <p className="min-w-[200px] px-2">Name</p>
              <p>Allow Days</p>
              <p>Available Days</p>
              <p>Already</p>
            </div>
            {[
              ...leaves,
              ...holidays.map((i) => ({ ...i, isPublicHoliday: true })),
            ].map((l, k) => {
              const thisEmpAtt = isLoading
                ? undefined
                : //@ts-ignore
                  data?.find((att: AttendanceType) => att.leave === l._id);
              return (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedLeave(l);
                    console.log("leave", l);
                    setChooseLeave(false);
                    setOpen(false);
                  }}
                  className="px-4 py-2 hover cursor-pointer flex items-center justify-between"
                  key={k}
                >
                  <p
                    style={{
                      color: l.color?.back,
                      textShadow: `1px 1px 1px ${l.color?.text}`,
                    }}
                    className="w-[200px] font-semibold"
                  >
                    {/* @ts-ignore */}
                    {l.name} <span className="text-xs">- {l.allowDays}</span>
                  </p>
                  <p className="w-10">{thisEmpAtt?.available?.toFixed(0)}</p>
                  <p className="w-10">{thisEmpAtt?.nowAvailable.toFixed(0)}</p>
                  <p
                    className={cn(
                      isLoading && "w-10 h-4 rounded-lg skeleton-loader"
                    )}
                  >
                    {!isLoading && thisEmpAtt?.taken}
                  </p>
                  {/* @ts-ignore */}
                  {l.isPublicHoliday && "(Public Holiday)"}
                </DropdownMenuItem>
              );
            })}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
