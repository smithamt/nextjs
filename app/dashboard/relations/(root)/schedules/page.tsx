import ShowNoText from "@/components/app/nodata";
import LastElement from "@/components/lastelement";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getEmployeeQuery } from "@/data/employees";
import { cn } from "@/lib/utils";
import EmployeeModel from "@/models/employees/model";
import ScheduleModel from "@/models/schedules/model";
import { ScheduleType } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leave request",
  description: "Generated by create next app",
  icons: {
    icon: "/vite.svg",
  },
};

async function RelationsClearances({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { status, startDate, endDate, size = 10, page = 1 } = searchParams;
  const empQuery = await getEmployeeQuery(searchParams, "schedules");
  const employees = await EmployeeModel.find(empQuery).select("id");

  const limit = Number(size) * Number(page);

  const query: any = {
    isPublic: true,
    employee: { $in: employees.map((e) => e._id) },
  };

  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string),
    };
  }

  if (status === "pending") query.status = "pending";

  const clearances = (await ScheduleModel.find()
    .sort({ createdAt: -1 })
    .limit(limit)) as ScheduleType[];

  const count = await ScheduleModel.countDocuments();

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="w-full max-w-[700px] mx-auto h-full">
        {clearances.length <= 0 && <ShowNoText>No Data Found</ShowNoText>}
        {clearances.map((l, k) => {
          return (
            <Card
              key={k}
              className={cn(
                "shadow-lg h-20 border-[.4px] mb-1",
                l.status === "pending" ? "nav-bg nav-hover" : "hover"
              )}
            >
              <CardHeader className="p-2 flex flex-row justify-between">
                <Badge variant={l.status} className="h-4">
                  {l.status}
                </Badge>
              </CardHeader>
              <CardContent className="p-1 flex flex-wrap">{}</CardContent>
            </Card>
          );
        })}
        {count > clearances.length && (
          <LastElement count={count} data={clearances.length} />
        )}
      </div>
    </div>
  );
}

export default RelationsClearances;
