import { getUser } from "@/data/user";
import EmployeeModel from "@/models/employees/model";
import HolidayModel from "@/models/holidays/model";
import LeaveRequestModel from "@/models/leaverequests/model";
import LeaveModel from "@/models/leaves/model";
import { notFound } from "next/navigation";
import CreateLeaveRequestClient from "./client";
import { initialLeaveData } from "@/lib/utils";

async function CreateLeaveRequest({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const { employee: id, edit } = searchParams;
  const employee = await EmployeeModel.findById(id || user._id)
    .select("name nickname employeeId position department joinedDate")
    .populate("position department", "name");

  if (!employee) return notFound();

  let initialForm = {
    employee: employee._id,
    leaves: [initialLeaveData(1)],
    reason: "",
    address: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    emergencyContactRelationship: "",
    status: "pending",
    edit,
  };

  const leaves = await LeaveModel.find().select("name");
  const holidays = await HolidayModel.find().select("name");

  if (edit) {
    const l = await LeaveRequestModel.findById(edit);
    if (!l) return notFound();
    const leaveRequest = l.toObject();
    initialForm = {
      ...leaveRequest,
      leaves: leaveRequest.leaves.map((l: any, index: number) => ({
        ...l,
        index: index + 1,
        _id: l.leave,
        from: new Date(l.from),
        to: new Date(l.to),
        attendedFiles: [],
      })),
      edit,
    };
  }

  return (
    <CreateLeaveRequestClient
      leaves={JSON.stringify(leaves)}
      holidays={JSON.stringify(holidays)}
      employee={JSON.stringify(employee)}
      initialForm={JSON.stringify(initialForm)}
    />
  );
}

export default CreateLeaveRequest;
