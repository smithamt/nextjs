import FingerprintsDataClient from "./client";
import PlannerFingerprintHeader from "./header";

async function PlannerFingerprints() {
  return (
    <div className="h-screen w-full">
      <PlannerFingerprintHeader />
      <FingerprintsDataClient />
    </div>
  );
}

export default PlannerFingerprints;
