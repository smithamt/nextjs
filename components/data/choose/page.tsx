import { custommodels } from "@/data/models";
import { getUser } from "@/data/user";
import { ADMIN } from "@/roles";
import { TitleType } from "@/types";
import { cookies } from "next/headers";
import { getData } from "./action";
import List from "./list";

async function ChooseData<T>({
  title,
  state,
  side,
  className,
  defaultOpen,
}: {
  title: keyof typeof custommodels;
  state: TitleType;
  side?: "right" | "bottom";
  className?: string;
  defaultOpen?: boolean;
}) {
  const user = await getUser();
  if (!user) return;
  const query: any = { isPublic: true };
  if (user.role !== ADMIN) query._id = user.department;

  const keys = `${user.role}${state}${title}`;
  const cookie = cookies().get(keys)?.value;

  const model = custommodels[title];
  const { data, count } = await getData<T>({ model: model.model, query });

  return (
    <List
      keys={keys}
      defaultOpen={defaultOpen}
      count={count}
      className={className}
      side={side}
      data={JSON.stringify(data)}
      existId={cookie}
      title={title}
    />
  );
}

export default ChooseData;
