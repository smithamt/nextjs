import { FormType } from "@/components/form/client";
import CreateForm from "@/components/form/page";
import { getUser } from "@/data/user";

async function CreateLanguage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const query: any = { isPublic: true, company: user.company };
  const edit = searchParams.edit as string;

  const form: FormType = {
    name: { type: "text" },
    key: { type: "text" },
  };

  return <CreateForm edit={edit} form={form} title="languages" />;
}

export default CreateLanguage;
