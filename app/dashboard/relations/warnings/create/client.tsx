"use client";
import DatePicker from "@/components/form/date";
import EmployeeProfile from "@/components/profile/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/constants/app/axios";
import { EmployeeType, WarningStateType, WarningType } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ChooseEmployee from "../../../../../components/data/employees/input";
import WarningState from "./state";

const CreateWarningClient = ({
  edit,
  states: s,
}: {
  edit: string;
  states: string;
}) => {
  const states = JSON.parse(s) as WarningStateType[];
  const router = useRouter();
  //@ts-ignore
  const [form, setForm] = useState<WarningType & { employees: EmployeeType[] }>(
    {
      issuedDate: new Date(),
      title: "",
      employees: [],
      informTo: [],
      //@ts-ignore
      warningState: "",
      detailsOfIncident: "",
      correctiveAction: "",
      employeeComments: "",
      witnessedBy: [],
      issuedBy: [],
      edit,
    }
  );

  const { toast } = useToast();
  const changeForm = (name: string, value: any | any[]) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (data: any) => {
    try {
      const response = await axios.post("/api/warnings", data);
      console.log("response", response.data);
      router.push("/dashboard/relations/warnings/published");
    } catch (error: any) {
      toast({
        title: "Error found",
        description: error.response?.data?.error || error.message,
      });
      console.log("error", error);
    }
  };

  return (
    <form
      className="w-full h-screen overflow-y-auto p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const formDataFromEvent = new FormData(e.currentTarget);
        const formDataObject: { [key: string]: any } = {};

        formDataFromEvent.forEach((value, key) => {
          formDataObject[key] = value;
        });

        const combinedFormData = {
          ...form,
          ...formDataObject,
        };

        await handleSubmit(combinedFormData);
      }}
    >
      <div className="max-w-[800px] mx-auto rounded-lg min-h-full cart-bg w-full p-2">
        <div className="h-auto max-w-[700px] py-2 mx-auto">
          <div className="mx-auto cart-bg rounded-lg">
            <p className="px-4 py-2 font-bold text-lg">Create Warning Form</p>
            <p className="inactive-text text-md px-4">
              Change who can work on leads. Add or remove people who already
              have access to Leads Center or to your company. You can also add
              people who don’t have Page access by searching for their Facebook
              profile or friends of friends by entering their email address.
            </p>
            <div className="mt-4 w-full pb-4">
              <div className="mt-4">
                <div className="px-4 space-y-2">
                  <Label>Issued Date</Label>
                  <DatePicker
                    setDate={(date) => changeForm("issuedDate", date)}
                    date={form.issuedDate}
                  />
                  <WarningState
                    data={states}
                    warningState={""}
                    setWarningState={(data) => changeForm("warningState", data)}
                  />
                  <p className="font-semibold mb-2">Enter warning title</p>
                  <Input
                    value={form.title}
                    placeholder="Enter title"
                    onChange={(e) => changeForm("title", e.target.value)}
                    type="text"
                    className=" outline-[#EEEFF0] border w-full focus:outline-blue-500 outline outline-1  px-2 py-1 rounded-sm mx-auto"
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
                      <p className="font-semibold my-2">Warning Employees</p>
                      <ChooseEmployee
                        params={{
                          _id: { $nin: form.employees.map((i) => i._id) },
                        }}
                        employees={form.employees}
                        setEmployees={(data) => changeForm("employees", data)}
                      />
                    </>
                  )}
                </div>
                <div className="px-4">
                  <p className="font-semibold my-2">Choose Inform to</p>
                  <ChooseEmployee
                    employees={form.informTo}
                    setEmployees={(data) => changeForm("informTo", data)}
                  />
                </div>
                <div className="w-full h-[1px] nav-bg mt-4"></div>
                <div className="px-4">
                  <p className="font-semibold mb-2 mt-4">Details of incident</p>
                  <Textarea
                    value={form.detailsOfIncident}
                    onChange={(e) =>
                      changeForm("detailsOfIncident", e.target.value)
                    }
                    placeholder="Enter description"
                    className=" outline-[#EEEFF0] w-full outline outline-1 rounded-sm p-2 focus:outline-blue-500"
                    name="detailsOfIncident"
                    id=""
                    cols={30}
                    rows={10}
                  />
                  <p className="font-semibold mb-2 mt-4">Corrective Action</p>
                  <Textarea
                    value={form.correctiveAction}
                    placeholder="Enter description"
                    onChange={(e) =>
                      changeForm("correctiveAction", e.target.value)
                    }
                    className=" outline-[#EEEFF0] w-full outline outline-1 rounded-sm p-2 focus:outline-blue-500"
                    name="correctiveAction"
                    id=""
                    cols={30}
                    rows={5}
                  />
                </div>
                <div className="px-4">
                  <p className="font-semibold my-2">Issued by</p>
                  <ChooseEmployee
                    employees={form.issuedBy}
                    setEmployees={(data) => changeForm("issuedBy", data)}
                  />
                </div>{" "}
                <div className="px-4">
                  <p className="font-semibold my-2">Witnessed by</p>
                  <ChooseEmployee
                    employees={form.witnessedBy}
                    setEmployees={(data) => changeForm("witnessedBy", data)}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end p-4 space-x-2">
              <Button variant={"outline"} onClick={() => router.back()}>
                Cancel
              </Button>
              {!edit && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={async (e) => {
                    e.preventDefault();
                    const data = {
                      ...form,
                      state: "draft",
                      isPublic: false,
                      informTo: form.informTo.map((i) => i._id),
                      issuedBy: form.issuedBy.map((i) => i._id),
                      witnessedBy: form.witnessedBy.map((i) => i._id),
                      employees: form.employees.map((i) => i._id),
                    };
                    await handleSubmit(data);
                  }}
                >
                  Draft
                </Button>
              )}
              <Button
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  const data = {
                    ...form,
                    state: "published",
                    informTo: form.informTo.map((i) => i._id),
                    issuedBy: form.issuedBy.map((i) => i._id),
                    witnessedBy: form.witnessedBy.map((i) => i._id),
                    employees: form.employees.map((i) => i._id),
                  };
                  console.log("data", data);
                  await handleSubmit(data);
                }}
                className="px-4 py-2 border text-white rounded-md"
              >
                Public
              </Button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateWarningClient;
