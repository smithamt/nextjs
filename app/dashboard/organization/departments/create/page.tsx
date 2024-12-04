import { FormType } from "@/components/form/client";
import CreateForm from "@/components/form/page";
import { getUser } from "@/data/user";
import BranchModel from "@/models/branches/model";

async function Create({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const query: any = { isPublic: true, company: user.company };
  const branches = await BranchModel.find(query).select("name");
  const edit = searchParams.edit as string;

  let form: FormType = {
    profile: { type: "image" },
    name: { type: "text", value: "", required: true },
    keyword: {
      value: "",
      type: "text",
    },
    department: {
      type: "radio",
      value: "",
      data: ["hello", "ardio", "i am radio"],
    },
    allowHalfOff: {
      type: "select",
      value: "",
      data: ["hello", "1", "2", "3"],
    },
    branch: {
      type: "checkbox",
      value: "",
      data: branches,
    },
    goals: {
      value: "",
      type: "textArea",
    },
    color: {
      value: "",
      type: "colorPicker",
    },
    rolesAndResponsibilities: {
      value: "",
      type: "textArea",
    },
  };

  return <CreateForm edit={edit} form={form} title="departments" />;
}

export default Create;
