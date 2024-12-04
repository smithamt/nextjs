import ShowNoText from "@/components/app/nodata";
import LastElement from "@/components/lastelement";
import EmployeeProfile from "@/components/profile/page";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import RemoveModel from "@/models/isdelete/model";
import { RequestItemType } from "@/types";
import { ArchiveRestore, Trash2 } from "lucide-react";
import moment from "moment";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leave Request",
  description: "Asia Pacific International Hotel",
  icons: { icon: "/vite.svg" },
};

async function TrashesLeaveRequests({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = { title: "positions" };
  const limit =
    Number(searchParams.page || "1") * Number(searchParams.size || "10");

  const positionsTrashes = await RemoveModel.find(query)
    .populate([
      {
        path: "deletedBy",
        select: "name",
        model: "Employee",
      },
      {
        path: "context",
        select: "employee status",
        populate: [{ path: "employee", select: "name profile" }],
      },
    ])
    .sort({ createdAt: -1 })
    .limit(limit);

  const count = await RemoveModel.countDocuments(query);

  return (
    <div className="h-full w-full overflow-y-auto">
      {positionsTrashes.length <= 0 && (
        <ShowNoText>No Trashes found</ShowNoText>
      )}
      {positionsTrashes.map((remove, index) => {
        return (
          <div key={index} className="p-2 hover">
            <div className="flex justify-between">
              <div>
                {remove.context?.employee && (
                  <EmployeeProfile
                    employee={remove.context?.employee}
                    to={""}
                    description={remove.context?.leaves?.map(
                      (i: RequestItemType) => `${i.leave?.name}-${i.status}`
                    )}
                    ago={moment(remove.createdAt).fromNow()}
                  />
                )}
              </div>
              <div className="flex space-x-2">
                <HoverCard>
                  <HoverCardTrigger>
                    <Button className="w-8 h-8 p-0" variant={"destructive"}>
                      <Trash2 className="w-4" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-[200px] mx-4">
                    Delete Trash
                  </HoverCardContent>
                </HoverCard>
                <HoverCard>
                  <HoverCardTrigger>
                    <Button className="w-8 h-8 p-0" variant={"default"}>
                      <ArchiveRestore className="w-4" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-[200px] mx-4">
                    Restore Leave Request
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
            <div>Delete By: {remove.deletedBy.name}</div>
          </div>
        );
      })}
      {count > positionsTrashes.length && (
        <LastElement count={count} data={positionsTrashes.length} />
      )}
    </div>
  );
}

export default TrashesLeaveRequests;
