"use client";
import { useInfiniteData } from "@/app/_hook/useInfiniteData";
import ShowNoText from "@/components/app/nodata";
import ProfileLoading from "@/components/loadings/profile";
import SpinLoading from "@/components/loadings/spinloading";
import EmployeeProfile from "@/components/profile/page";
import { BadgeText } from "@/components/ui/badgeText";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { LeaveRequestType } from "@/types";
import { Label } from "@radix-ui/react-label";
import moment from "moment";
import { useSearchParams } from "next/navigation";

function RelationLeaveRequestClient() {
  const params = useSearchParams();
  const department = params.get("department");
  const pending = params.get("pending");
  const { data, loading, queryKey, lastElementRef, count } =
    useInfiniteData<LeaveRequestType>({
      keys: "leaveRequests",
      size: 20,
      params: { department, pending },
    });

  return (
    <>
      {loading ? (
        <SpinLoading />
      ) : (
        data.length <= 0 && <ShowNoText>No leave request found</ShowNoText>
      )}
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-1 h-[calc(100%-50px)] w-full overflow-y-auto pr-2 pb-2">
        {data.map((l, k) => {
          return (
            <Card
              key={k}
              className={cn(
                "shadow-lg h-auto border-[.4px]",
                l.status === "pending" ? "nav-bg nav-hover" : "hover"
              )}
            >
              <CardHeader className="p-2 flex">
                <EmployeeProfile
                  description={l.reason}
                  employee={l.employee}
                  ago={moment(l.createdAt).fromNow()}
                  to={`/dashboard/relations/leaveRequests/${l._id}`}
                />
              </CardHeader>
              <CardContent className="p-1 flex flex-wrap">
                {l.leaves?.map((leave, index) => {
                  return (
                    <div key={index} className="p-2 h-auto">
                      <p
                        className="px-2 rounded-sm center my-1"
                        style={{
                          backgroundColor: leave?.leave.color?.back,
                          color: leave?.leave.color?.text,
                        }}
                      >
                        {leave.leave?.name}
                      </p>
                      <p className="text-xs font-bold pb-1">
                        <BadgeText
                          className="capitalize font-semibold"
                          variant={l.status}
                        >
                          {l.status}
                        </BadgeText>
                        {l.status !== "pending" && (
                          <>
                            by{" "}
                            <span className="cursor-pointer hover:underline">
                              {l.approvedBy?.nickname || l.approvedBy?.name}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
              <CardFooter className="p-2 flex justify-end">
                <Label>Request By: {l.createdBy?.name}</Label>
              </CardFooter>
            </Card>
          );
        })}
        {count > data.length && (
          <div
            ref={lastElementRef}
            className={
              "shadow-lg h-[220px] border-[.4px] w-full cart-bg rounded-lg p-2"
            }
          >
            <ProfileLoading />
            <Skeleton className="w-40 h-6 mt-8 mx-4" />
            <div className="w-40 ml-auto mt-10 px-4">
              <Skeleton className="w-full h-4" />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RelationLeaveRequestClient;
