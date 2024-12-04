import ProfileLoading from "@/components/loadings/profile";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";

function PlannerMonthDetailLoading() {
  return (
    <div className="flex flex-col w-full p-2">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center mb-2">
          <Link
            href={"/dashboard/planner/week"}
            className="min-w-10 min-h-10 rounded-full center cursor-pointer hover:bg-black/5 mr-4"
          >
            <IoArrowBackOutline size={20} />
          </Link>
          <ProfileLoading />
        </div>
        <Skeleton className="h-6 w-[200px]" />
        <Skeleton className="w-[180px] h-6" />
      </div>
      <div className="w-full h-full cart-bg border"></div>
    </div>
  );
}

export default PlannerMonthDetailLoading;
