import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payroll",
  description: "Asia Pacific International Hotel",
  icons: {
    icon: "/vite.svg",
  },
};

export default async function PayrollRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="h-full w-full">{children}</main>;
}
