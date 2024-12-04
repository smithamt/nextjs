import type { Metadata } from "next";
import React from "react";
import EmployeeRootHeader from "./_components/header";

export const metadata: Metadata = {
  title: "Employee",
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
    <main className="w-full h-screen">
      <EmployeeRootHeader />
      <div className="w-full h-[calc(100%-50px)]">{children}</div>
    </main>
  );
}
