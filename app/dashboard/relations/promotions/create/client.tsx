"use client";

import DatePicker from "@/components/form/date";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/constants/app/axios";
import { EmployeeType, PositionType } from "@/types";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const qualifications = [
  "Education",
  "Experience",
  "Teamwork",
  "Responsibility",
  "Job performance",
  "Leadership Skill",
  "Communication Skill",
  "Time Management",
];

type PromotionFormType = {
  employee: string;
  qualifications: string[];
  attendedFiles: string[];
  date: Date;
  newPosition: string;
  newSalary: number;
  managerComment: string;
  reviewedDate: Date;
  reviewedBy: string;
  edit: string;
};

function CreatePromotionRequestClient({
  employee: e,
  position: p,
  edit,
}: {
  employee: string;
  position: string;
  edit: string;
}) {
  const employee = JSON.parse(e) as EmployeeType;
  const positions = JSON.parse(p) as PositionType[];
  const [loading, setLoading] = useState(false);
  const id = employee._id;

  const [form, setForm] = useState<PromotionFormType>({
    employee: id,
    qualifications: [],
    attendedFiles: [],
    date: new Date(),
    newPosition: "",
    newSalary: 0,
    managerComment: "",
    reviewedDate: new Date(),
    reviewedBy: employee._id,
    edit,
  });

  const router = useRouter();
  const { toast } = useToast();

  const changeForm = (name: keyof typeof form, value: any | any[]) => {
    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onConfirm = async (data: any) => {
    if (!form.newPosition || employee.position._id === form.newPosition) {
      return;
    }

    if (form.qualifications.length === 0) {
      return;
    }

    try {
      await axios.post("/api/promotions", form);
    } catch (error: any) {
      toast({
        title: "Error found",
        description: error.response?.data.error || error.message,
      });
    }
  };

  const src = employee?.profile
    ? `/api/images/${employee.profile?.image}/350/350`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <div className="w-full h-screen overflow-y-auto">
      <div className="p-4 max-w-[1000px] mx-auto">
        <div className="flex justify-between p-2 text-center font-bold text-xl cart-bg mb-4 rounded-sm shadow">
          <p>Create Promotion Request</p>
          <div className="space-x-2">
            <Button
              disabled={loading}
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button disabled={loading} onClick={() => onConfirm(form)}>
              Send Request
            </Button>
          </div>
        </div>
        <div className="w-full">
          <div className="flex w-full">
            <div className="w-34 h-40 rounded-lg overflow-hidden shadow-sm">
              <Image width={180} height={220} src={src} alt={"profile"} />
            </div>
            <div className="px-2 grid w-full grid-cols-2 gap-1">
              <p title="Employee Name">{employee.name}</p>
              <p title="Employee ID">{employee.employeeId}</p>
              <p title="Position">{employee.position?.name}</p>
              <p title="Department">{employee.department?.name}</p>
              <p title="Joined Date">
                {dayjs(employee.joinedDate).format("YYYY-MM-DD")}
              </p>
              <p title="Current Salary">{employee.salary}</p>
              <p title="Request Date">{dayjs().format("YYYY-MM-DD")}</p>
              <p title="Request By">{employee.name}</p>
            </div>
          </div>
          <div className="mt-2 px-2">
            <div>
              <Label>New Position</Label>
              <div className="py-2">
                <Select
                  onValueChange={(value) => changeForm("newPosition", value)}
                  defaultValue={employee.position._id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a new position" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((position, index) => {
                      return (
                        <SelectItem key={index} value={position._id}>
                          {position.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="flex-1">
                <Label>New Salary</Label>
                <Input
                  type={"number"}
                  value={form.newSalary}
                  onChange={(e) =>
                    changeForm("newSalary", Number(e.target.value))
                  }
                  placeholder="Enter new salary"
                  className="Enter new Salary"
                />
              </div>
              <div className="flex-1">
                <Label>Effective Date</Label>
                <DatePicker
                  setDate={function (date: Date | undefined): void {
                    changeForm("date", date);
                  }}
                  date={form.date}
                />
              </div>
            </div>
            <div className="py-2">
              <Label>
                Has this employee met the requirements for proposed position as
                outlined in the job family qualifications?
              </Label>
              <div className="m-2 grid w-full grid-cols-2 gap-1">
                {qualifications.map((i, k) => {
                  return (
                    <div key={k} className="p-1 flex items-center mb-2">
                      <Checkbox
                        id={i}
                        checked={form.qualifications.includes(i)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? changeForm("qualifications", [
                                ...form.qualifications,
                                i,
                              ])
                            : changeForm(
                                "qualifications",
                                form.qualifications.filter(
                                  (value: string) => value !== i
                                )
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
              <Textarea
                value={form.managerComment}
                onChange={(e) => changeForm("managerComment", e.target.value)}
                placeholder="Enter your comment"
                className="cart-bg mb-2"
              />
              {/* <Media
                images={form.attendedFiles}
                setImages={(data) => changeForm("attendedFiles", data)}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePromotionRequestClient;
