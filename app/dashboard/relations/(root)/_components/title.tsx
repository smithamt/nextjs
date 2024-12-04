"use client";
import { usePathname } from "next/navigation";

function RelationTitles() {
  const pathname = usePathname();
  const title = pathname.split("/")[3];
  return (
    <p className="font-bold text-lg px-2 whitespace-nowrap">
      {title.replace(/([A-Z])/g, " $1").replace(/^./, title[0]?.toUpperCase())}
    </p>
  );
}

export default RelationTitles;
