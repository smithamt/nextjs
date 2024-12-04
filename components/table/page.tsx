"use client";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { ReactNode, useState } from "react";
import ShowNoText from "../app/nodata";
import CustomColumnTable from "./columns";

export type ColumnType<T> = {
  name: Extract<keyof T, string>;
  headerCls?: string;
  childCls?: string;
  width?: number;
  custom?: ({ data }: { data: T }) => React.ReactNode;
};

export type TableType<T> = {
  data: T[];
  count: number;
  saveColumns?: ColumnType<T>[];
  columns?: ColumnType<T>[];
  border?: boolean;
  lastElement: ReactNode;
  title: string;
  skip?: string[];
  className?: string;
  loading?: boolean;
};

export const toSkip = [
  "_id",
  "id",
  "ref",
  "color",
  "isPublic",
  "profile",
  "__v",
  "company",
  "icon",
  "branch",
  "createdAt",
  "updatedAt",
  "createdBy",
  "department",
  "excludeCountries",
];

const limit = 8;

function DynamicTable<T extends { _id: string; name?: string }>({
  data,
  count,
  columns: ac = [],
  saveColumns = [],
  border = true,
  lastElement,
  title,
  skip = [],
  className,
  loading,
}: TableType<T>) {
  //@ts-ignore
  const dataColumns: ColumnType<T>[] = data[0]
    ? Object.keys(data[0])
        .filter((d) => ![...toSkip, ...skip].includes(d))
        .map((k) => ({ name: k }))
    : [];

  const applicationColumns = ac;

  const columns =
    saveColumns.length > 0
      ? [...applicationColumns, ...saveColumns]
      : [...applicationColumns, ...dataColumns];

  const [currentColumns, setCurrentColumns] =
    useState<ColumnType<T>[]>(columns);

  return (
    <div
      className={cn(
        "w-full h-full overflow-y-hidden overflow-x-auto",
        className
      )}
    >
      {!loading && data.length <= 0 ? (
        <ShowNoText>No {title} found</ShowNoText>
      ) : (
        <>
          <header
            className={cn("flex font-bold p-2 relative", border && "border-b")}
          >
            {currentColumns.map(
              (column, index) =>
                column && (
                  <div
                    key={index}
                    className={cn(
                      "p-2 center",
                      !column.width && "flex-1",
                      column.headerCls
                    )}
                    style={{ width: column.width }}
                  >
                    {column.name
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, column.name[0]?.toUpperCase())}
                  </div>
                )
            )}
            <div className="absolute right-0">
              <CustomColumnTable
                title={title}
                columns={dataColumns}
                currentColumns={currentColumns}
                setCurrentColumns={setCurrentColumns}
              />
            </div>
          </header>
          <div className={cn("h-[calc(100%-50px)] overflow-y-auto")}>
            {loading && lastElement}
            {data.map((d, index) => (
              <div
                key={index}
                className={cn(
                  "flex hover min-h-[60px] center",
                  border && "border-b"
                )}
              >
                {currentColumns.map((column, dataindex) => {
                  if (!column) return;
                  const name = column.name;
                  const item: any = d[name];

                  if (column.custom) return column.custom({ data: d });
                  return (
                    <div
                      style={{ width: column.width }}
                      key={dataindex}
                      className={cn(
                        "font-medium p-2 min-h-full flex items-center",
                        !column.width && "flex-1",
                        border && "border-l",
                        column.childCls,
                        typeof item === "number" && "justify-end"
                      )}
                    >
                      {typeof item === "object"
                        ? item?.name
                        : typeof item === "boolean"
                          ? JSON.stringify(item)
                          : column.name.toLowerCase().includes("date")
                            ? dayjs(item).format("YYYY-MM-DD")
                            : typeof item === "number"
                              ? Number(item.toFixed(2)).toLocaleString("en-us")
                              : item}
                    </div>
                  );
                })}
              </div>
            ))}
            {lastElement}
          </div>
        </>
      )}
    </div>
  );
}

export default DynamicTable;
