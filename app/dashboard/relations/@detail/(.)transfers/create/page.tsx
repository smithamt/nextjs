import { Modal } from "@/components/shared/modal";
import CreateTransfer from "../../../transfers/create/page";

function CreateLeaveRequestWithDot({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Modal>
      <CreateTransfer params={params} searchParams={searchParams} />
    </Modal>
  );
}

export default CreateLeaveRequestWithDot;
