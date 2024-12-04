import LastElement from "@/components/lastelement";
import ListCartNavigation from "@/components/navigations/listcart";
import ExportBtn from "@/components/page";
import { ColumnType } from "@/components/table/page";
import { custommodels } from "@/data/models";
import { getUser } from "@/data/user";
import { ADMIN } from "@/roles";
import { cookies } from "next/headers";
import DataCard from "./card";
import OrganizationDefaultChildClientTable from "./clienttable";
import TableColumnModel from "@/models/tables/model";

async function DefaultOrganizationChild<T extends { _id: string }>({
  title,
  searchParams,
  columns = [],
}: {
  title: keyof typeof custommodels;
  searchParams: { [key: string]: string | string[] | undefined };
  columns?: ColumnType<T>[];
}) {
  const user = await getUser();
  if (!user) return;
  const query: any = { isPublic: true };
  if (user.role !== ADMIN) {
    query._id = user.department;
  }

  const page = (searchParams.page || "1") as string;
  const search = (searchParams.search || "") as string;
  const pathname = (searchParams.pathname || "") as string;
  const state = searchParams.state || cookies().get(`${pathname}state`)?.value;

  if (search && typeof search === "string") {
    const searchPattern = new RegExp(search, "i");
    query.$or = [
      { name: { $regex: searchPattern } },
      { keyword: { $regex: searchPattern } },
      { type: { $regex: searchPattern } },
    ];
  }

  const limit = Number(page) * 10;

  const model = custommodels[title];
  const data: T[] = await model.model
    .find(query)
    //@ts-ignore
    .populate(model.populate)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  const count = await model.model.countDocuments(query);
  const tableColumndata = await TableColumnModel.findOne({
    employee: user._id,
    title,
  });

  return (
    <div className="w-full h-full">
      <div className="h-[50px] border-b flex justify-between space-x-2 items-center px-2">
        <ListCartNavigation state={state} />
        <ExportBtn data={JSON.stringify(data)} title={title} />
      </div>
      {state === "cart" ? (
        <div className="overflow-y-auto h-[calc(100vh-140px)] w-full p-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {data.map((d, index) => {
              return <DataCard data={JSON.stringify(d)} key={index} />;
            })}
            {count > data.length && (
              <LastElement count={count} data={data.length} />
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-[calc(100%-50px)]">
          <OrganizationDefaultChildClientTable
            columns={JSON.stringify(columns)}
            data={JSON.stringify(data)}
            saveColumns={JSON.stringify(
              tableColumndata ? tableColumndata.columns : []
            )}
            count={count}
            title={title}
          />
        </div>
      )}
    </div>
  );
}

export default DefaultOrganizationChild;
