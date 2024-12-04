import ChooseData from "@/components/data/choose/page";
import SearchInput from "@/components/input/search";
import OpenDateRange from "@/components/others/OpenDateRange";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import FingerprintBackBtn from "./back";

function PlannerFingerprintHeader() {
  return (
    <div className="flex items-center justify-between p-2">
      <FingerprintBackBtn />
      <div className="flex items-center gap-2">
        <div className="flex items-center mr-2 gap-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Pending</Label>
        </div>
        <SearchInput />
        <OpenDateRange />
        <ChooseData title="departments" state={"fingerprints"} />
      </div>
    </div>
  );
}

export default PlannerFingerprintHeader;
