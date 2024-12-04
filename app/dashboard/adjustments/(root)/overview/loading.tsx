import { Skeleton } from "@/components/ui/skeleton";

async function OverviewHolidaysLoading() {
  return (
    <>
      <div className="cart-bg rounded-md shadow-sm p-3 mb-4 h-[377px] w-full">
        <Skeleton className="w-40 h-6" />
      </div>
      <div className="cart-bg rounded-md shadow-sm p-3 mb-4 h-[377px] w-full">
        <Skeleton className="w-40 h-6" />
      </div>
    </>
  );
}

export default OverviewHolidaysLoading;
