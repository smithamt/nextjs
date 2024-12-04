import { Input } from "@/components/ui/input";
import { EmployeeType } from "@/types";
import Image from "next/image";
import { FC, useRef, useState } from "react";
import ChooseWithProfile from "../../../app/dashboard/relations/_components/chooseprofile";
import { useQuery } from "@tanstack/react-query";
import { useHasUser } from "@/app/_context/hasuser.context";
import axios from "@/constants/app/axios";
import useClickOutside from "@/app/_hook/outside";

interface ChooseEmployeeProps {
  setEmployees: (data: any[]) => void;
  params?: any;
  employees?: EmployeeType[];
}

const ChooseEmployeeWithInput: FC<ChooseEmployeeProps> = ({
  setEmployees,
  params,
  employees = [],
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { user } = useHasUser();
  const closeRef = useRef(null);

  const { data = [] } = useQuery({
    queryKey: ["choose-employees", user.role, search],
    queryFn: async () => {
      const response = await axios.get("/api/employees/choose", {
        params: { ...params, search },
      });
      return response.data as EmployeeType[];
    },
  });

  const handleOpen = () => setOpen((prev) => !prev);

  useClickOutside(closeRef, () => setOpen(false));

  return (
    <div className="relative">
      <Input
        onFocus={handleOpen}
        type="text"
        value={search}
        onChange={(e) => {
          setOpen(true);
          setSearch(e.target.value);
        }}
        placeholder="Enter employee name or id to choose employee"
        className="outline-[#EEEFF0] border w-full focus:outline-blue-500 outline outline-1 px-2 py-1 rounded-sm mx-auto"
      />
      <div className="flex flex-wrap mt-2">
        {employees.map((i, k) => (
          <ChooseWithProfile
            key={k}
            employee={i}
            onRemove={() =>
              setEmployees(employees.filter((p) => p._id !== i._id))
            }
          />
        ))}
      </div>
      {open && (
        <div
          className="border absolute top-[40px] cart-bg shadow-m w-[500px] z-10 rounded-sm max-h-[600px] overflow-y-auto"
          ref={closeRef}
        >
          {data?.map((i) => {
            const src = i?.profile?.image
              ? `/api/images/${i?.profile?.image}/100/100`
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

            const already = employees.some((e) => e._id === i._id);
            if (already) return;
            return (
              <div
                onClick={() => {
                  setEmployees([...employees, i]);
                  setSearch("");
                  setOpen(false);
                }}
                key={i._id}
                className="flex hover p-1"
              >
                <Image width={50} height={50} src={src} alt={i._id} />
                <p className="p-1">{i.name}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChooseEmployeeWithInput;
