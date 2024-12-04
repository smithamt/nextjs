import SidebarMobile from "@/components/sidebar/mobile";
import SidebarWeb from "@/components/sidebar/web";
import { Toaster } from "@/components/ui/toaster";
import { routes } from "@/constants/routes/main";
import { getUser } from "@/data/user";
import CompanyModel from "@/models/companies/model";
import { ADMIN, ADMIN_HOD_EDITOR } from "@/roles";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import Login from "../(auth)/login/page";
import ConversationModel from "../../models/conversations/model";
import LeaveRequestModel from "../../models/leaverequests/model";
import UserNotification from "../../models/notifications/model";
import PromotionRequestModel from "../../models/promotions/model";
import ResignationModel from "../../models/resignations/model";
import WarningModel from "../../models/warnings/model";
import { PopupProvider } from "../_context/dialog";
import { HasUserProvider } from "../_context/hasuser.context";
import { SocketProvider } from "../_context/socket.context";
import { CustomQueryClientProvider } from "../_context/tanstack";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "APIH",
  description: "Asia Pacific International Hotel",
  icons: {
    icon: "/vite.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = cookies().get("theme")?.value || "dark";
  const user = await getUser();

  if (!user)
    return (
      <main className="flex lg:flex-row flex-col">
        <Login searchParams={{}} />
      </main>
    );

  let r = routes;
  r = await Promise.all(
    routes.map(async (route) => {
      if (route.name === "notifications") {
        const noticount = await UserNotification.countDocuments({
          isPublic: true,
        });
        return { ...route, noti: noticount };
      } else if (route.name === "messages") {
        const conversationscount = await ConversationModel.countDocuments({
          isPublic: true,
          lastMessageRead: { $in: user._id },
        });
        return { ...route, noti: conversationscount };
      } else if (route.name === "relations") {
        const query: any = { isPublic: true, status: "pending" };
        if (user.role !== ADMIN) query.department = user.department;
        if (!ADMIN_HOD_EDITOR.includes(user.role)) query.employee = user._id;

        const conversationscount =
          await LeaveRequestModel.countDocuments(query);
        const warningcount = await WarningModel.countDocuments(query);
        const resignationcount = await ResignationModel.countDocuments(query);
        const promotioncount =
          await PromotionRequestModel.countDocuments(query);

        return {
          ...route,
          noti:
            conversationscount +
            warningcount +
            resignationcount +
            promotioncount,
        };
      } else {
        return route;
      }
    })
  );

  const c = await CompanyModel.findById(user.company);
  if (!c) return;
  const company = c.toObject();

  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <HasUserProvider
        company={JSON.stringify(company)}
        user={JSON.stringify(user)}
      >
        <SocketProvider>
          <CustomQueryClientProvider>
            <PopupProvider>
              <body data-theme={theme} className="w-full h-full">
                <main className="flex lg:flex-row flex-col">
                  <SidebarWeb routes={r} user={user} />
                  <SidebarMobile role={user.role} />
                  {children}
                </main>
                <Toaster />
              </body>
            </PopupProvider>
          </CustomQueryClientProvider>
        </SocketProvider>
      </HasUserProvider>
    </html>
  );
}
