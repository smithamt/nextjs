"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";

function NavigateToBack() {
  const router = useRouter();
  return (
    <Button variant={"ghost"} onClick={() => router.back()} className="hover p-2 rounded-full">
      <IoClose size={20} />
    </Button>
  );
}

export default NavigateToBack;
