import BackArrowWithTitle from "@/components/app/arrow";
import { Skeleton } from "@/components/ui/skeleton";

async function EmployeeDetailLoading() {
  return (
    <div className="w-full h-screen px-4 pb-4 overflow-y-auto">
      <BackArrowWithTitle to="/dashboard/employees/cart">
        <Skeleton className="w-40 h-6" />
      </BackArrowWithTitle>
      <div className="rounded-lg cart-bg shadow-sm w-full h-auto">
        <div className="flex w-full p-4 border-b">
          <Skeleton className="w-[160px] h-[224px] rounded-lg" />
          <div className="p-2 grid grid-cols-3 gap-4 flex-1 px-4">
            {[1, 2, 3, 4, 5, 6].map((i, k) => {
              return (
                <div key={k}>
                  <Skeleton className="w-10 h-6 mb-2" />
                  <Skeleton className="w-40 h-6" />
                </div>
              );
            })}
          </div>
        </div>
        <div className="min-h-full w-full p-4 grid grid-cols-2 gap-4 h-80">
          <Skeleton className="w-20 h-6"/>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetailLoading;
