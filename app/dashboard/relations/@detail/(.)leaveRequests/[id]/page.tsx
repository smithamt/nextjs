import RelationsLeaveRequestDetail from "@/app/dashboard/relations/leaveRequests/[id]/page";
import { Modal } from "@/components/shared/modal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LeaveRequests Detail",
  description: "Asia Pacific International Hotel",
  icons: { icon: "/vite.svg" },
};

function CreateLeaveRequestWithDot({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <RelationsLeaveRequestDetail params={params} />
    </Modal>
  );
}

export default CreateLeaveRequestWithDot;
