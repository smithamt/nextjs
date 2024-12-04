import { RouteType } from "@/types";
import { AiOutlineDollarCircle } from "react-icons/ai";
import {
  FaBuilding,
  FaLanguage,
  FaRegCalendarCheck,
  FaUserTie,
} from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { MdBeachAccess, MdCurrencyExchange, MdSchedule } from "react-icons/md";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";

export const organizationroutes: RouteType[] = [
  {
    path: "/dashboard/organization/departments",
    name: "departments",
    description: "Manage your department",
    icon: <FaBuilding size={20} />,
  },
  {
    path: "/dashboard/organization/contracts",
    name: "contracts",
    icon: <FaUserTie size={20} />,
  },
  {
    path: "/dashboard/organization/positions",
    name: "positions",
    icon: <FaUserTie size={20} />,
  },
  {
    path: "/dashboard/organization/schedules",
    name: "schedules",
    icon: <MdSchedule size={20} />,
  },
  {
    path: "/dashboard/organization/holidays",
    name: "holidays",
    icon: <MdBeachAccess size={20} />,
  },
  {
    path: "/dashboard/organization/leaves",
    name: "leaves",
    icon: <FaRegCalendarCheck size={20} />,
  },
  {
    path: "/dashboard/organization/allowances",
    name: "allowances",
    icon: <VscGitPullRequestGoToChanges size={20} />,
  },
  {
    path: "/dashboard/organization/deductions",
    name: "deductions",
    icon: <AiOutlineDollarCircle size={20} />,
  },
  {
    path: "/dashboard/organization/assets",
    name: "assets",
    icon: <HiOutlineDocumentReport size={20} />,
  },
  {
    path: "/dashboard/organization/branches",
    name: "branches",
    icon: <FaBuilding size={20} />,
  },
  {
    path: "/dashboard/organization/currencies",
    name: "currencies",
    icon: <MdCurrencyExchange size={20} />,
  },
  {
    path: "/dashboard/organization/languages",
    name: "languages",
    icon: <FaLanguage size={20} />,
  },
];
