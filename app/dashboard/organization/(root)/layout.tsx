import { getRole } from "@/data/user";
import type { Metadata } from "next";
import OrganizationHeader from "./_components/header";
import OrganizationSidebar from "./_components/sidebar/page";

export const metadata: Metadata = {
  title: "Organization",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const role = await getRole();
  return (
    <div className="w-full h-screen">
      <OrganizationHeader />
      <div className="flex h-full w-full">
        <OrganizationSidebar role={role} />
        <div className="h-[calc(100%-80px)] w-full pr-2 pb-2">
          <div className="w-full h-full cart-bg rounded-lg shadow-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
