import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Asia Pacific International Hotel",
  icons: {
    icon: "/vite.svg",
  },
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode | undefined;
}>) {
  return (
    <>
      {modal}
      <div className="h-screen w-full">{children}</div>
    </>
  );
}
