"use client";
import { useHasUser } from "@/app/_context/hasuser.context";
import DatePicker from "@/components/form/date";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/constants/app/axios";
import { CompanyContractType, EmployeeType } from "@/types";
import dayjs from "dayjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

function CreateRenewalContractClient({
  employee: e,
  contracts: c,
}: {
  employee: string;
  contracts: string;
}) {
  const employee = JSON.parse(e) as EmployeeType & {
    refId: string;
    score: string;
    existContract?: { _id: string };
  };
  const contracts = JSON.parse(c) as CompanyContractType[];
  const [form, setForm] = useState({
    employee: employee._id,
    newSalary: 0,
    reason: "",
    contract: "",
    startDate: new Date(),
    endDate: new Date(),
    effectiveDate: new Date(),
    refId: employee.refId,
  });

  const { formatDate, role } = useHasUser();
  const router = useRouter();

  const changeForm = (name: keyof typeof form, value: any) => {
    if (value) setForm((prev) => ({ ...prev, [name]: value }));
  };

  const src = employee?.profile
    ? `/api/images/${employee.profile?.image}/350/350`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  const onClick = async () => {
    if (!form.employee || !form.contract) return;
    try {
      const response = await axios.post(`/api/employees/contracts`, form);
      console.log("response", response.data);
    } catch (error: any) {
      console.log("error", error);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="cart-bg border-t w-full shadow-sm flex items-center justify-between mb-2">
        <div className="flex items-center p-2">
          <div
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full center cursor-pointer hover:bg-black/5"
          >
            <IoArrowBackOutline size={20} />
          </div>
          <p className="hidden lg:inline text-lg font-semibold px-4 capitalize">
            Create Contract
          </p>
        </div>
        <Button onClick={onClick} className="mx-4">
          Renewal Contract
        </Button>
      </div>
      <div className="h-[calc(100%-50px)] overflow-y-auto">
        <div className="p-2 w-full">
          <div className="flex w-full cart-bg p-2 shadow-sm rounded-lg">
            <Image
              width={160}
              height={224}
              className="rounded-lg"
              src={src}
              alt={"profile"}
            />
            <div className="p-2 grid grid-cols-3 gap-4 flex-1 px-4">
              {[
                { name: "Name", value: employee.name },
                { name: "Employee Id", value: employee.employeeId },
                { name: "Department", value: employee.department?.name },
                { name: "Position", value: employee.position?.name },
                { name: "Score", value: employee.score },
                {
                  name: "Joined Date",
                  value: dayjs(employee.joinedDate).format(formatDate),
                },
              ].map((i, k) => {
                return (
                  <div key={k}>
                    <Label>{i.name}</Label>
                    <p className="text-lg font-semibold">{i.value}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="p-2 cart-bg rounded-lg my-2 shadow-sm space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex flex-col w-full">
                <span className="font-semibold mb-2">New Salary</span>
                <Input
                  value={form.newSalary ? form.newSalary : employee.salary}
                  onChange={(e) =>
                    changeForm("newSalary", Number(e.target.value))
                  }
                  type="number"
                  className="border px-4 py-2"
                  placeholder="Enter new salary"
                />
              </div>
              <div className="w-full space-y-2">
                <span className="font-semibold mb-2">Effective Date</span>
                <DatePicker
                  date={form.effectiveDate}
                  setDate={function (date: Date | undefined): void {
                    changeForm("effectiveDate", date);
                  }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-full space-y-2">
                <span className="font-semibold mb-2">Contract Start Date</span>
                <DatePicker
                  date={form.startDate}
                  setDate={function (date: Date | undefined): void {
                    changeForm("startDate", date);
                  }}
                />
              </div>
              <div className="w-full space-y-2">
                <span className="font-semibold mb-2">Contract End Date</span>
                <DatePicker
                  date={form.endDate}
                  setDate={function (date: Date | undefined): void {
                    changeForm("endDate", date);
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                placeholder="Enter Reason"
                className="cart-bg"
                value={form.reason}
                onChange={(e) => changeForm("reason", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="p-2 grid grid-cols-2 gap-4">
          {contracts?.map((l, k) => {
            const replacedString = l.textEditor[0]?.content?.replace(
              /{{(.*?)}}/g,
              (_, key: keyof typeof form) => {
                //@ts-ignore
                const data = employee[key] || form[key];
                const textData = typeof data === "object" ? data.name : data;
                return `<strong>${textData || ""}</strong>`;
              }
            );

            return (
              <div key={k} className="h-[400px] overflow-hidden cart-bg mb-2">
                <div className="flex justify-between p-2">
                  <p className="font-bold text-lg">{l.name}</p>
                  <Button
                    variant={l._id === form.contract ? "outline" : "default"}
                    onClick={() => changeForm("contract", l._id)}
                  >
                    {l._id === form.contract ? "Used" : "Use Now"}
                  </Button>
                </div>
                <div dangerouslySetInnerHTML={{ __html: replacedString }} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CreateRenewalContractClient;
