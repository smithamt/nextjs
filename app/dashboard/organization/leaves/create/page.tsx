import { FormType } from "@/components/form/client";
import CreateForm from "@/components/form/page";
import { colors } from "@/data/colors";
import { countries } from "@/data/countries";
import { employeeTypes, maritalstatus } from "@/data/empform";
import { getUser } from "@/data/user";
import DepartmentModel from "@/models/departments/model";
import LeaveModel from "@/models/leaves/model";

async function CreateLeave({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const query: any = { isPublic: true, company: user.company };
  const edit = searchParams.edit as string;

  const departments = await DepartmentModel.find(query);
  const leaves = await LeaveModel.find(query);

  const form: FormType = {
    profile: { type: "image" },
    name: { value: "", type: "text" },
    keyword: { value: "", type: "text" },
    gender: {
      value: "",
      type: "dropdownList",
      data: ["All", "Male", "Female"],
    },
    maritalStatus: {
      value: "All",
      type: "checkbox",
      data: maritalstatus,
    },
    employeeType: {
      value: "All",
      type: "checkbox",
      data: employeeTypes,
    },
    department: {
      value: ["All"],
      type: "checkbox",
      data: departments,
    },
    allowDays: {
      value: "",
      type: "number",
    },
    paidType: {
      value: "",
      type: "select",
      data: ["Paid", "Unpaid", "HalfPaid"],
    },
    leaveType: {
      value: "yearly",
      hint: "base on employee service year",
      type: "select",
      data: ["yearly", "monthly", "once"],
    },
    employeeServiceMonths: {
      type: "number",
    },
    carriableYears: {
      type: "number",
    },
    excludeDays: {
      type: "checkbox",
      data: [
        {
          _id: "Absence",
          name: "Absence",
        },
        {
          _id: "Off",
          name: "Off",
        },
        ...leaves,
      ],
    },
    countries: {
      value: ["All"],
      type: "select",
      data: countries,
    },
    minimumDays: {
      value: "",
      type: "number",
    },
    saveMinimumDay: {
      value: ["All"],
      type: "checkbox",
      data: departments,
    },
    carryLeave: {
      value: "",
      type: "checkbox",
      data: leaves,
    },
    startDate: {
      value: undefined,
      hint: "optional - will effect after start date",
      type: "date",
    },
    endDate: {
      value: undefined,
      hint: "optional - will not effect after end date",
      type: "date",
    },
    calculateWithServiceDays: {
      value: false,
      type: "boolean",
    },
    description: {
      value: "",
      type: "textArea",
    },
    color: {
      value: colors[0],
      type: "colorPicker",
      data: colors,
    },
  };

  return <CreateForm edit={edit} form={form} title="leaves" />;
}

export default CreateLeave;
