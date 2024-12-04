import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Relations",
  description: "Asia Pacific International Hotel",
  icons: { icon: "/vite.svg" },
};

export default async function RootLayout({
  children,
  detail,
}: Readonly<{
  children: React.ReactNode;
  detail: ReactNode | undefined;
}>) {
  return (
    <>
      {detail}
      {children}
    </>
  );
}
