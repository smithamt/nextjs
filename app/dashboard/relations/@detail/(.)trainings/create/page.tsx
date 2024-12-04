import { Modal } from "@/components/shared/modal";
import CreateTraining from "../../../trainings/create/page";

function CreateLeaveRequestWithDot({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Modal>
      <CreateTraining params={params} searchParams={searchParams} />
    </Modal>
  );
}

export default CreateLeaveRequestWithDot;
