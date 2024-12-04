import { FormType } from "@/components/form/client";
import CreateForm from "@/components/form/page";
import { colors } from "@/data/colors";
import { countries } from "@/data/countries";
import { getUser } from "@/data/user";
import LeaveModel from "@/models/leaves/model";
import DepartmentModel from "@/models/departments/model";

async function CreateAsset({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const query: any = { isPublic: true, company: user.company };
  const leaves = await LeaveModel.find(query);
  const departments = await DepartmentModel.find(query);
  const edit = searchParams.edit as string;

  const form: FormType = {
    profile: { type: "image" },
    name: { type: "text" },
    keyword: { type: "text" },
    department: { type: "checkbox", data: departments },
    paidType: {
      value: "Paid",
      type: "dropdownList",
      data: ["Paid", "Unpaid", "HalfPaid"],
    },
    date: { value: new Date(), type: "date" },
    countries: { type: "checkbox", data: countries },
    excludeCountries: { type: "checkbox", data: countries },
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
    description: { type: "textArea" },
    color: {
      value: colors[0],
      type: "colorPicker",
      data: colors,
    },
  };

  return <CreateForm edit={edit} form={form} title="assets" />;
}

export default CreateAsset;
