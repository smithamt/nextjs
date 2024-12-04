import LastElement from "@/components/lastelement";
import DynamicTable, { ColumnType } from "@/components/table/page";
import { Skeleton } from "@/components/ui/skeleton";
import { LeaveAdjustmentType } from "@/types";

function AdjustmentsLeavesClientList({
  data: d,
  count,
  saveColumns: s,
}: {
  data: string;
  count: number;
  saveColumns: string;
}) {
  const data = JSON.parse(d);
  const saveColumns = JSON.parse(s) as ColumnType<
    LeaveAdjustmentType & { _id: string }
  >[];
  return (
    <DynamicTable
      data={data}
      count={count}
      saveColumns={saveColumns}
      lastElement={
        count > data.length && (
          <LastElement
            custom={<Skeleton className="w-40 h-6" />}
            className="h-20 mt-2"
            count={count}
            data={data.length}
          />
        )
      }
      title={"leaveAdjustments"}
    />
  );
}

export default AdjustmentsLeavesClientList;
