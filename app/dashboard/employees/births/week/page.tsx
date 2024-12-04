import { getUser } from "@/data/user";
import { getWeek } from "@/lib/utils";
import WeekEmployees from "../../_components/week/weekdata";
import { getBirthMonths } from "../month/action";

async function EmployeeBirthWeek({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { next, date } = searchParams;
  const user = await getUser();
  if (!user) return;
  //@ts-ignore
  const week = getWeek(new Date(date || Date.now()), Number(next || "0"));
  const employees = await getBirthMonths({
    searchParams,
    user,
    state: "week",
  });

  return (
    <div className="w-full h-[calc(100%-50px)] p-4">
      <div className="w-full h-full flex cart-bg rounded-lg shadow-sm overflow-y-auto">
        <WeekEmployees
          data={{ total: employees.length, employees }}
          next={next as string}
          week={week}
        />
      </div>
    </div>
  );
}

export default EmployeeBirthWeek;
