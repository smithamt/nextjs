import { FormType } from "@/components/form/client";
import CreateForm from "@/components/form/page";
import { getUser } from "@/data/user";
import TextEditorModel from "@/models/editors/model";
import LeaveModel from "@/models/leaves/model";

async function CreateAsset({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const query: any = { isPublic: true, company: user.company };
  const leaves = await LeaveModel.find(query).select("name");
  const editors = await TextEditorModel.find(query).select("name");
  const edit = searchParams.edit as string;

  const form: FormType = {
    name: { type: "text" },
    keyword: { type: "text" },
    serviceHourPerDay: { type: "number" },
    holidays: { hint: "Allow day per year", type: "number" },
    leaves: { type: "checkbox", data: leaves },
    textEditor: { type: "checkbox", data: editors },
  };

  return <CreateForm edit={edit} form={form} title="contracts" />;
}

export default CreateAsset;
