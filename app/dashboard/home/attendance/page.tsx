import { getUser } from "@/data/user";
import { Metadata } from "next";
import { getMyAttendance, getMyTodayShift } from "./action";
import HomeAttendanceClient from "./client";
import HomeAttendanceHeader from "./header";

export const metadata: Metadata = {
  title: "Attendance",
  description: "Asia Pacific International Hotel",
  icons: {
    icon: "/vite.svg",
  },
};

async function HomeAttendance() {
  const user = await getUser();
  if (!user) return;
  const shift = await getMyTodayShift(user);
  const attendance = await getMyAttendance(shift?.date || new Date(), user);

  return (
    <div className="px-8 pt-8 w-full h-screen overflow-y-auto">
      <div className="w-full max-w-[1200px] mx-auto cart-bg rounded-t-lg shadow-m min-h-full">
        <HomeAttendanceHeader />
        <HomeAttendanceClient
          shift={JSON.stringify(shift)}
          attendance={JSON.stringify(attendance)}
        />
      </div>
    </div>
  );
}

export default HomeAttendance;
