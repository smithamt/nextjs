import { getRole } from "@/data/user";
import type { Metadata } from "next";
import AdjustmentSidebar from "../_components/header";

export const metadata: Metadata = {
  title: {
    default: "Adjustments",
    template: "$s | Adjustments",
  },
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
  const role = await getRole();
  return (
    <div className="h-screen w-full">
      <div className="p-4 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold">Adjustments</p>
          <p className="inactive-text">
            Adjust all leaves, holidays and more..
          </p>
        </div>{" "}
      </div>
      <div className="flex w-full pl-2 h-[calc(100%-50px)]">
        <AdjustmentSidebar role={role} />
        <div className="flex-1 w-full h-[calc(100%-20px)] overflow-y-auto">
          <div className="max-w-[1000px] h-full mx-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
