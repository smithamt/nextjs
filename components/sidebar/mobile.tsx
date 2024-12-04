"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { routes } from "@/constants/routes/main";
import { roles } from "@/roles";
import Image from "next/image";
import SidebarLink from "./link";
import Logo from "./logo";
import SidebarSettingRoutes from "./setting";

function SidebarMobile({ role }: { role: string }) {
  return (
    <header className="lg:hidden border-b flex justify-between items-center px-4">
      <Logo />
      <nav>
        <Sheet>
          <SheetTrigger>
            <Image src={"/assets/menu.svg"} alt="menu" width={32} height={32} />
          </SheetTrigger>
          <SheetContent className="sm:w-64 p-2">
            <SheetHeader>
              <Logo />
            </SheetHeader>
            {routes
              .filter((i) => {
                const foundRole = roles.find((r) => r.name === role);
                return foundRole && foundRole[i.name];
              })
              .map((route, index) => (
                <SidebarLink expanded route={route} key={index} />
              ))}
            <SidebarSettingRoutes />
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}

export default SidebarMobile;
