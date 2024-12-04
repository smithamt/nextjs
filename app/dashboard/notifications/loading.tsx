import ProfileLoading from "@/components/loadings/profile";
import { Skeleton } from "@/components/ui/skeleton";

function NotificationLoading() {
  return (
    <div className="h-screen w-full p-4 overflow-y-auto">
      <div className="max-w-[700px] mx-auto cart-bg rounded-lg shadow-sm p-2 min-h-full">
        <div className="flex items-center justify-between px-4 pt-2 mb-4 mt-2">
          <Skeleton className="h-6 w-44" />
        </div>
        <ProfileLoading />
        <ProfileLoading />
        <ProfileLoading />
      </div>
    </div>
  );
}

export default NotificationLoading;
