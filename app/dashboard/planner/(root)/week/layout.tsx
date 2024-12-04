import { getWeek } from "@/lib/utils";
import dayjs from "dayjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Week Planner",
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
  const week = getWeek(new Date(), Number(0));

  return (
    <div className="w-full h-full">
      <div className="flex h-10">
        <p className="text-center w-40 border-x font-semibold p-2">Employee</p>
        {week.map((day, index) => (
          <p
            className="text-center flex-1 border-r font-semibold p-2"
            key={index}
          >
            {dayjs(day).format("D")}
          </p>
        ))}
      </div>
      {children}
    </div>
  );
}
