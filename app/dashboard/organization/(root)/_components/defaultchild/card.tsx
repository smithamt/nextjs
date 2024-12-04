"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

function DataCard({ data: d }: { data: string }) {
  const data = JSON.parse(d);
  const pathname = usePathname();
  const router = useRouter();
  return (
    <Card
      onClick={() => router.push(`${pathname}/${data._id}`)}
      className="hover mb-2 mr-2 w-auto"
    >
      <CardHeader className="p-2">
        <div className="flex">
          <Image
            className="rounded-full"
            width={50}
            height={50}
            src={
              data.profile?.image
                ? `/api/images/${data.profile?.image}/100/100`
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            }
            alt="profile"
          />
          <CardTitle className="px-4 text-lg">
            {data.nickname || data.name}
          </CardTitle>
        </div>
        <CardDescription>{data.employeeId}</CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <p>Card Content</p>
      </CardContent>
      <CardFooter className="p-2">
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  );
}

export default DataCard;
