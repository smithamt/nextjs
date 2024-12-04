import { RouteType } from "@/types";
import { CalendarCheck2, SquareKanban, TreePalm } from "lucide-react";
import { MdSchedule } from "react-icons/md";

export const adjustmentsroutes: RouteType[] = [
  {
    path: "/dashboard/adjustments/overview",
    name: "overview",
    description: "Manage your department",
    icon: <SquareKanban size={20} />,
  },
  {
    path: "/dashboard/adjustments/leaves",
    name: "leaves",
    icon: <CalendarCheck2 size={20} />,
  },
  {
    path: "/dashboard/adjustments/holidays",
    name: "holidays",
    icon: <TreePalm size={20} />,
  },
  {
    path: "/dashboard/adjustments/off",
    name: "off",
    icon: <MdSchedule size={20} />,
  },
];
