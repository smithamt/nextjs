"use client";
import LastElement from "@/components/lastelement";
import DynamicTable, { ColumnType } from "@/components/table/page";
import { Skeleton } from "@/components/ui/skeleton";
import { SalaryType } from "@/types";
import Link from "next/link";

function PayrollSalariesClient({
  saveColumns: sc,
  salaries: s,
  count,
  loading,
}: {
  saveColumns: string;
  salaries: string;
  count: number;
  loading: false;
}) {
  const saveColumns = JSON.parse(sc) as ColumnType<SalaryType>[];
  const salaries = JSON.parse(s) as SalaryType[];

  return (
    <DynamicTable<SalaryType>
      skip={["date"]}
      data={Array.isArray(salaries) ? salaries : []}
      count={count}
      loading={loading}
      lastElement={
        count > salaries.length && (
          <LastElement
            count={count}
            data={salaries.length}
            custom={<SalaryListLoading />}
          />
        )
      }
      title={"salaries"}
      saveColumns={
        saveColumns
          ? [
              {
                name: "employee",
                custom: ({ data }) => (
                  <Link
                    className="hover:underline flex-1 font-semibold text-xs px-2"
                    href={`/dashboard/payroll/salaries/${data.employee._id}`}
                  >
                    {data.employee?.name}
                  </Link>
                ),
              },
              ...saveColumns.filter((s) => s.name !== "employee"),
            ]
          : []
      }
    />
  );
}

export default PayrollSalariesClient;

const SalaryListLoading = ({ ref }: { ref?: any }) => (
  <div ref={ref} className="space-y-4 mt-2 p-2">
    <Skeleton className="w-[250px] h-2 rounded-lg" />
    <Skeleton className="w-[100px] h-2 rounded-lg" />
    <Skeleton className="w-[150px] h-2 rounded-lg" />
  </div>
);
