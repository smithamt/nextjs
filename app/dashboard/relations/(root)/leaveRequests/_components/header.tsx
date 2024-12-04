import { getLeaveRequestQuery } from "@/app/api/leaveRequests/action";
import ChooseEmployee from "@/components/data/employees/button";
import ExportBtn from "@/components/page";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getUser } from "@/data/user";
import { cn } from "@/lib/utils";
import LeaveRequestModel from "@/models/leaverequests/model";
import Link from "next/link";

async function LeaveRequestHeader({ searchParams }: { searchParams: any }) {
  const user = await getUser();
  if (!user) return;
  const query = await getLeaveRequestQuery(searchParams, user);
  const count = await LeaveRequestModel.countDocuments(query);
  const data = await LeaveRequestModel.find(query);
  const pending = searchParams.pending;
  return (
    <div className="cart-bg mb-2 p-2 rounded-lg shadow mr-2 flex items-center justify-between">
      <p className="font-bold text-lg">Leave Requests {count}</p>
      <div className="flex items-center space-x-2">
        <Link
          href={pending === "true" ? "?pending=false" : "?pending=true"}
          className="flex items-center space-x-2 px-2"
        >
          <Switch checked={pending === "true"} id="pending" />
          <Label htmlFor="pending">Pending</Label>
        </Link>
        <Link
          href="/dashboard/relations/leaveRequests/create"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Create
        </Link>
        <ChooseEmployee
          title="Create For Other"
          to={"/dashboard/relations/leaveRequests/create?employee="}
        />
        <ExportBtn data={JSON.stringify(data)} title={"leaveRequests"} />
      </div>
    </div>
  );
}

export default LeaveRequestHeader;
