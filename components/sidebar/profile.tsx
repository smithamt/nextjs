import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronRight, LogOut, Settings, SunMoon } from "lucide-react";

import { logout } from "@/app/(auth)/login/action";
import { updateTheme } from "@/lib/theme";
import { EmployeeType } from "@/types";
import { PopoverClose } from "@radix-ui/react-popover";
import Image from "next/image";
import Link from "next/link";
import { FaCaretDown } from "react-icons/fa";
import { IoIosWarning } from "react-icons/io";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const ProfileSidebar = ({ user }: { user: EmployeeType }) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className="my-4 border justify-between rounded-lg cursor-pointer flex items-center w-full p-1">
          <div className="flex items-center h-[44px]">
            <Image
              className="rounded-full"
              width={44}
              height={44}
              alt="profile"
              src={
                user?.profile?.image
                  ? `/api/images/${user.profile?.image}/100/100`
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              }
            />
            <p
              className={`xl:w-32 xl:opacity-[100] w-0 opacity-0 overflow-hidden text-start font-semibold transition-all px-2 duration-300 ease-in-out`}
            >
              {user?.nickname || user?.name}
              <span className="text-[10px] font-bold text-blue-500 absolute bottom-1 right-1">
                {user?.employeeId}
              </span>
            </p>
          </div>
          <div className={"xl:opacity-[100] opacity-0"}>
            <FaCaretDown size={18} />
          </div>
        </div>
      </PopoverTrigger>
      {user && (
        <PopoverContent className="mx-2 w-[360px] font-semibold p-2">
          <div className="p-1 mb-2 hover border rounded-lg h-[46px] cursor-pointer flex items-center relative">
            <Image
              className="rounded-full"
              width={46}
              height={46}
              alt="profile"
              src={
                user?.profile?.image
                  ? `/api/images/${user.profile?.image}/100/100`
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              }
            />
            <p className="overflow-hidden text-start font-semibold transition-all px-2 duration-300 ease-in-out">
              {user?.name} (
              <span className="text-[10px] font-bold text-blue-500">
                {user?.employeeId}
              </span>
              )
            </p>
          </div>
          <div className="flex space-x-2">
            <form
              action={async () => {
                "use server";
                await updateTheme("light");
              }}
            >
              <Button type="submit" className="mr-2 bg-white text-black hover">
                <span className="pr-2">Light</span> <MdLightMode />
              </Button>
            </form>
            <form
              action={async () => {
                "use server";
                await updateTheme("dark");
              }}
            >
              <Button
                type="submit"
                value={"dark"}
                name="dark"
                className="mr-2 bg-slate-700"
              >
                <span className="pr-2">Dark</span> <MdDarkMode />
              </Button>
            </form>
          </div>
          <PopoverClose asChild>
            <Link
              href="/dashboard/setting"
              className="w-full hover mb-2 flex items-center px-2 py-1 mt-2 rounded-lg justify-between"
            >
              <p className="flex items-center">
                <p className="icon-bg rounded-full p-2">
                  <SunMoon />
                </p>
                <p className="px-4">Display & accessibility</p>
              </p>
              <ChevronRight />
            </Link>
          </PopoverClose>
          <PopoverClose asChild>
            <Link
              href={"/dashboard/setting"}
              className="w-full hover mb-2 flex items-center px-2 py-1 mt-2 rounded-lg justify-between"
            >
              <p className="flex items-center">
                <span className="icon-bg rounded-full p-2">
                  <Settings />
                </span>
                <span className="px-4">Setting & Privacy</span>
              </p>
              <ChevronRight />
            </Link>
          </PopoverClose>
          <PopoverClose asChild>
            <Link
              href={""}
              className="w-full hover mb-2 flex items-center px-2 py-1 mt-2 rounded-lg"
            >
              <div className="icon-bg rounded-full p-2">
                <IoIosWarning size={25} />
              </div>
              <p className="px-4">Service Center</p>
            </Link>
          </PopoverClose>
          <form
            action={async () => {
              "use server";
              await logout();
            }}
          >
            <button
              type="submit"
              className="w-full hover mb-2 flex items-center px-2 py-1 mt-2 rounded-lg"
            >
              <div className="icon-bg rounded-full p-2">
                <LogOut />
              </div>
              <p className="px-4">Log out</p>
            </button>
          </form>
          <p className="font-normal inactive-text">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="/privacy"
              className="mr-1 hover:underline cursor-pointer"
            >
              Privacy
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="/terms"
              className="mr-1 hover:underline cursor-pointer"
            >
              Terms
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="/security"
              className="mr-1 hover:underline cursor-pointer"
            >
              Security
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="/more"
              className="mr-1 hover:underline cursor-pointer"
            >
              More
            </a>
          </p>
        </PopoverContent>
      )}
    </Popover>
  );
};

export default ProfileSidebar;
