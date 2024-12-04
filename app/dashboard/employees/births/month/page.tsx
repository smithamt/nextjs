import { getUser } from "@/data/user";
import EmployeeDashbaordCalendar from "../../_components/month";
import { getBirthMonths } from "./action";

async function EmployeeBirths({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const data = await getBirthMonths({
    searchParams,
    user,
    state: "month",
  });

  return (
    <EmployeeDashbaordCalendar
      title="births"
      searchParams={searchParams}
      data={{ total: data.length, employees: data }}
    />
  );
}

export default EmployeeBirths;
