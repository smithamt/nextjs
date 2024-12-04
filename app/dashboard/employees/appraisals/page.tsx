import BackArrowWithTitle from "@/components/app/arrow";
import LastElement from "@/components/lastelement";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import AppraisalModel from "@/models/appraisals/model";
import { AppraisalType } from "@/types";
import { Star } from "lucide-react";
import Image from "next/image";

async function Appraisals() {
  const data = (await AppraisalModel.find()
    .limit(10)
    .populate(
      "employee",
      "name profile nickname employeeId position department"
    )) as AppraisalType[];
  const count = await AppraisalModel.countDocuments();

  return (
    <div className="h-screen w-full">
      <div className="flex justify-between items-center mt-2">
        <BackArrowWithTitle to={"/dashboard/employees"}>
          {`Appraisals ${count || ""}`}
        </BackArrowWithTitle>
      </div>
      <div className="p-2 h-[calc(100%-40px)] overflow-y-auto">
        {data.map((i, k) => {
          const totalSum = i.evaluations.reduce(
            (sum, item) => sum + item.rating,
            0
          );
          const totalCount = i.evaluations.length;
          const averageRating = totalSum / totalCount;

          const src = i.employee.profile?.image
            ? `/api/images/${i.employee.profile?.image}/100/100`
            : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

          const preview = i.evaluations[0];

          return (
            <div key={k} className="p-2">
              <Card className="hover cart-bg">
                <CardHeader className="p-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>{i.employee.name}</CardTitle>
                    <Badge variant={i.status}>{i.status}</Badge>
                  </div>
                  <CardDescription>
                    {i.employee.department?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-2">
                  <p className="flex mb-2">
                    <Star className="w-4 mr-2" /> Rating:{" "}
                    {averageRating.toFixed(1)}
                  </p>
                  <div className="flex">
                    <Image
                      width={50}
                      height={50}
                      className="rounded-full"
                      src={src}
                      alt="@profile"
                    />
                    <div className="pt-2">
                      <p className="capitalize px-2 font-semibold">{i.refId}</p>
                      <p className="px-2">{i.employee.position?.name}</p>
                      <p className="font-semibold">
                        {preview.evaluation?.name}
                      </p>
                      <p>{preview.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
        <LastElement
          custom={
            <div className="p-2">
              <Card className="pics">
                <CardHeader className="p-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-[150px] rounded-xl" />
                    <Badge className="h-5 w-[90px]" />
                  </div>
                  <Skeleton className="h-5 w-[250px] rounded-xl" />
                </CardHeader>
                <CardContent className="p-2">
                  <p className="flex mb-2">
                    <Star className="w-4 mr-2" /> Rating:
                  </p>
                  <div className="flex">
                    <Skeleton className="h-12 min-w-12 rounded-full" />
                    <div className="px-2">
                      <Skeleton className="h-4 w-[100px] mb-2 rounded-lg" />
                      <Skeleton className="h-4 w-[200px] rounded-lg" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          }
          count={count}
          data={data.length}
        />
      </div>
    </div>
  );
}

export default Appraisals;
