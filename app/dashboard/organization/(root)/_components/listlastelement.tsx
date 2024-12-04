"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { getRandomWidth } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

function ListLastElement({ count, data }: { count: number; data: number }) {
  const { ref, inView } = useInView();
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = Number(searchParams.get("page") || "1");
  const size = Number(searchParams.get("size") || "10");

  useEffect(() => {
    if (inView) if (count > data) router.push(`?page=${page + 1}&size=${size}`);
  }, [inView, data, page, router, size, count]);

  return (
    <div className="rounded-lg p-2" ref={ref}>
      <Skeleton
        className="h-3 rounded-lg ml-4 mt-1"
        style={{ width: getRandomWidth([100, 150, 120]) }}
      />
      <Skeleton className="h-3 rounded-lg ml-4 mt-1 w-20" />
    </div>
  );
}

export default ListLastElement;
