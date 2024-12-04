import Image from "next/image";
import Link from "next/link";

function Logo() {
  return (
    <Link
      className="capitalize space-y-1 p-2 cursor-pointer flex items-center"
      href={"/dashboard/home"}
    >
      <Image width={45} height={45} src={"/vite.svg"} alt={"logo"} />
      <span className="px-2 text-lg font-semibold">APIH</span>
    </Link>
  );
}

export default Logo;
