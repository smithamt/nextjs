import { Modal } from "@/components/shared/modal";
import CreateTermination from "../../../terminations/create/page";

function CreateLeaveRequestWithDot({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Modal>
      <CreateTermination params={params} searchParams={searchParams} />
    </Modal>
  );
}

export default CreateLeaveRequestWithDot;
