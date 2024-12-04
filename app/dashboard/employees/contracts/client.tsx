"use client";
import BackArrowWithTitle from "@/components/app/arrow";
import ChooseEmployee from "@/components/data/employees/button";
import LastElement from "@/components/lastelement";
import DynamicTable from "@/components/table/page";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getRandomWidth } from "@/lib/utils";
import { EmployeeContractType } from "@/types";
import Image from "next/image";

function EmployeeContractClient({
  contracts: c,
  count,
}: {
  contracts: string;
  count: number;
}) {
  const contracts = JSON.parse(c) as EmployeeContractType[];

  return (
    <div className="w-full h-screen">
      <div className="flex items-center justify-between px-2">
        <BackArrowWithTitle to="/dashboard/employees">
          Contracts
        </BackArrowWithTitle>
        <ChooseEmployee title="Create Contract" to={"/dashboard/employees/contracts/create/"} />
      </div>
      <DynamicTable
        className="h-[calc(100%-70px)]"
        skip={["employee"]}
        data={contracts}
        count={count}
        columns={[
          {
            name: "employee",
            custom: ({ data }) => {
              const src = data.employee?.profile
                ? `/api/images/${data.employee.profile?.image}/100/100`
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

              return (
                <div className="flex hover:underline cursor-pointer w-[250px] px-2">
                  <Image
                    width={40}
                    height={40}
                    className="rounded-full max-w-[40px] max-h-[40px]"
                    src={src}
                    alt="@profile"
                  />
                  <div className="px-2">
                    <p>
                      {data.employee?.name}{" "}
                      <span className="inactive-text text-xs">
                        {data.employee?.employeeId}
                      </span>
                    </p>
                    <p>{data.employee?.position?.name}</p>
                  </div>
                </div>
              );
            },
          },
        ]}
        lastElement={
          count > contracts.length && (
            <LastElement
              custom={
                <div className="flex p-2">
                  <Skeleton className="w-[44px] h-[44px] rounded-full" />
                  <div className="px-1">
                    <Skeleton
                      className="h-3 rounded-sm mt-1"
                      style={{ width: getRandomWidth([100, 150, 120]) }}
                    />
                    <Skeleton className="h-3 rounded-sm mt-1 w-20" />
                  </div>
                </div>
              }
              data={contracts.length}
              count={count}
            />
          )
        }
        title={"contracts"}
      />
    </div>
  );
}

export default EmployeeContractClient;
