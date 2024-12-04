"use client";
import { useRouter } from "next/navigation";
import { CgClose } from "react-icons/cg";

function HomeAttendanceHeader() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-between py-2 px-4">
      <p className="font-semibold px-2 text-lg">Today Attendance</p>
      <p
        onClick={() => router.back()}
        className="w-8 h-8 hover center rounded-full"
      >
        <CgClose />
      </p>
    </div>
  );
}

export default HomeAttendanceHeader;
