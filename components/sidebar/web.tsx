import { roles } from "@/roles";
import { RouteType } from "@/types";
import SidebarLink from "./link";
import Logo from "./logo";
import SidebarProfile from "./profile";
import SidebarSettingRoutes from "./setting";

function SidebarWeb({ user, routes }: { user: any; routes: RouteType[] }) {
  return (
    <aside className="hidden lg:flex lg:flex-col xl:max-w-48 xl:min-w-48 max-w-14 min-w-14 border-r h-screen px-1 cart-bg">
      <Logo />
      <SidebarProfile user={user} />
      <nav className="flex flex-col h-screen">
        <div className="flex-1 space-y-1">
          {routes
            .filter((i) => {
              const foundRole = roles.find((r) => r.name === user.role);
              return foundRole && foundRole[i.name];
            })
            .map((route, index) => (
              <SidebarLink route={route} key={index} />
            ))}
        </div>
        <SidebarSettingRoutes />
      </nav>
    </aside>
  );
}

export default SidebarWeb;
