import { FormType } from "@/components/form/client";
import CreateForm from "@/components/form/page";
import { colors } from "@/data/colors";
import { getUser } from "@/data/user";
import CurrencyModel from "@/models/currencies/model";

async function CreateAsset({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const query: any = { isPublic: true, company: user.company };
  const currencies = await CurrencyModel.find(query);
  const edit = searchParams.edit as string;

  const form: FormType = {
    profile: { type: "image" },
    name: { type: "text" },
    keyword: { type: "text" },
    amount: { type: "numberOrBoolean" },
    currency: { type: "select", data: currencies },
    frequency: {
      type: "select",
      data: ["Monthly", "Yearly", "Once"],
    },
    color: {
      value: colors[0],
      type: "colorPicker",
      data: colors,
    },
    description: { type: "textArea" },
  };

  return <CreateForm edit={edit} form={form} title="assets" />;
}

export default CreateAsset;
