import { Modal } from "@/components/shared/modal";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { CgClose } from "react-icons/cg";

function HomeAttendanceLoadingModal() {
  return (
    <Modal>
      <div className="px-8 pt-8 w-full h-screen">
        <div className="max-w-[1200px] mx-auto w-full cart-bg rounded-t-lg shadow-m min-h-full">
          <div className="flex items-center justify-between p-2">
            <Skeleton className="w-40 h-6" />
            <Link
              href={"/dashboard/home"}
              className="w-8 h-8 hover center rounded-full"
            >
              <CgClose />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default HomeAttendanceLoadingModal;
