"use client";
import { useRouter } from "next/navigation";
import { IoArrowBackOutline } from "react-icons/io5";

function FingerprintBackBtn() {
  const router = useRouter();
  return (
    <div className="flex items-center p-2">
      <p
        onClick={() => router.back()}
        className="w-10 h-10 rounded-full center cursor-pointer hover:bg-black/5"
      >
        <IoArrowBackOutline size={20} />
      </p>
      <div className="hidden lg:inline text-lg font-semibold px-4 capitalize">
        <p className="font-semibold">Fingerprints</p>
      </div>
    </div>
  );
}

export default FingerprintBackBtn;
