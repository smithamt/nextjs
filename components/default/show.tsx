import { toSkipPlanner } from "@/app/dashboard/planner/(detail)/attendance/[id]/data";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

function DefaultDataShow({
  data: d,
  toSkip = [],
  className,
  chicontainercls,
  chichildcls,
}: {
  data: string;
  toSkip?: string[];
  className?: string;
  chicontainercls?: string;
  chichildcls?: string;
}) {
  const attendance = JSON.parse(d);
  return (
    <div className={cn("min-h-40 w-full grid grid-cols-2 gap-4", className)}>
      {Object.keys(attendance)
        .filter((s) => ![...toSkipPlanner, ...toSkip].includes(s))
        .map((k, index) => {
          const data = attendance[k];
          return (
            <div key={index} className={chicontainercls}>
              <p className="p-1 min-w-32 font-bold text-xs">
                {k
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, k[0]?.toUpperCase())}
              </p>
              <div className={cn("p-1", chichildcls)}>
                {k.includes("date") ? (
                  dayjs(data).format("YYYY-MM-DD")
                ) : k.includes("createdAt") || k.includes("updatedAt") ? (
                  dayjs(data).format("hh:mm A YYYY-MM-DD")
                ) : typeof data === "string" ? (
                  data
                ) : (
                  <ObjData data={data} toSkip={[...toSkipPlanner, ...toSkip]} />
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default DefaultDataShow;

const ObjData = ({
  data: attendance,
  toSkip = [],
  className,
}: {
  data: any;
  toSkip?: string[];
  className?: string;
}) => {
  return (
    <div className={className}>
      {Object.keys(attendance)
        .filter((s) => !toSkip.includes(s))
        .map((i, k) => {
          const data = attendance[i];
          return (
            <div key={k} className="flex">
              <p className="p-2 min-w-32 font-semibold text-xs">
                {i
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, i[0]?.toUpperCase())}
              </p>
              <div className="p-2">
                {i.includes("date") ? (
                  dayjs(data).format("YYYY-MM-DD")
                ) : i.includes("createdAt") || i.includes("updatedAt") ? (
                  dayjs(data).format("hh:mm A YYYY-MM-DD")
                ) : typeof data === "string" ? (
                  data
                ) : (
                  <pre className="text-green-600">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                )}
              </div>
            </div>
          );
        })}
    </div>
  );
};
