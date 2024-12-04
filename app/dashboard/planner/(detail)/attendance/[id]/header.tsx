"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";

function PlannerAttendanceDetailHeader() {
  const router = useRouter();
  return (
    <div className="px-4 py-2 flex items-center justify-between">
      <p className="font-bold text-lg">Planner Detail</p>
      <Button
        variant={"outline"}
        onClick={() => router.back()}
        className="hover p-2 rounded-full"
      >
        <IoClose size={20} />
      </Button>
    </div>
  );
}

export default PlannerAttendanceDetailHeader;
