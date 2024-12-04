import { FormType } from "@/components/form/client";
import CreateForm from "@/components/form/page";
import { initialForm } from "@/data/empform";
import { getUser } from "@/data/user";
import BranchModel from "@/models/branches/model";
import CurrencyModel from "@/models/currencies/model";
import DepartmentModel from "@/models/departments/model";
import LanguageModel from "@/models/languages/model";
import PositionModel from "@/models/positions/model";

async function CreateNewEmployee({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const query: any = { isPublic: true, company: user.company };
  const currencies = await CurrencyModel.find(query).select("name");
  const departments = await DepartmentModel.find(query).select("name");
  const positions = await PositionModel.find(query).select("name");
  const branches = await BranchModel.find(query).select("name");
  const languages = await LanguageModel.find(query).select("name");
  const edit = searchParams.edit as string;

  const form: FormType = initialForm;

  //@ts-ignore
  if (edit) form.edit = edit;
  form.currency.data = currencies;
  form.department.data = departments;
  form.position.data = positions;
  form.branch.data = branches;
  form.language.data = languages;

  return (
    <div className="h-screen w-full">
      <CreateForm edit={edit} form={form} title="employees" />
    </div>
  );
}

export default CreateNewEmployee;
