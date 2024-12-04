import ProfileLoading from "@/components/loadings/profile";
import { Skeleton } from "@/components/ui/skeleton";

function Loading() {
  return (
    <>
      <Skeleton className="w-20 h-6 mb-2 rounded-sm" />
      <Skeleton className="w-full h-6 rounded-sm mb-2" />
      <ProfileLoading />
      <ProfileLoading />
      <ProfileLoading />
    </>
  );
}

export default Loading;
