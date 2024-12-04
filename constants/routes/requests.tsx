import { RouteType } from "@/types";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdPaperPlane } from "react-icons/io";
import { RiFilePaper2Line } from "react-icons/ri";

export const requestroutes: RouteType[] = [
  {
    path: "/dashboard/relations/leaveRequests",
    name: "leaveRequests",
    icon: <RiFilePaper2Line size={20} />,
    noti: 0,
  },
  {
    path: "/dashboard/relations/remotes",
    name: "remotes",
    icon: <IoMdPaperPlane size={20} />,
    noti: 0,
  },
  {
    path: "/dashboard/relations/overtimes",
    name: "overtimes",
    icon: <IoMdPaperPlane size={20} />,
    noti: 0,
  },
  {
    path: "/dashboard/relations/resignations",
    name: "resignations",
    noti: 0,
    icon: <RiFilePaper2Line size={20} />,
  },
  {
    path: "/dashboard/relations/terminations",
    name: "terminations",
    noti: 0,
    icon: <RiFilePaper2Line size={20} />,
  },
  {
    path: "/dashboard/relations/clearances",
    name: "clearances",
    noti: 0,
    icon: <FaCheckCircle size={20} />,
  },
  {
    path: "/dashboard/relations/schedules",
    name: "schedules",
    noti: 0,
    icon: <RiFilePaper2Line size={20} />,
  },
];
