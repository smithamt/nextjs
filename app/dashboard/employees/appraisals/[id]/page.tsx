import { Label } from "@/components/ui/label";
import { getUser } from "@/data/user";
import AppraisalModel from "@/models/appraisals/model";
import { AppraisalType } from "@/types";
import { Star } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import EmployeeAppraisalsDetailHeader from "./header";

async function EmployeeAppraisalsDetail({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUser();
  const { id } = params;

  let data: AppraisalType = (await AppraisalModel.findById(id)
    .populate({
      path: "employee",
      select:
        "name nickname employeeId position department joinedDate profile nationality",
      populate: [{ path: "department position", select: "name" }],
    })
    .populate("evaluations.evaluation", "name skillType description")
    .populate("createdBy reviewedBy", "name")
    .populate("developmentplans.developmentplan", "question")) as AppraisalType;

  if (!data || !user) return notFound();

  const src = data?.employee.profile
    ? `/api/images/${data.employee.profile?.image}/200/220`
    : "";

  const totalSum = data.evaluations.reduce((sum, item) => sum + item.rating, 0);
  // Count the ratings
  const totalCount = data.evaluations.length;
  // Calculate the average
  const averageRating = totalSum / totalCount;

  return (
    <div className="p-4 h-screen overflow-y-auto w-full">
      <div className="cart-bg shadow-m rounded-lg">
        <div className="p-4">
          <EmployeeAppraisalsDetailHeader data={JSON.stringify(data)} />
        </div>
        <div className="flex border-y p-4">
          <Image
            width={160}
            height={200}
            className="rounded-lg"
            alt={data._id}
            src={src}
            style={{ objectFit: "cover" }}
          />
          <div className="grid grid-cols-3 flex-1">
            {[
              { title: "FULL NAME", value: data.employee.name },
              { title: "EMAIL", value: data.employee.email },
              { title: "PHONE NUMBER", value: data.employee.contactNo },
              { title: "POSITION", value: data.employee.position?.name },
              { title: "DEPARTMENT", value: data.employee.department?.name },
              { title: "ADDRESS", value: data.employee.currentAddress },
            ].map((d, index) => {
              return (
                <div key={index} className="p-4">
                  <p className="text-xs">{d.title}</p>
                  <p className="font-bold text-lg">{d.value}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="p-4">
          <p className="font-bold my-2">Appraisal Detail</p>
          <p className="mb-2">Reviewed By: {data.reviewedBy?.name}</p>
        </div>
        <div className="p-4 border-b">
          <Label>Employee Evaluations</Label>
          {data.evaluations.map((e, index) => {
            return (
              <div key={index} className="my-2 hover p-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{e.evaluation.name}</p>
                  <div className="flex">
                    {new Array(e.rating).fill(null).map((r, k) => (
                      <Star className="w-4 ml-2" key={k} />
                    ))}
                  </div>
                </div>
                <p className="">{e.comment}</p>
              </div>
            );
          })}
          <div className="my-2 flex items-center justify-between">
            <Label className="">Average rating:</Label>
            <p className="p-1 bg-gray-200">{averageRating.toFixed(1)}</p>
          </div>
        </div>
        <div className="p-4">
          <p>Development Plans</p>
          {data.developmentplans.map((d, index) => {
            return (
              <div key={index}>
                <p className="font-bold">{d.developmentplan.question}</p>
                <p>{d.plan}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default EmployeeAppraisalsDetail;
