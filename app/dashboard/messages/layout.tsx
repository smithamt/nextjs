import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Messages",
  description: "Asia Pacific International Hotel",
  icons: {
    icon: "/vite.svg",
  },
};

export default async function RootLayout({
  children,
  conversations,
}: Readonly<{
  children: React.ReactNode;
  conversations: React.ReactNode | undefined;
}>) {
  return (
    <div className="h-screen w-full flex gap-4 p-4">
      <div className="h-full w-1/3 cart-bg rounded-lg shadow-sm hidden lg:flex flex-col space-y-2 p-2">
        {conversations}
      </div>
      <div className="flex-1 cart-bg rounded-lg shadow-sm">{children}</div>
    </div>
  );
}
