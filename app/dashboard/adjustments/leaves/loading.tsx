import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { IoClose } from "react-icons/io5";

function AdjustmentLeaveLoading() {
  return (
    <div className="w-full h-screen pt-4 px-8">
      <div className="w-full h-full cart-bg rounded-lg shadow-m">
        <div className="flex items-center justify-between p-2">
          <div className="font-bold text-lg flex items-center">
            <Link
              href={"/dashboard/adjustments/overview"}
              className="hover w-10 h-10 rounded-full center"
            >
              <IoClose className="w-6" />
            </Link>
            <Skeleton className="w-[180px] h-[36px] ml-2" />
          </div>
          <div className="space-x-2 flex items-center">
            <Skeleton className="w-[180px] h-[36px]" />
            <Skeleton className="w-[180px] h-[36px] hidden 2xl:inline-block" />
            <Skeleton className="w-[180px] h-[36px] hidden xl:inline-block" />
            <Skeleton className="w-[180px] h-[36px] hidden lg:inline-block" />
          </div>
        </div>
        <div className="w-full h-[calc(100%-60px)] p-2 space-y-2">
          <Skeleton className="w-[200px] h-6" />
          <Skeleton className="w-[100px] h-6" />
          <Skeleton className="w-[150px] h-6" />
        </div>
      </div>
    </div>
  );
}

export default AdjustmentLeaveLoading;
