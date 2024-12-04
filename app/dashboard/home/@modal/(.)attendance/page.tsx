import { Modal } from "@/components/shared/modal";
import HomeAttendance from "../../attendance/page";

async function HomeAttendanceModal() {
  return (
    <Modal>
      <HomeAttendance />
    </Modal>
  );
}

export default HomeAttendanceModal;
