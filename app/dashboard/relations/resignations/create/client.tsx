"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/constants/app/axios";
import { EmployeeType, ResignationType } from "@/types";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";

const CreateResignationRequestClient = ({
  employee: e,
  edit,
}: {
  employee: string;
  edit: string;
}) => {
  const employee = JSON.parse(e) as EmployeeType;
  const router = useRouter();
  const [form, setForm] = useState<ResignationType>({
    //@ts-ignore
    employee: employee._id,
    resignationDate: new Date(),
    reason: "",
    why: [],
    isEmergency: false,
    forwardingAddress: "",
    status: "pending",
    edit,
  });

  const { toast } = useToast();
  const setState = (name: string, value: any) => {
    setForm((prev) => ({ ...prev, [name]: value }));
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

    try {
      await axios.post("/api/resignations", combinedFormData);
    } catch (error: any) {
      toast({
        title: "Error found",
        description: error.response?.data.error || error.message,
      });
    }
  };

  return (
    <form className="w-full h-[calc(100dvh-70px)]" onSubmit={handleSubmit}>
      <div className="cart-bg border-t w-full shadow-sm p-2">
        <div className="max-w-[1200px] px-2 mx-auto flex items-center justify-between">
          <Button
            variant={"outline"}
            type="reset"
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full hover center p-0"
          >
            <IoMdArrowRoundBack size={18} />
          </Button>
          <Button type="submit" variant={"destructive"} className="mx-4">
            Send Request
          </Button>
        </div>
      </div>
      <div className="w-full h-full p-4 overflow-y-auto">
        <div className="max-w-[800px] mx-auto rounded-lg min-h-full cart-bg w-full p-2">
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
          <div className="h-[1px] w-full nav-bg my-1" />
          <div className="h-[calc(100%-50px)]">
            <div className="flex items-center space-x-2">
              <Label htmlFor="isEmergency">Is emergency?</Label>
              <Switch
                id="isEmergency"
                checked={form.isEmergency}
                onCheckedChange={(checked) => {
                  checked
                    ? setState("isEmergency", true)
                    : setState("isEmergency", false);
                }}
              />
            </div>
            <Textarea
              placeholder="Enter reason"
              value={form.reason}
              className="my-2"
              onChange={(e) => setState("reason", e.target.value)}
            />
            <Label>Why are you filing for a resignation?</Label>
            <div className="mt-2">
              {[
                "Salary",
                "Moving to a new location",
                "Not happy with the job",
                "Will focus on studies",
                "Better opportunity",
                "Personal reasons",
                "Retirment",
              ].map((i, k) => {
                return (
                  <div key={k} className="p-1 flex items-center mb-2">
                    <Checkbox
                      id={i}
                      checked={form.why.includes(i)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? setState("why", [...form.why, i])
                          : setState(
                              "why",
                              form.why.filter((value) => value !== i)
                            );
                      }}
                    />
                    <label
                      htmlFor={i}
                      className="px-4 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {i}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateResignationRequestClient;
