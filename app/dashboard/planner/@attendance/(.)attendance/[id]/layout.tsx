import PlannerAttendanceDetailLayout from "@/app/dashboard/planner/(detail)/attendance/[id]/layout";
import { Modal } from "@/components/shared/modal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Generate Attendance",
  description: "Generated by create next app",
  icons: {
    icon: "/vite.svg",
  },
};

async function PlannerAttendanceDetailLayoutDot({
  params,
  children,
}: {
  params: { id: string };
  children: React.ReactNode;
}) {
  return (
    <Modal>
      <PlannerAttendanceDetailLayout params={params}>
        {children}
      </PlannerAttendanceDetailLayout>
    </Modal>
  );
}

export default PlannerAttendanceDetailLayoutDot;
