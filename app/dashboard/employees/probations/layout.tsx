import type { Metadata } from "next";
import EmployeeProbationHeader from "../births/_components/header";

export const metadata: Metadata = {
  title: "Probations",
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
      <EmployeeProbationHeader title={"probations"} />
      {children}
    </div>
  );
}
