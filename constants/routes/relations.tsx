import { RouteType } from "@/types";
import { IoMdPaperPlane } from "react-icons/io";
import { RiFilePaper2Line } from "react-icons/ri";

export const headerWarnings = [
  { path: "published" },
  { path: "scheduled" },
  { path: "drafts" },
  { path: "expiring" },
  { path: "expired" },
];

export const relationroutes: RouteType[] = [
  {
    path: "/dashboard/relations/warnings",
    realpath: "/dashboard/relations/warnings/published",
    name: "warnings",
    icon: <IoMdPaperPlane size={20} />,
    noti: 0,
  },
  {
    path: "/dashboard/relations/trainings",
    name: "trainings",
    icon: <RiFilePaper2Line size={20} />,
    noti: 0,
  },
  {
    path: "/dashboard/relations/increments",
    name: "increments",
    icon: <IoMdPaperPlane size={20} />,
    noti: 0,
  },
  {
    path: "/dashboard/relations/promotions",
    name: "promotions",
    noti: 0,
    icon: <RiFilePaper2Line size={20} />,
  },
  {
    path: "/dashboard/relations/transfers",
    name: "transfers",
    noti: 0,
    icon: <RiFilePaper2Line size={20} />,
  },
];
