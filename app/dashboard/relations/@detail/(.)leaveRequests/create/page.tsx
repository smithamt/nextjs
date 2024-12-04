import CreateLeaveRequest from "@/app/dashboard/relations/leaveRequests/create/page";
import { Modal } from "@/components/shared/modal";

function CreateLeaveRequestWithDot({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Modal>
      <CreateLeaveRequest params={params} searchParams={searchParams} />
    </Modal>
  );
}

export default CreateLeaveRequestWithDot;
