import { Modal } from "@/components/shared/modal";
import CreateWarning from "../../../warnings/create/page";

function CreateLeaveRequestWithDot({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Modal>
      <CreateWarning params={params} searchParams={searchParams} />
    </Modal>
  );
}

export default CreateLeaveRequestWithDot;
