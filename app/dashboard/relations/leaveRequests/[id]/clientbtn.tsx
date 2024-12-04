"use client";
import { useHasUser } from "@/app/_context/hasuser.context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/constants/app/axios";
import { LeaveRequestType, RequestItemType } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

function LeaveRequestClientBtn({
  leave: l,
  id,
}: {
  leave: string;
  id: string;
}) {
  const [loading, setLoading] = useState(false);
  const leave = JSON.parse(l) as RequestItemType;
  const [status, setStatus] = useState(leave.status);
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useHasUser();
  const { toast } = useToast();

  const queryCache = queryClient.getQueryCache();
  const queryKeys = queryCache.getAll().map((query) => query.queryKey);
  const queryKey =
    queryKeys.find(
      (q) => q.includes("leaveRequests") && !q.includes("count")
    ) || [];
  const existData = queryClient.getQueryData(queryKey || []) as {
    pages: LeaveRequestType[][];
    pageParams: number[];
  };

  const onAccept = async () => {
    try {
      setLoading(true);
      await axios.put(`/api/leaveRequests/${id}`, {
        _id: leave._id,
        status: "approved",
        isPublic: true,
      });

      setStatus("approved");
      if (existData) {
        queryClient.setQueryData(queryKey, {
          ...existData,
          pages: existData.pages.map((page) => {
            return page.map((item) =>
              item._id === id
                ? { ...item, status: "approved", approvedBy: user }
                : item
            );
          }),
        });
      }
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Error found",
        description: error.response.data?.error || error.message,
      });
      setLoading(false);
    }
  };

  const onReject = async () => {
    try {
      setLoading(true);
      await axios.put(`/api/leaveRequests/${id}`, {
        _id: leave._id,
        status: "rejected",
        rejectReason: leave.rejectReason,
        isPublic: true,
      });
      setStatus("rejected");
      if (existData) {
        queryClient.setQueryData(queryKey, {
          ...existData,
          pages: existData.pages.map((page) => {
            return page.map((item) =>
              item._id === id
                ? { ...item, status: "rejected", approvedBy: user }
                : item
            );
          }),
        });
      }
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Error found",
        description: error.response?.data?.error || error.message,
      });
      setLoading(false);
    }
  };

  return (
    <div className="space-x-2 px-2 flex flex-col items-center justify-center w-1/3">
      {status === "pending" && (
        <div className="space-x-2">
          <Button disabled={loading} onClick={onAccept}>
            Approved
          </Button>
          <Button disabled={loading} onClick={onReject} variant={"destructive"}>
            Reject
          </Button>
        </div>
      )}
      {status !== "pending" && (
        <p className="capitalize">
          {leave.status} by: {leave.approvedBy?.name}
        </p>
      )}
    </div>
  );
}

export default LeaveRequestClientBtn;
