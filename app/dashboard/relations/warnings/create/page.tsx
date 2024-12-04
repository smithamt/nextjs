import { getUser } from "@/data/user";
import WarningStateSchema from "@/models/warningstates/model";
import { notFound } from "next/navigation";
import CreateWarningClient from "./client";

async function CreateWarning({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return notFound();
  const warningStates = await WarningStateSchema.find({
    company: user.company,
  });

  return (
    <CreateWarningClient
      edit={searchParams.edit as string}
      states={JSON.stringify(warningStates)}
    />
  );
}
export default CreateWarning;
