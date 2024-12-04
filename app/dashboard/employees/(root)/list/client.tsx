import LastElement from "@/components/lastelement";
import DynamicTable, { ColumnType } from "@/components/table/page";
import { EmployeeType } from "@/types";

function EmployeesListClient({
  data: d,
  saveColumns: s,
  count,
}: {
  data: string;
  count: number;
  saveColumns: string;
}) {
  const data = JSON.parse(d) as EmployeeType[];
  const saveColumns = JSON.parse(s) as ColumnType<EmployeeType>[];

  return (
    <DynamicTable
      data={data}
      count={count}
      lastElement={
        count > data.length && <LastElement count={count} data={data.length} />
      }
      saveColumns={saveColumns}
      title={"employees"}
    />
  );
}

export default EmployeesListClient;
