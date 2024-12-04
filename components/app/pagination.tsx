"use client";
import { buttonVariants } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

function PaginationComponent({
  count,
  initialSize = 10,
}: {
  count: number;
  initialSize: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const page = Number(searchParams.get("page") || "1");
  const size = Number(searchParams.get("size") || initialSize);

  const last =
    count / size > 5 ? 4 : count / size < 5 ? Math.ceil(count / size) : 5;

  const previous = page === 1 ? page : page - 1;
  const next = size * page < count ? page + 1 : page;

  const currentParams = new URLSearchParams(searchParams.toString());

  const nexturl = (next: string) => {
    const url = currentParams;
    url.set("page", next);
    url.set("size", size.toString());
    return pathname + "?" + url.toString();
  };

  return (
    <Pagination>
      <PaginationContent>
        <Link
          href={nexturl(previous.toString())}
          aria-label="Go to previous page"
          className={cn(
            buttonVariants({
              variant: "ghost",
              className: "gap-1 pl-2.5 hover",
            })
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Link>
        {page > 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {new Array(last).fill(null).map((_, k) => {
          const currentPage =
            page > 4 && count / size > 5 ? k + page - 2 : k + 1;

          return (
            <PaginationItem key={k}>
              <Link
                href={nexturl(currentPage.toString())}
                className={cn(
                  buttonVariants({
                    variant: currentPage === page ? "outline" : "ghost",
                  })
                )}
              >
                {currentPage}
              </Link>
            </PaginationItem>
          );
        })}
        {count / size > 5 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <Link
            href={nexturl(next.toString())}
            aria-label="Go to next page"
            className={cn(
              buttonVariants({
                variant: "ghost",
                className: "gap-1 pr-2.5",
              })
            )}
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationComponent;
