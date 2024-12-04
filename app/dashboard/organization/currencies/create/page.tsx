import { FormType } from "@/components/form/client";
import CreateForm from "@/components/form/page";
import { colors } from "@/data/colors";
import { getUser } from "@/data/user";

async function CreateAsset({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();   if (!user) return;
  const query: any = { isPublic: true, company: user.company };
  const edit = searchParams.edit as string;

  const form: FormType = {
    name: { type: "text" },
    keyword: { type: "text" },
    symbol: { type: "text" },
    color: {
      value: colors[0],
      type: "colorPicker",
      data: colors,
    },
  };

  return <CreateForm edit={edit} form={form} title="assets" />;
}

export default CreateAsset;
