import Link from "next/link";
import { FC, ReactNode } from "react";
import { IoArrowBackOutline } from "react-icons/io5";

interface BackArrowWithTitleProps {
  to: string;
  children: ReactNode;
}

const BackArrowWithTitle: FC<BackArrowWithTitleProps> = ({ to, children }) => {
  return (
    <div className="flex items-center p-2">
      <Link
        href={to}
        className="w-10 h-10 rounded-full center cursor-pointer hover:bg-black/5"
      >
        <IoArrowBackOutline size={20} />
      </Link>
      <div className="hidden lg:inline text-lg font-semibold px-4 capitalize">
        {children}
      </div>
    </div>
  );
};

export default BackArrowWithTitle;
