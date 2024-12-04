import { FormType } from "@/components/form/client";
import CreateForm from "@/components/form/page";
import { colors } from "@/data/colors";
import { getUser } from "@/data/user";
import CurrencyModel from "@/models/currencies/model";
import DepartmentModel from "@/models/departments/model";

async function CreateAsset({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const query: any = { isPublic: true, company: user.company };
  const currencies = await CurrencyModel.find(query).select("name");
  const departments = await DepartmentModel.find(query).select("name");
  const edit = searchParams.edit as string;

  const form: FormType = {
    profile: { type: "image" },
    name: { type: "text", required: true },
    keyword: { type: "text" },
    department: { type: "checkbox", data: departments, required: true },
    forDepartment: {
      type: "checkbox",
      data: departments,
      hint: "asset for department",
    },
    type: {
      type: "select",
      data: [
        "Current",
        "Fixed (Non-Current)",
        "Tangible",
        "Intangible",
        "Operating",
        "Non-Operating",
      ],
    },
    amount: { type: "number" },
    currency: { type: "dropdownList", data: currencies },
    condition: { type: "text" },
    purchaseDate: { value: new Date(), type: "date" },
    lifecycle: { type: "text" },
    depreciation: { type: "text" },
    maintenanceSchedule: { type: "text" },
    assetPerformance: { type: "text" },
    color: {
      value: colors[0],
      type: "colorPicker",
      data: colors,
    },
    auditInformation: { type: "textArea" },
    description: { type: "textArea" },
  };

  return <CreateForm edit={edit} form={form} title="assets" />;
}

export default CreateAsset;
