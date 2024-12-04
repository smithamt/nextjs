"use client";
import SidebarLink from "@/components/sidebar/link";
import { Button } from "@/components/ui/button";
import { adjustmentsroutes } from "@/constants/routes/adjustments";
import { cn } from "@/lib/utils";
import { roles } from "@/roles";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect, useState } from "react";

function AdjustmentSidebar({ role }: { role: string }) {
  const [expanded, setExpanded] = useState(true);

  const windowSize = useWindowSize();

  useEffect(() => {
    if (windowSize.width && windowSize.width < 1224) setExpanded(false);
    if (windowSize.width && windowSize.width > 1224) setExpanded(true);
  }, [windowSize.width]);

  return (
    <nav
      className={cn(
        "flex flex-col space-y-1 p-2 min-h-full relative border-b px-10",
        expanded && "w-[25%]"
      )}
    >
      {adjustmentsroutes
        .filter((i) => {
          const foundRole = roles.find((r) => r.name === role);
          return foundRole && foundRole[i.name];
        })
        .map((route, index) => (
          <SidebarLink route={route} key={index} />
        ))}
      <Button
        onClick={() => setExpanded(!expanded)}
        variant={"ghost"}
        className="w-[36px] p-1 hover absolute bottom-2 right-2"
      >
        {expanded ? (
          <ChevronsLeft className="w-6" />
        ) : (
          <ChevronsRight className="w-6" />
        )}
      </Button>
    </nav>
  );
}

export default AdjustmentSidebar;

function useWindowSize() {
  const [windowSize, setWindowSize] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
