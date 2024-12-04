import { FormType } from "@/components/form/client";
import CreateForm from "@/components/form/page";
import { colors } from "@/data/colors";
import { getUser } from "@/data/user";
import DepartmentModel from "@/models/departments/model";

const workPeriods = [
  "Full-Time",
  "Part-Time",
  "Shift Work",
  "Flexible Hours",
  "Job Sharing",
  "Seasonal",
  "Freelance/Contract",
  "Remote Work",
  "Rotational",
  "On-Call",
];

async function CreateLanguage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const query: any = { isPublic: true, company: user.company };
  const departments = await DepartmentModel.find(query);
  const edit = searchParams.edit as string;

  const form: FormType = {
    profile: { type: "image" },
    name: { type: "text" },
    keyword: { type: "text" },
    level: { type: "number" },
    department: { type: "checkbox", data: departments },
    workPeriods: { type: "select", data: workPeriods },
    employeeClassification: { type: "text" },
    wageInformation: { type: "text" },
    insuranceType: { type: "text" },
    contractType: {
      type: "dropdownList",
      data: ["Permanent", "Probation", "Temporary", "Freelance", "Internship"],
    },
    isHeadOfDepartment: { value: false, type: "boolean" },
    description: { type: "textArea" },
    color: {
      value: colors[0],
      type: "colorPicker",
      data: colors,
    },
  };

  return <CreateForm edit={edit} form={form} title="positions" />;
}

export default CreateLanguage;
