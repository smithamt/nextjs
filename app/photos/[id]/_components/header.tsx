"use client";
import { useRouter } from "next/navigation";
import { IoIosClose } from "react-icons/io";

function PhotoHeader() {
  const router = useRouter();
  return (
    <div className="p-2 cart-bg flex items-center justify-between shadow-md">
      <p className="font-bold text-lg">Photos</p>
      <div
        onClick={() => router.back()}
        className="cart-bg top-2 left-2 w-10 h-10 rounded-full nav-hover cursor-pointer center"
      >
        <IoIosClose size={30} />
      </div>
    </div>
  );
}

export default PhotoHeader;
