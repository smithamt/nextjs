import { Loader2 } from "lucide-react";

function SpinLoading() {
  return (
    <div className="h-full w-full center">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    </div>
  );
}

export default SpinLoading;
