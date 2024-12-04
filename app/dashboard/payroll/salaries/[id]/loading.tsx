import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";

const EmpPayroll = () => {
  const container = "cart-bg px-4 py-2 rounded-lg mb-2";

  return (
    <div className="p-2 h-screen overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center p-2">
          <Link
            href={"/dashboard/payroll/salaries"}
            className="w-10 h-10 rounded-full center cursor-pointer hover:bg-black/5"
          >
            <IoArrowBackOutline size={20} />
          </Link>
          <Skeleton className="w-[250px] h-6" />
        </div>
      </div>
      <div className="flex max-w-[1200px] mx-auto w-full">
        <div className="w-[70%] pr-4 ">
          <div className={container}>
            <div className="flex items-center justify-between mb-2">
              <p className="font-bold text-lg">Basic Salary</p>
              <Skeleton className="w-20 h-6" />
            </div>
            {[1, 2, 3].map((_, k) => {
              return <Skeleton key={k} className="w-20 h-6" />;
            })}
          </div>
          <div className={container}>
            <p className="font-bold text-lg">Attendances</p>
            <Skeleton className="w-20 h-6" />
            <Skeleton className="w-20 h-6" />
            <Skeleton className="w-20 h-6" />
            <Skeleton className="w-20 h-6" />
            <Skeleton className="w-20 h-6" />
            <Skeleton className="w-20 h-6" />
            <Skeleton className="w-20 h-6" />
            <Skeleton className="w-20 h-6" />
          </div>
          <div className={container}>
            <p className="font-bold text-lg">Allowances</p>
            <HeaderCom type={""} />
            <Skeleton className="w-20 h-6" />
            <p className="font-bold text-lg">Deductions</p>
            <HeaderCom type={""} />
            <Skeleton className="w-20 h-6" />
          </div>
          <p className="font-bold text-lg">Gross Payable</p>
          <Skeleton className="w-20 h-6" />
        </div>
        <div className="w-[30%]">
          <div className="cart-bg rounded-lg px-4 py-2">
            <p>Payment history</p>
            <p className="text-xs text-blue-600 hover:underline cursor-pointer">
              View Payment History
            </p>
          </div>
          <>
            <Button className="w-full mt-2">Print</Button>
            <Skeleton className="w-20 h-6" />
          </>
        </div>
      </div>
    </div>
  );
};

export default EmpPayroll;

const HeaderCom = ({ type }: { type: string }) => {
  return (
    <div className="flex items-center justify-between px-2 py-2 font-semibold text-xs">
      <p className="w-[200px]">Type</p>
      <p>Total {type}</p>
      <p>Total Amount</p>
    </div>
  );
};
