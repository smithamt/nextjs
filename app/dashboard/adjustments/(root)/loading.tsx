import { Skeleton } from "@/components/ui/skeleton";

function AdjustmentLoading() {
  return (
    <div className="w-full h-screen">
      <div className="p-4">
        <Skeleton className="h-6 w-40 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="flex p-4">
        <div className="w-1/4 px-8 flex flex-col gap-4">
          <Skeleton className="w-40 h-6" />
          <Skeleton className="w-28 h-6" />
          <Skeleton className="w-36 h-6" />
          <Skeleton className="w-40 h-6" />
        </div>
      </div>
    </div>
  );
}

export default AdjustmentLoading;
