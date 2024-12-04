import { getUser } from "@/data/user";
import { getWeek } from "@/lib/utils";
import { getProbationEndEmployeeData } from "../../_components/probations/action";
import WeekEmployees from "../../_components/week/weekdata";

async function EmployeeProbationWeek({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { next, date } = searchParams;
  const user = await getUser();
  if (!user) return;
  //@ts-ignore
  const week = getWeek(new Date(date || Date.now()), Number(next || "0"));
  const data = await getProbationEndEmployeeData({
    searchParams,
    user,
    state: "week",
  });

  return (
    <div className="w-full h-[calc(100%-60px)] p-4 overflow-y-auto">
      <div className="w-full h-auto min-h-full flex cart-bg rounded-lg shadow-sm">
        <WeekEmployees data={data} next={next as string} week={week} />
      </div>
    </div>
  );
}

export default EmployeeProbationWeek;
