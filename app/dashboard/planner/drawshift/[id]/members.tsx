import { Footer } from "@/app/_context/footer";
import { useInfiniteData } from "@/app/_hook/useInfiniteData";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmployeeType } from "@/types";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { FC, useState } from "react";
import { CgClose } from "react-icons/cg";

interface PopupMembersProps {
  initialData: any[];
  existingData?: string[];
  onConfirm: (data: any[]) => void;
  isEmployee?: boolean;
  fetchQuery?: any;
}

const PopupMembers: FC<PopupMembersProps> = ({
  initialData,
  onConfirm,
  existingData,
  fetchQuery = {},
  isEmployee = false,
}) => {
  const [search, setSearch] = useState("");
  const [selectedData, setSelectedData] = useState<EmployeeType[]>([]);

  const {
    data: employees,
    loading,
    queryKey,
    lastElementRef,
  } = useInfiniteData<EmployeeType>({
    keys: "employees/choose",
    size: 20,
    params: { search, fetchQuery },
  });

  return (
    <>
      <div className="flex h-[calc(60vh-68px)] mb-2">
        <div className="w-2/3 h-full p-2">
          <div className="relative w-40 mr-2 lg:w-80">
            <SearchIcon className="absolute top-0 bottom-0 w-4 mx-1 h-4 my-auto text-gray-500 left-3" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by name or id number"
              className="pl-12 pr-4"
            />
            {search && (
              <span
                className="cursor-pointer absolute top-1/3 right-4 mx-auto"
                onClick={() => setSearch("")}
              >
                <CgClose />
              </span>
            )}
          </div>
          <div className="h-2" />
          <div className="h-[90%] overflow-y-auto w-full px-2">
            {loading && <Skeleton className="w-44 h-4" />}
            {employees.map((employee, index) => {
              const include = selectedData.some((e) => e._id === employee._id);

              const src = employee.profile
                ? `/api/images/${employee.profile.image}/40/40`
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

              return (
                <div
                  ref={index === employees.length - 1 ? lastElementRef : null}
                  key={index}
                  onClick={() => {
                    setSelectedData((prev) =>
                      include
                        ? prev.filter((pre) => pre._id !== employee._id)
                        : [...prev, employee]
                    );
                  }}
                  className="flex items-center mb-2 justify-between"
                >
                  <div className="flex items-center">
                    <Image className="rounded-full" width={40} height={40} src={src} alt={"profile"} />
                    <p className="ml-2 font-semibold">{employee.name}</p>
                    {employee.nickname && (
                      <p className="ml-2 text-xs inactive-text font-semibold">
                        ({employee.nickname})
                      </p>
                    )}
                  </div>
                  <div className="w-6 h-6 mr-2 border rounded-lg cursor-pointer center text-green-500 font-bold">
                    {include && "✔"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="w-1/3 flex flex-col overflow-y-auto">
          {selectedData.map((employee, index) => {
            const src = employee.profile
              ? `/api/images/${employee.profile.image}/40/40`
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

            return (
              <div key={index} className="flex justify-between font-semibold active-color items-center border p-1 rounded-lg mr-1 mt-1">
                <div key={index} className="flex items-center">
                  <Image className="rounded-full" width={40} height={40} src={src} alt={"profile"} />
                  <p className="ml-2 font-semibold">{employee.name}</p>
                  {employee.nickname && (
                    <p className="ml-2 text-xs inactive-text font-semibold">
                      ({employee.nickname})
                    </p>
                  )}
                </div>
                <span
                  onClick={() => {
                    setSelectedData((prev) =>
                      prev.filter((i) => i._id !== employee._id)
                    );
                  }}
                  className="center ml-1 w-6 h-6 cursor-pointer active-color-hover rounded-full"
                >
                  <CgClose />
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <Footer onConfirm={() => onConfirm(selectedData)} />
    </>
  );
};

export default PopupMembers;
