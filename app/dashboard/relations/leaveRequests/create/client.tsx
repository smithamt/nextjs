"use client";
import { useSocket } from "@/app/_context/socket.context";
import { SelectDemo } from "@/components/app/select";
import { DatePickerDemo } from "@/components/others/DatePicker";
import DateRangeComponent from "@/components/others/DateRange";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/constants/app/axios";
import { getDaysBetweenDates, initialLeaveData } from "@/lib/utils";
import {
  EmployeeType,
  HolidayType,
  LeaveRequestType,
  LeaveType,
  StatusType,
} from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { ChevronLeft, Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { DateRange } from "react-day-picker";

type LeaveRequestFormType = {
  employee: string;
  leaves: any[];
  reason: string;
  address: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyContactRelationship: string;
  status: StatusType;
  edit: string;
};

const CreateLeaveRequestClient = ({
  employee: e,
  holidays: h,
  leaves: l,
  initialForm: i,
}: {
  employee: string;
  holidays: string;
  leaves: string;
  initialForm: string;
}) => {
  const [loading, setLoading] = useState(false);
  const employee = JSON.parse(e) as EmployeeType;
  const holidays = JSON.parse(h || "[]") as HolidayType[];
  const leaves = JSON.parse(l || "[]") as LeaveType[];
  const initialForm = JSON.parse(i) as LeaveRequestFormType;
  const [form, setForm] = React.useState<LeaveRequestFormType>(initialForm);

  const queryClient = useQueryClient();
  const router = useRouter();
  const socket = useSocket();
  const { toast } = useToast();

  const handleInputChange = (e: any) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formDataFromEvent = new FormData(event.currentTarget);
    const formDataObject: { [key: string]: any } = {};

    formDataFromEvent.forEach((value, key) => {
      formDataObject[key] = value;
    });

    const combinedFormData = {
      ...form,
      ...formDataObject,
    };

    socket.emit("notification", {
      ...combinedFormData,
      to: "656895b29d18060ce24439eb",
    });

    try {
      setLoading(true);
      const response = await axios.post("/api/leaveRequests", combinedFormData);
      setLoading(false);

      const queryCache = queryClient.getQueryCache();
      const queryKeys = queryCache.getAll().map((query) => query.queryKey);
      const queryKey = queryKeys.find(
        (q) => q.includes("leaveRequests") && !q.includes("count")
      );
      const existData = queryClient.getQueryData(queryKey || []) as {
        pages: LeaveRequestType[][];
        pageParams: number[];
      };
      if (existData && queryKey) {
        queryClient.setQueryData(queryKey, {
          ...existData,
          pages: existData.pages.map((page: any[], index) => {
            return index === 0 ? [response.data, ...page] : page;
          }),
        });
      }

      router.back();
    } catch (error: any) {
      toast({
        title: "Error found",
        description: error.response?.data?.error || error.message,
      });
      setLoading(false);
    }
  };

  return (
    <form className="w-full h-[calc(100dvh-50px)]" onSubmit={handleSubmit}>
      <div className="cart-bg border-t w-full shadow-sm p-2">
        <div className="max-w-[1200px] px-2 mx-auto flex items-center justify-between">
          <Button
            variant={"outline"}
            type="reset"
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full hover center p-0"
          >
            <ChevronLeft className="" size={18} />
          </Button>
          <p className="font-bold text-lg">
            {form.edit ? "Editing" : "Creating"} Leave Request
          </p>
          <Button disabled={loading} type="submit" className="mx-4">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Send Request"
            )}
          </Button>
        </div>
      </div>
      <div className="w-full h-full p-4 overflow-y-auto">
        <div className="max-w-[800px] mx-auto rounded-lg min-h-full shadow-m cart-bg w-full p-2">
          <div className="flex">
            <div className="flex-1">
              <div className="flex items-center p-2">
                <p className="w-36">Full Name </p> : {employee.name}
              </div>
              <div className="flex items-center p-2">
                <p className="w-36">Position </p> : {employee.position?.name}
              </div>
              <div className="flex items-center p-2">
                <p className="w-36">Joining Date </p> :
                {dayjs(employee.joinedDate).format("YYYY-MM-DD")}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center p-2">
                <p className="w-36">Employee No </p> : {employee.employeeId}
              </div>
              <div className="flex items-center p-2">
                <p className="w-36">Department </p> :{" "}
                {employee.department?.name}
              </div>
              <div className="flex items-center p-2">
                <p className="w-36">Request Date </p> :{" "}
                {dayjs().format("YYYY-MM-DD")}
              </div>
            </div>
          </div>
          <div className="h-[1px] w-full nav-bg my-1" />
          <div>
            {form.leaves.map((l, k) => (
              <div key={k} className="mt-2 border-b pb-4">
                {k > 0 && (
                  <Button
                    variant={"destructive"}
                    className="ml-auto block"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        leaves: prev.leaves.filter((a) => a.index !== l.index),
                      }));
                    }}
                  >
                    <p className="flex">
                      Remove <Trash2 className="w-4 ml-2" />
                      {l.index}
                    </p>
                  </Button>
                )}
                <LeaveRequestForm
                  disableDates={(date) => {
                    let state = false;
                    const days = form.leaves
                      .filter((a) => a.index !== l.index)
                      .map((l) => {
                        const days =
                          l.from && l.to
                            ? getDaysBetweenDates(l.from, l.to)
                            : [];
                        return days;
                      });

                    state = days
                      .flat()
                      .some(
                        (d) =>
                          dayjs(d).format("YYYY-MM-DD") ===
                          dayjs(date).format("YYYY-MM-DD")
                      );

                    return state;
                  }}
                  value={{
                    _id: l._id,
                    from: l.from ? new Date(l.from) : undefined,
                    to: l.to ? new Date(l.to) : undefined,
                    isPublicHoliday: l.isPublicHoliday,
                    attendedFiles: l.attendedFiles,
                  }}
                  setState={(data: any) => {
                    console.log("data", data);
                    setForm((prev) => ({
                      ...prev,
                      leaves: prev.leaves.map((i) => {
                        const isHoliday = data?._id
                          ? holidays.some((h) => h._id === data._id)
                          : undefined;
                        return i.index === l.index
                          ? {
                              ...i,
                              ...data,
                              isPublicHoliday:
                                isHoliday === undefined
                                  ? i.isPublicHoliday
                                  : isHoliday,
                            }
                          : i;
                      }),
                    }));
                  }}
                  data={[
                    ...leaves.map((l) => ({ name: l.name, _id: l._id })),
                    ...holidays.map((h) => ({
                      name: `${h.name} ( Public Holiday )`,
                      _id: h._id,
                    })),
                  ]}
                />
              </div>
            ))}
            {form.leaves[form.leaves.length - 1]?._id &&
              form.leaves[form.leaves.length - 1]?.from &&
              form.leaves[form.leaves.length - 1]?.to && (
                <Button
                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,
                      leaves: [
                        ...prev.leaves,
                        initialLeaveData(
                          prev.leaves[prev.leaves.length - 1].index + 1
                        ),
                      ],
                    }));
                  }}
                  variant="outline"
                  className="mt-2 ml-auto block"
                >
                  <p className="flex items-center h-full">
                    <Plus className="w-4 mr-2" /> Add Next Leave Type
                  </p>
                </Button>
              )}
          </div>
          <Label>Reason</Label>
          <Textarea
            name="reason"
            value={form.reason}
            onChange={handleInputChange}
            placeholder="Enter a reason"
          />
          <Label>Address</Label>
          <Textarea
            name="address"
            onChange={handleInputChange}
            value={form.address}
            placeholder="Enter your current address"
          />
          <p className="text-center font-semibold py-4 text-lg">
            Emergency Contact Information
          </p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <div>
              <Label>Name</Label>
              <Input
                value={form.emergencyContactName}
                name="emergencyContactName"
                onChange={handleInputChange}
                placeholder="Enter emergency contact name"
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                value={form.emergencyContactNumber}
                name="emergencyContactNumber"
                onChange={handleInputChange}
                placeholder="Enter emergency contact number"
              />
            </div>
            <div>
              <Label>Relationship</Label>
              <Input
                value={form.emergencyContactRelationship}
                name="emergencyContactRelationship"
                onChange={handleInputChange}
                placeholder="Enter emergency contact relationship"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateLeaveRequestClient;

interface ValueType extends DateRange {
  _id: string;
  isPublicHoliday: boolean;
  attendedFiles: string[];
}

const LeaveRequestForm = ({
  data,
  value,
  setState,
  disableDates,
}: {
  data: any;
  value: ValueType;
  setState: (data: any) => void;
  disableDates: (date: Date) => boolean;
}) => {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <div className="">
          <Label>Leave Type</Label>
          <div className="h-2"></div>
          <SelectDemo
            value={value._id}
            setData={(value) => {
              console.log("value", value);
              setState({ _id: value });
            }}
            data={data}
            title={"Leave & Holiday"}
            placeholder={"Choose Leave Type"}
          />
        </div>
        <div className="">
          <Label>Date Range</Label>
          <div className="h-2"></div>
          {value.isPublicHoliday ? (
            <DatePickerDemo
              disableDates={disableDates}
              date={value.from}
              setState={setState}
            />
          ) : (
            <DateRangeComponent
              date={{ from: value.from, to: value.to }}
              onSelectDate={(value) =>
                setState({ from: value?.from, to: value?.to })
              }
              disableDates={disableDates}
              setDate={setDate}
            />
          )}
        </div>
      </div>
      {/* <Media
        images={Array.isArray(value.attendedFiles) ? value.attendedFiles : []}
        setImages={(data) => setState({ attendedFiles: data })}
      /> */}
    </div>
  );
};
