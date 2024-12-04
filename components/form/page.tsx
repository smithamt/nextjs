import { custommodels } from "@/data/models";
import CreateFormClient, { FormType } from "./client";

async function CreateForm({
  title,
  form,
  edit,
}: {
  title: keyof typeof custommodels;
  form: FormType;
  edit?: string;
}) {
  if (edit) {
    const model = custommodels[title];
    const existData = await model.model
      .findOne({
        isPublic: true,
        _id: edit,
      })
      .lean();

    if (existData) {
      Object.keys(existData).forEach((key: keyof typeof form) => {
        if (form[key]) {
          //@ts-ignore
          form[key].value = existData[key];
        }
      });
    }
  }

  return (
    <CreateFormClient
      edit={edit}
      title={title}
      formState={JSON.stringify(form)}
    />
  );
}

export default CreateForm;
