"use client";
import DatePicker from "@/components/form/date";
import EmployeeProfile from "@/components/profile/page";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/constants/app/axios";
import { EmployeeType, TerminationType } from "@/types";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import ChooseEmployee from "../../../../../components/data/employees/input";

const CreateTerminationClient = ({
  employee: e,
  edit,
}: {
  employee: string;
  edit: string;
}) => {
  const employee = JSON.parse(e) as EmployeeType;
  //@ts-ignore
  const [form, setForm] = useState<TerminationType>({
    terminationDate: new Date(),
    why: [],
    employees: [],
    reason: "",
  });
  const router = useRouter();
  const { toast } = useToast();

  const changeForm = (name: string, value: any | any[]) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
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
            Terminate
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
          <div className="mt-4 w-full pb-4">
            <div className="mt-4">
              <div className="px-4">
                <Label>Termination Date</Label>
                <DatePicker
                  setDate={(date) => changeForm("terminationDate", date)}
                  date={form.terminationDate}
                />
                {edit ? (
                  <div className="mt-2">
                    <EmployeeProfile
                      employee={form.employee}
                      ago="Editing"
                      to={""}
                    />
                  </div>
                ) : (
                  <>
                    <p className="font-semibold my-2">Termination Employees</p>
                    <ChooseEmployee
                      params={{
                        _id: { $nin: form.employees?.map((i) => i._id) },
                      }}
                      setEmployees={(data) => changeForm("employees", data)}
                    />
                  </>
                )}
                <Textarea
                  placeholder="Enter reason"
                  value={form.reason}
                  className="my-2"
                  onChange={(e) => changeForm("reason", e.target.value)}
                />
                <Label>Why?</Label>
                <div className="mt-2">
                  {[
                    "Incompetence: Lack of productivity or poor quality of work.",
                    "Insubordination: Violation of company rules, dishonesty, or refusal to follow instructions.",
                    "Attendance Issues: Frequent Absent (or) Consecutive absenteeism  (or) Chronic illness.",
                    "Theft or Criminal Behavior: Including revealing trade secrets.",
                    "Sexual Harassment and Discrimination: Inappropriate behavior in the workplace.",
                    "Physical Violence or Threats: Aggressive actions towards other employees.",
                  ].map((i, k) => {
                    return (
                      <div key={k} className="p-1 flex items-center mb-2">
                        <Checkbox
                          id={i}
                          checked={form.why.includes(i)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? changeForm("why", [...form.why, i])
                              : changeForm(
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
        </div>
      </div>
    </form>
  );
};

export default CreateTerminationClient;
