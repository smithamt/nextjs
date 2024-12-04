import type { Metadata } from "next";
import EmployeeMonthViewHeader from "./_components/header";

export const metadata: Metadata = {
  title: "Month",
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
  return (
    <div className="w-full h-screen">
      <EmployeeMonthViewHeader title={"births"} />
      {children}
    </div>
  );
}
