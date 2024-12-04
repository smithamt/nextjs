import EmployeeProfile from "@/components/profile/page";
import { Button } from "@/components/ui/button";
import { ImageCollectionType } from "@/types";
import Image from "next/image";
import { FC } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface ImagesProps {
  data: ImageCollectionType;
}

const Images: FC<ImagesProps> = ({ data }) => {
  return (
    <div className="h-full w-full flex">
      <div className="relative w-[70%] h-full bg-black">
        <div className="w-full absolute top-1/2 flex justify-between p-4">
          <div className="cart-bg w-10 h-10 rounded-full nav-hover cursor-pointer center">
            <IoIosArrowBack size={20} />
          </div>
          <div className="cart-bg w-10 h-10 rounded-full nav-hover cursor-pointer center">
            <IoIosArrowForward size={20} />
          </div>
        </div>
        <div className="w-full h-full p-8">
          <Image
            fill
            src={`/api/images/${data.images[0]}/original/original`}
            alt="image detail"
            className="object-contain"
          />
        </div>
      </div>
      <div className="p-2">
        {/* {JSON.stringify(data)} */}
        {data.author && (
          <EmployeeProfile
            to="/"
            employee={data.author}
            description={data.description}
          />
        )}
        <Button variant={"print"} className="w-[150px]">
          Print
        </Button>
      </div>
    </div>
  );
};

export default Images;
