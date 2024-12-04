import { FormType } from "@/components/form/client";
import CreateForm from "@/components/form/page";
import { colors } from "@/data/colors";
import { getUser } from "@/data/user";
import DepartmentModel from "@/models/departments/model";

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
    name: { type: "text" },
    from: { value: "00:00:00", type: "time" },
    to: { value: "00:00:00", type: "time" },
    department: { type: "checkbox", data: departments },
    notes: { type: "textArea" },
    color: {
      value: colors[0],
      type: "colorPicker",
      data: colors,
    },
  };

  return <CreateForm edit={edit} form={form} title="schedules" />;
}

export default CreateLanguage;
