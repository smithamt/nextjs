import ShowNoText from "@/components/app/nodata";
import LastElement from "@/components/lastelement";
import ExportBtn from "@/components/page";
import EmployeeProfile from "@/components/profile/page";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getEmployeeQuery } from "@/data/employees";
import { cn } from "@/lib/utils";
import EmployeeModel from "@/models/employees/model";
import TerminationModel from "@/models/terminations/model";
import { TerminationType } from "@/types";
import moment from "moment";
import { Metadata } from "next";
import Link from "next/link";

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
  const empQuery = await getEmployeeQuery(searchParams, "terminations");
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

  const data = (await TerminationModel.find()
    .sort({ createdAt: -1 })
    .populate("employee", "name nickname profile employeeId")
    .limit(limit)) as TerminationType[];

  const count = await TerminationModel.countDocuments();

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="w-full max-w-[700px] mx-auto h-full">
        <div className="py-2 flex items-center justify-between">
          <p>Resignation {count}</p>
          <div className="flex items-center space-x-2">
            <Link
              href={"/dashboard/relations/terminations/create"}
              className={cn(buttonVariants({ variant: "destructive" }))}
            >
              Create Termination
            </Link>
            <ExportBtn data={JSON.stringify(data)} title={"terminations"} />
          </div>
        </div>
        {data.length <= 0 && <ShowNoText>No Data Found</ShowNoText>}
        {data.map((l, k) => {
          return (
            <Card
              key={k}
              className={cn(
                "shadow-lg h-20 border-[.4px] mb-1",
                l.status === "pending" ? "nav-bg nav-hover" : "hover"
              )}
            >
              <CardHeader className="p-2 flex flex-row justify-between">
                <EmployeeProfile
                  description={l.description}
                  employee={l.employee}
                  ago={moment(l.createdAt).fromNow()}
                  to={`/dashboard/relations/terminations/${l._id}`}
                />
                <Badge variant={l.status} className="h-4">
                  {l.status}
                </Badge>
              </CardHeader>
              <CardContent className="p-1 flex flex-wrap">{}</CardContent>
            </Card>
          );
        })}
      </div>
      {count > data.length && <LastElement count={count} data={data.length} />}
    </div>
  );
}

export default RelationsClearances;
