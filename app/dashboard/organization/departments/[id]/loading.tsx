"use client";
import SpinLoading from "@/components/loadings/spinloading";
import { usePathname } from "next/navigation";

function Loading() {
  const pathname = usePathname();
  return (
    <>
      {pathname}
      <SpinLoading />
    </>
  );
}

export default Loading;
