import { DepartmentType } from "@/types";
import DefaultOrganizationChild from "../_components/defaultchild/defaultchild";
import Image from "next/image";

function Allowances({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <DefaultOrganizationChild<DepartmentType>
      columns={[
        {
          name: "name",
          width: 250,
          custom: ({ data: { name, profile, keyword } }) => {
            const src = profile?.image
              ? `/api/images/${profile?.image}/100/100`
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

            return (
              <div className="w-[250px] flex px-2">
                <Image width={50} height={50} src={src} alt="profile" />
                <div className="px-2">
                  <p className="font-semibold">{name}</p>
                  <p className="text-xs">{keyword}</p>
                </div>
              </div>
            );
          },
        },
        { name: "keyword" },
      ]}
      title="departments"
      searchParams={searchParams}
    />
  );
}

export default Allowances;
