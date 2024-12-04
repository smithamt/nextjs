import { EmployeeType } from "@/types";
import Image from "next/image";
import { FC } from "react";
import { CgClose } from "react-icons/cg";

interface ChooseWithProfileProps {
  employee: EmployeeType;
  onRemove: () => void;
}

const ChooseWithProfile: FC<ChooseWithProfileProps> = ({
  employee,
  onRemove,
}) => {
  const src = employee.profile
    ? `/api/images/${employee.profile.image}/40/40`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <div className="flex justify-between font-semibold active-color items-center border p-1 rounded-lg mr-1 mt-1">
      <div className="flex items-center">
        <Image width={40} height={40} src={src} alt={"profile"} />
        <p className="ml-2 font-semibold">{employee.name}</p>
        {employee.nickname && (
          <p className="ml-2 text-xs inactive-text font-semibold">
            ({employee.nickname})
          </p>
        )}
      </div>
      <span
        onClick={onRemove}
        className="center ml-1 w-6 h-6 cursor-pointer active-color-hover rounded-full"
      >
        <CgClose />
      </span>
    </div>
  );
};

export default ChooseWithProfile;
