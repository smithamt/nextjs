import SpinLoading from "@/components/loadings/spinloading";
import { Modal } from "@/components/shared/modal";

function Loading() {
  return (
    <Modal>
      <SpinLoading />
    </Modal>
  );
}

export default Loading;
