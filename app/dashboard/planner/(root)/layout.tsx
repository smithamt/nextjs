import { Metadata } from "next";
import PlannerRootHeader from "./_components/header";

export const metadata: Metadata = {
  title: "Planner",
  description: "Generated by create next app",
  icons: {
    icon: "/vite.svg",
  },
};

function PlannerRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full h-screen">
        <PlannerRootHeader />
        <div className="px-2 h-full">
          <div className="cart-bg rounded-lg h-[calc(100%-120px)] shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

export default PlannerRootLayout;
