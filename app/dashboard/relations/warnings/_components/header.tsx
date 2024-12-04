"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";

function RelationWarningHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const activePubliched = pathname.includes(
    "/dashboard/relations/warnings/published"
  );
  const activeExpired = pathname.includes(
    "/dashboard/relations/warnings/expired"
  );

  return (
    <div className="p-4 w-full h-16 border-b flex items-center justify-between">
      <div className="space-x-2">
        <Link
          href={"/dashboard/relations/warnings/published"}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-none",
            activePubliched && "active-color active-color-hover"
          )}
        >
          Published
        </Link>
        <Link
          href={"/dashboard/relations/warnings/expired"}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "border-none",
            activeExpired && "active-color active-color-hover"
          )}
        >
          Expired
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <Link
          href={"/dashboard/relations/warnings/create"}
          className={cn(buttonVariants({ variant: "default" }))}
        >
          New Warning
        </Link>
        <div
          onClick={() => router.back()}
          className="hover w-10 h-10 rounded-full center"
        >
          <IoClose size={20} />
        </div>
      </div>
    </div>
  );
}

export default RelationWarningHeader;
