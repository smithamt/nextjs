"use client";
import { useHasUser } from "@/app/_context/hasuser.context";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/constants/app/axios";
import { cn } from "@/lib/utils";
import { ADMIN } from "@/roles";
import { AppraisalType } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BsThreeDots } from "react-icons/bs";
import { IoArrowBackOutline } from "react-icons/io5";

function EmployeeAppraisalsDetailHeader({ data: d }: { data: string }) {
  const { user } = useHasUser();
  const router = useRouter();
  const { toast } = useToast();
  const data = JSON.parse(d) as AppraisalType;

  const totalSum = data.evaluations.reduce((sum, item) => sum + item.rating, 0);
  // Count the ratings
  const totalCount = data.evaluations.length;
  // Calculate the average
  const averageRating = totalSum / totalCount;

  return (
    <div className="flex justify-between">
      <div className="flex">
        <Button
          onClick={() => router.back()}
          variant={"outline"}
          className="w-10 h-10 p-0 rounded-full border-none center cursor-pointer hover:bg-black/5"
        >
          <IoArrowBackOutline size={20} />
        </Button>
        <div className="px-4">
          <p className="font-bold">{data.employee.name}</p>
          <div>
            <span>{data.employee.department?.name}</span> |{" "}
            <span>{data.employee.position?.name}</span>
          </div>
        </div>
      </div>
      <div className="space-x-2 flex items-center">
        <Badge variant={data.status}>{data.status}</Badge>
        {ADMIN === user.role && (
          <>
            <Link
              href={`/dashboard/employees/endcontracts/create/${data.employee._id}?refId=${data.refId}&score=${averageRating.toFixed(1)}`}
              className={cn(buttonVariants({ variant: "destructive" }))}
            >
              End Contract
            </Link>
            <Link
              className={cn(buttonVariants({ variant: "default" }))}
              href={`/dashboard/employees/contracts/create/${data.employee._id}?refId=${data.refId}&score=${averageRating.toFixed(1)}`}
            >
              {data.refId === "probation-end"
                ? "Permit"
                : data.refId.includes("year-end")
                  ? "Renewal Contract"
                  : ""}
            </Link>
          </>
        )}
        <Button variant={"print"}>Print Out</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="nav-bg border-0 nav-hover" variant="outline">
              <BsThreeDots size={22} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 mr-10">
            <DropdownMenuLabel>More Details</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="font-semibold hover:bg-black/5 cursor-pointer px-4 py-2 rounded-lg">
              <Link
                href={`/dashboard/employees/appraisals/create?refId=${data.refId}&employee=${data.employee._id}`}
              >
                Review
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={async () => {
                try {
                  await axios.delete(`/api/appraisals/${data._id}`);
                  router.back();
                } catch (error: any) {
                  toast({
                    title: "Error found",
                    description: error.response?.data?.error || error.message,
                  });
                }
              }}
              className="text-red-500 font-semibold hover:text-red-600 hover:bg-black/5 cursor-pointer px-4 py-2 rounded-lg"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default EmployeeAppraisalsDetailHeader;
