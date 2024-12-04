import BackArrowWithTitle from "@/components/app/arrow";
import ChooseData from "@/components/data/choose/page";
import SearchInput from "@/components/input/search";

function FingerprintsUserHeader() {
  return (
    <div className="flex items-center justify-between pr-2">
      <BackArrowWithTitle to="/dashboard/planner/week">
        Manage Fingerprint Users
      </BackArrowWithTitle>
      <div className="flex items-center gap-2">
        <ChooseData title="fingerprints" state={"fingerprints"} />
        <SearchInput />
      </div>
    </div>
  );
}

export default FingerprintsUserHeader;
