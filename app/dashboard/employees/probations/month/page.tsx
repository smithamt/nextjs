import { getUser } from "@/data/user";
import EmployeeDashbaordCalendar from "../../_components/month";
import { getProbationEndEmployeeData } from "../../_components/probations/action";

async function Probations({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await getUser();
  if (!user) return;
  const data = await getProbationEndEmployeeData({
    searchParams,
    user,
    state: "month",
  });

  return (
    <EmployeeDashbaordCalendar
      title="probations"
      searchParams={searchParams}
      data={data}
    />
  );
}

export default Probations;
