"use client";

import DynamicTable from "@/components/table/page";

function PlannerDayClient({
  data: d,
  saveColumns: s,
}: {
  data: string;
  saveColumns: string;
}) {
  const data = JSON.parse(d);
  const saveColumns = JSON.parse(s);
  return (
    <DynamicTable
      data={data}
      count={data.length}
      saveColumns={saveColumns}
      lastElement={undefined}
      title={"attendances"}
    />
  );
}

export default PlannerDayClient;
