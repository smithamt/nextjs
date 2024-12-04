import { Modal } from "@/components/shared/modal";
import CreateNewEmployee from "../../create/page";

function CreateNewEmployeeModel({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <Modal>
      <CreateNewEmployee searchParams={searchParams} />
    </Modal>
  );
}

export default CreateNewEmployeeModel;
