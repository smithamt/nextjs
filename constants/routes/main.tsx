import {
  AiFillFolderOpen,
  AiOutlineDollarCircle,
  AiOutlineHome,
  AiOutlineMessage,
} from "react-icons/ai";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoCalendarOutline, IoPeopleCircleOutline } from "react-icons/io5";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";

import { RouteType } from "@/types";
import { CirclePlus, Settings2, Timer } from "lucide-react";
import { BsTrash3, BsViewList } from "react-icons/bs";
import { FiList } from "react-icons/fi";
import { MdPolicy } from "react-icons/md";

export const routes: RouteType[] = [
  {
    path: "/dashboard/home",
    name: "home",
    icon: <AiOutlineHome size={18} />,
  },
  {
    path: "/dashboard/notifications",
    name: "notifications",
    icon: <IoMdNotificationsOutline size={18} />,
    noti: 0,
  },
  {
    path: "/dashboard/messages",
    name: "messages",
    icon: <AiOutlineMessage size={18} />,
    noti: 0,
  },
  {
    path: "/dashboard/organization",
    realpath: "/dashboard/organization/departments",
    name: "organization",
  },
  {
    path: "/dashboard/employees",
    name: "employees",
    icon: <IoPeopleCircleOutline size={18} />,
    children: [
      {
        path: "/dashboard/employees/cart",
        name: "cart",
        icon: <BsViewList size={18} />,
      },
      {
        path: "/dashboard/employees/list",
        name: "list",
        icon: <FiList size={18} />,
      },
      {
        path: "/dashboard/employees/create/employee",
        name: "create",
        icon: <CirclePlus className="w-4" />,
      },
    ],
  },
  {
    path: "/dashboard/adjustments",
    realpath: "/dashboard/adjustments/overview",
    search: { leave: "all" },
    name: "adjustments",
    icon: <Timer size={18} />,
  },
  {
    path: "/dashboard/planner",
    realpath: "/dashboard/planner/week",
    name: "planner",
    icon: <IoCalendarOutline size={18} />,
  },
  {
    path: "/dashboard/relations",
    realpath: "/dashboard/relations/leaveRequests",
    name: "relations",
    icon: <VscGitPullRequestGoToChanges size={18} />,
    noti: 0,
  },
  {
    path: "/dashboard/payroll",
    name: "payroll",
    icon: <AiOutlineDollarCircle size={18} />,
  },
  {
    path: "/dashboard/app",
    name: "app",
    icon: <MdPolicy size={18} />,
    children: [
      {
        path: "/dashboard/app/role",
        name: "role",
        icon: <BsViewList size={18} />,
      },
      {
        path: "/dashboard/app/setting",
        name: "companySetting",
        icon: <Settings2 className="w-4" />,
      },
    ],
  },
  {
    name: "editors",
    path: "/dashboard/editors",
    icon: <AiFillFolderOpen size={18} />,
  },
  {
    name: "trashes",
    path: "/dashboard/trashes",
    icon: <BsTrash3 size={18} />,
  },
];
