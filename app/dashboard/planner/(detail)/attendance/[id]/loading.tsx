import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { IoClose } from "react-icons/io5";

async function PlannerAttendanceDetailLoading() {
  return (
    <div className="w-full h-screen overflow-y-auto px-8 pt-8 pb-4">
      <div className="cart-bg rounded-lg shadow-m min-h-full max-w-[1000px] mx-auto">
        <div className="px-4 py-2 flex items-center justify-between">
          <p className="font-bold text-lg">Planner Detail</p>
          <Link
            href="/dashboard/planner/week"
            className="hover p-2 rounded-full"
          >
            <IoClose size={20} />
          </Link>
        </div>
        <div className="p-2 flex border-b">
          <Skeleton className="rounded-lg mb-2 w-[200px] h-[320px] min-h-[200px] max-h-[200px]" />
          <div className="px-4 h-[200px] space-y-2">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-24 h-6" />
            <Skeleton className="w-36 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlannerAttendanceDetailLoading;
