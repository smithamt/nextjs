"use client";
import { useHasUser } from "@/app/_context/hasuser.context";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import axios from "@/constants/app/axios";
import { ADMIN } from "@/roles";
import { StatusType } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Ellipsis } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "../ui/use-toast";

export function MenubarDemo({
  data,
  title,
  status = "pending",
}: {
  data: string;
  title: string;
  status: StatusType;
}) {
  const params = useSearchParams();
  const searchParams = Object.fromEntries(params);
  const queryClient = useQueryClient();
  const { user } = useHasUser();
  const router = useRouter();
  const { toast } = useToast();

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="hover">
          <Ellipsis />
        </MenubarTrigger>
        <MenubarContent side="right">
          <MenubarItem
            disabled={status !== "pending"}
            onClick={() =>
              router.push(
                `/dashboard/relations/leaveRequests/create?edit=${data}`
              )
            }
          >
            Edit <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem
            className="text-red-500 hover:text-red-600 font-semibold"
            disabled={status !== "pending" && ADMIN !== user.role}
            onClick={async () => {
              try {
                await axios.delete(`/api/${title}/${data}`);
                router.back();
                const queryKey = [title, searchParams.department, user.role];
                const existData = queryClient.getQueryData(queryKey) as {
                  pages: any[][];
                  pageParams: number[];
                };
                queryClient.setQueryData(queryKey, {
                  ...existData,
                  pages: existData.pages.map((page: any[]) => {
                    return page.filter((p) => p._id !== data);
                  }),
                });
              } catch (error: any) {
                console.log("repsonsef;lkjaslkfjesa", error);
                toast({ title: "Error found", description: error.message });
              }
            }}
          >
            Delete <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New Incognito Window</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
