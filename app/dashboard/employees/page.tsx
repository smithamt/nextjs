import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import EmployeeBirthdayDashboard from "./_components/births/birth";
import EmployeeProbationsDashboard from "./_components/probations/dashboard";
import {
  FaChartLine,
  FaFileAlt,
  FaFileContract,
  FaListUl,
  FaShoppingCart,
  FaUserClock,
} from "react-icons/fa";

async function Employees({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <div className="w-full h-screen overflow-y-auto">
      <div className="flex gap-4 flex-wrap items-center justify-between px-4">
        <p className="p-4 font-bold text-lg">Employee Dashboard</p>
        <Link
          href="/dashboard/employees/appraisals"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "shadow-sm flex-1 min-w-[100px]"
          )}
        >
          <FaChartLine size={18} />
          <span className="px-2">Appraisals</span>
        </Link>
        <Link
          href="/dashboard/employees/contracts"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "shadow-sm flex-1 min-w-[100px]"
          )}
        >
          <FaFileContract size={18} />
          <span className="px-2">Contracts</span>
        </Link>
        <Link
          href="/dashboard/employees/endcontracts"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "shadow-sm flex-1 min-w-[100px]"
          )}
        >
          <FaFileAlt size={18} />
          <span className="px-2">End Contracts</span>
        </Link>
        <Link
          href="/dashboard/employees/probations"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "shadow-sm flex-1 min-w-[100px]"
          )}
        >
          <FaUserClock size={18} />
          <span className="px-2">Probations</span>
        </Link>{" "}
        <Link
          href="/dashboard/employees/cart"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "shadow-sm flex-1 min-w-[100px]"
          )}
        >
          <FaShoppingCart size={18} />
          <span className="px-2">Employee Cart</span>
        </Link>
        <Link
          href="/dashboard/employees/list"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "shadow-sm flex-1 min-w-[100px]"
          )}
        >
          <FaListUl size={18} />
          <span className="px-2">Employee List</span>
        </Link>
        <Link
          href="/dashboard/employees/create"
          className={cn(
            buttonVariants({ variant: "default" }),
            "shadow-sm flex-1 min-w-[100px]"
          )}
        >
          Create
        </Link>
      </div>
      <div className="w-full h-auto flex flex-col">
        <div className="w-full h-auto flex gap-4 flex-col md:flex-row p-4">
          <div className="lg:w-1/3 w-full cart-bg rounded-xl">
            <EmployeeBirthdayDashboard searchParams={searchParams} />
          </div>
          <div className="lg:w-2/3 w-full flex flex-col gap-4">
            <div className="flex gap-4 flex-wrap justify-between">
              <div className="rounded-xl shadow-sm p-4 flex-1 min-w-[130px] cart-bg">
                On vacation
              </div>
              <div className="rounded-xl shadow-sm p-4 flex-1 min-w-[130px] cart-bg">
                Sick Leave
              </div>
              <div className="rounded-xl shadow-sm p-4 flex-1 min-w-[130px] cart-bg">
                On Sites
              </div>
              <div className="rounded-xl shadow-sm p-4 flex-1 min-w-[130px] cart-bg">
                Off
              </div>
            </div>
            <div className="cart-bg rounded-xl p-4 flex-1">Request</div>
          </div>
        </div>
        <div className="flex lg:flex-row flex-col px-4 gap-4">
          <div className="w-full lg:w-2/3 cart-bg rounded-xl">
            <EmployeeProbationsDashboard searchParams={searchParams} />
          </div>
          <div className="w-full lg:w-1/3 cart-bg rounded-xl p-4">
            Staff Mood
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employees;
