"use client";
import DynamicTable, { ColumnType } from "@/components/table/page";
import ListLastElement from "../listlastelement";
import Image from "next/image";
import { ProfileType } from "@/types";

function OrganizationDefaultChildClientTable<
  T extends { _id: string; name?: string; profile?: ProfileType },
>({
  columns: c = "[]",
  data: d,
  saveColumns: sc = "[]",
  count,
  title,
}: {
  columns: string;
  data: string;
  saveColumns: string;
  count: number;
  title: string;
}) {
  const columns = JSON.parse(c) as ColumnType<T>[];
  const saveColumns = JSON.parse(sc) as ColumnType<T>[];
  const data = JSON.parse(d) as T[];

  return (
    <DynamicTable<T>
      columns={[
        {
          //@ts-ignore
          name: "",
          headerCls: "w-0",
          width: 1,
          custom: ({ data }) => {
            const profile = data.profile
            const src = profile?.image
              ? `/api/images/${profile.image}/300/300`
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

            return (
              <div className="pl-2">
                <Image width={50} height={50} src={src} alt={""} />
              </div>
            );
          },
        },
        ...columns,
      ]}
      data={data}
      saveColumns={saveColumns}
      count={count}
      title={title}
      lastElement={
        count > data.length && (
          <ListLastElement count={count} data={data.length} />
        )
      }
    />
  );
}

export default OrganizationDefaultChildClientTable;
