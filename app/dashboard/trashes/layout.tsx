import type { Metadata } from "next";
import TrashesNavigations from "./_components/nav";

export const metadata: Metadata = {
  title: {
    default: "Trashes",
    template: "%s | Trashes",
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
  return (
    <div className="w-full h-screen">
      <div className="p-2 w-full">
        <p className="font-bold text-lg">Trashes</p>
      </div>
      <div className="w-full h-[calc(100%-20px)] p-6">
        <div className="w-full h-full cart-bg rounded-lg shadow-md">
          <TrashesNavigations />
          <div className="w-full h-[calc(100%-60px)]">{children}</div>
        </div>
      </div>
    </div>
  );
}
