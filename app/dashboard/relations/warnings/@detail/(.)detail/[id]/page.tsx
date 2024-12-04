import { Modal } from "@/components/shared/modal";
import RelationWarningDetail from "../../../detail/[id]/page";

async function InterRoutePage({ params }: { params: { id: string } }) {
  return (
    <Modal>
      <RelationWarningDetail params={params} />
    </Modal>
  );
}

export default InterRoutePage;
