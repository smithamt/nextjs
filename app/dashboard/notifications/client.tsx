"use client";
import { useInfiniteData } from "@/app/_hook/useInfiniteData";
import ShowNoText from "@/components/app/nodata";
import ProfileLoading from "@/components/loadings/profile";
import EmployeeProfile from "@/components/profile/page";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "@/constants/app/axios";
import { NotificationType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Check, Ellipsis, Trash2 } from "lucide-react";
import moment from "moment";

type UpdateNotificationType = NotificationType & { remove?: boolean };

function NotificationsClient({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const queryClient = useQueryClient();
  const {
    data: notifications,
    loading,
    queryKey,
    lastElementRef,
  } = useInfiniteData<NotificationType>({
    keys: "notifications",
    size: 20,
    params: {
      unread: searchParams.unread,
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (data: UpdateNotificationType) => data,
    onSuccess: (data: UpdateNotificationType) => {
      const infiniteData = queryClient.getQueryData(queryKey) as {
        pages: NotificationType[][];
        pageParams: number[];
      };

      const newAttendances = {
        ...infiniteData,
        pages: data.remove
          ? infiniteData.pages.map((page) =>
              page.filter((s) => s._id !== data._id)
            )
          : infiniteData.pages.map((page) =>
              page.map((s) => (s._id === data._id ? data : s))
            ),
      };

      if (infiniteData) queryClient.setQueryData(queryKey, newAttendances);
    },
  });

  const updateData = (data: UpdateNotificationType) => mutate(data);

  return (
    <div className="h-screen w-full p-4 overflow-y-auto">
      <div className="max-w-[700px] mx-auto cart-bg rounded-lg shadow-sm p-2 min-h-full">
        <div className="flex items-center justify-between px-4 pt-2">
          <p className="font-bold pb-2 text-xl">Notifications</p>
        </div>
        {loading && (
          <>
            <ProfileLoading />
            <ProfileLoading />
            <ProfileLoading />
          </>
        )}
        {!loading && notifications.length <= 0 && (
          <ShowNoText>You have no notifications</ShowNoText>
        )}
        {notifications.map((notification, index) => {
          const searchParams = new URLSearchParams({
            ...notification.search,
            notif: notification._id,
          });
          const searchString = searchParams.toString();

          return (
            <div
              ref={index === notifications.length - 1 ? lastElementRef : null}
              className="hover p-2 rounded-lg m-2 relative flex justify-between items-center"
              key={index}
            >
              <div className="flex justify-between">
                <div className="flex cursor-pointer items-center">
                  <EmployeeProfile
                    to={`/dashboard/${notification.route}/${notification.contentType}/${notification.content}${
                      searchString ? `?${searchString}` : ""
                    }`}
                    ago={moment(notification.createdAt).fromNow()}
                    employee={notification.from}
                    //@ts-ignore
                    read={notification.read}
                    description={notification.title}
                  />
                </div>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-blue-600 absolute right-2" />
                )}
              </div>
              {/* <PlannerMenuButton /> */}
              <DropdownMenu>
                <DropdownMenuTrigger className="w-10 h-10 p-0 rounded-full cart-bg border center">
                  <Ellipsis className="w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  //@ts-ignore
                  onClick={() => updateData({ ...notification, read: true })}
                  className="mx-4 w-[220px]"
                >
                  <DropdownMenuItem className="p-2">
                    <Check className="w-4" />
                    <span className="px-2 whitespace-nowrap">Mark as read</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="p-2"
                    onClick={async () => {
                      updateData({ ...notification, remove: true });
                      await axios.delete(
                        `/api/notifications/${notification._id}`
                      );
                    }}
                  >
                    <Trash2 className="w-4" />
                    <span className="px-2 whitespace-nowrap">
                      Delete this notification
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default NotificationsClient;
