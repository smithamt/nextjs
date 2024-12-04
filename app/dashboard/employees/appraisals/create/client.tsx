"use client";
import { useHasUser } from "@/app/_context/hasuser.context";
import ShowNoText from "@/components/app/nodata";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import axios from "@/constants/app/axios";
import { cn } from "@/lib/utils";
import { ADMIN } from "@/roles";
import {
  AppraisalType,
  DevelopmentplanType,
  EmployeeType,
  EvaluationType,
  RatingType,
  RefIDType,
  StateType,
} from "@/types";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { AddDevelopmentPlan } from "./AddDevelopmentPlan";
import { AddEvaluation } from "./AddEvaluation";

type AppraisalFormType = {
  refId: RefIDType | undefined;
  employee: string;
  evaluations: RatingType[];
  developmentplans: { developmentplan: DevelopmentplanType; plan: string }[];
  state: StateType;
  reviewedBy: EmployeeType;
};

const reviews = [
  { value: 1, description: "Unsatisfactory" },
  { value: 2, description: "Expectations" },
  { value: 3, description: "Effective" },
  { value: 4, description: "Highly Effective" },
  { value: 5, description: "Exceptional" },
];

function CreateAppraisal({ data: d }: { data: string }) {
  const { searchParams, developmentplans, evaluations, employee, appraisal } =
    JSON.parse(d) as {
      searchParams: { [key: string]: string | string[] | undefined };
      developmentplans: DevelopmentplanType[];
      evaluations: EvaluationType[];
      employee: EmployeeType;
      appraisal: AppraisalType | undefined;
    };

  const { id, refId } = searchParams;
  const [creating, setCreating] = useState(false);
  const [developmentPlanDragStart, setDevelopmentPlanDragStart] =
    useState<DevelopmentplanType | null>(null);
  const [evaluationDragStart, setEvaluationDragStart] =
    useState<EvaluationType | null>(null);
  const [dopen, setOpen] = useState(false);
  const [open, setDOpen] = useState(false);
  const { role, user } = useHasUser();
  const formatDate = "YYYY-MM-DD";
  const [appraisalForm, setAppraisalForm] = useState<AppraisalFormType>(
    //@ts-ignore
    appraisal || {
      refId: refId as RefIDType,
      employee: employee._id as string,
      evaluations: [],
      developmentplans: [],
      state: "draft",
      reviewedBy: user,
    }
  );
  const [evaluationForm, setEvaluationForm] = useState<
    EvaluationType & { edit: boolean }
    //@ts-ignore
  >({
    name: "",
    otherName: [],
    skillType: "job",
    levelType: "staff",
    appraisalType: "probation-end",
    description: "",
    edit: false,
  });
  const [developmentplan, setDevelopmentplan] = useState<
    DevelopmentplanType & { edit: boolean }
    //@ts-ignore
  >({
    question: "",
    description: "",
    edit: false,
  });

  const changeForm = (name: keyof typeof appraisalForm, value: any) => {
    setAppraisalForm((prev) => ({ ...prev, [name]: value }));
  };

  const router = useRouter();
  const { toast } = useToast();
  const onBack = () => router.back();

  const onsubmit = async (state: "draft" | "published") => {
    const needRating = appraisalForm.evaluations.filter((a) => !a.rating);
    if (needRating.length > 0) return;
    try {
      setCreating(true);
      await axios.post(`/api/appraisals`, {
        ...appraisalForm,
        reviewedBy: appraisalForm.reviewedBy
          ? appraisalForm.reviewedBy._id
          : "",
        state,
      });
      router.push(
        state === "draft"
          ? "/dashboard/employees/probation"
          : `/dashboard/employees/cart/${employee._id}/reviews`
      );
      setCreating(false);
    } catch (error: any) {
      console.log("error", error);
      toast({
        title: "Error found",
        description: error.response?.data?.error || error.message,
      });
      setCreating(false);
    }
  };

  const src = employee?.profile?.image
    ? `/api/images/${employee.profile?.image}/150/150`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  // return <pre>{JSON.stringify(appraisal, null, 2)}</pre>;

  return (
    <div className="flex h-screen justify-between w-full">
      <div className="w-[200px] 2xl:w-[400px] cart-bg shadow-lg">
        <div className="px-2">
          <p className="p-2 font-semibold">
            Performance Evaluation & Competencies
          </p>
          <AddEvaluation
            form={evaluationForm}
            setForm={setEvaluationForm}
            open={open}
            setOpen={setOpen}
            updateData={() => {}}
          />
        </div>
        <div className="h-[calc(100%-80px)] overflow-y-auto px-2">
          {evaluations.map((i, k) => {
            const active = appraisalForm.evaluations.some(
              (e) => e.evaluation._id === i._id
            );
            return (
              <article
                draggable={!active}
                onDragStart={() => setEvaluationDragStart(i)}
                onDragEnd={() => setEvaluationDragStart(null)}
                onClick={() => {
                  if (ADMIN !== role) {
                    changeForm("evaluations", [
                      ...appraisalForm.evaluations,
                      { evaluation: i },
                    ]);
                    return;
                  }
                  setOpen(true);
                  setEvaluationForm({ ...i, edit: true });
                }}
                className={cn(
                  "mt-1 p-2 flex justify-between rounded-lg mb-2",
                  !active && "cursor-grab",
                  evaluationDragStart?._id === i._id && "cursor-grabbing"
                )}
                key={k}
              >
                <div>
                  <p className="font-semibold">{i.name}</p>
                  <div className="flex">
                    {i.levelType && (
                      <Badge
                        variant={
                          i.levelType === "manager" ? "approved" : "pending"
                        }
                        className="text-xs"
                      >
                        {i.levelType}
                      </Badge>
                    )}
                    <p className="text-xs px-2">{i.skillType}</p>
                  </div>{" "}
                  <p className="text-xs">{i.description?.slice(0, 50)}</p>
                </div>
                {!appraisalForm.evaluations.some(
                  (e) => e.evaluation._id === i._id
                ) ? (
                  <Button
                    onClick={(e) => {
                      changeForm("evaluations", [
                        ...appraisalForm.evaluations,
                        { evaluation: i },
                      ]);
                      e.stopPropagation();
                    }}
                  >
                    +
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      changeForm(
                        "evaluations",
                        appraisalForm.evaluations.filter(
                          (e) => e.evaluation._id !== i._id
                        )
                      );
                      e.stopPropagation();
                    }}
                  >
                    -
                  </Button>
                )}
              </article>
            );
          })}
        </div>
      </div>
      <div className="flex-1 h-full overflow-y-auto p-2">
        <div className="mx-auto min-h-full max-w-[800px] rounded-lg shadow-lg cart-bg">
          <div className="py-2 z-50 mt-auto px-2 flex justify-between">
            <p className="p-2 text-center font-bold text-lg">
              Employee Performance Evaluation
            </p>
            <div className="flex justify-end gap-2">
              <Button disabled={creating} onClick={onBack} variant="outline">
                Cancel
              </Button>
              <Button
                variant="outline"
                disabled={creating}
                onClick={() => onsubmit("draft")}
              >
                Save as draft
              </Button>
              <Button disabled={creating} onClick={() => onsubmit("published")}>
                Create Now
              </Button>
            </div>
          </div>
          <div className="mx-auto h-full">
            <div className="flex border-y p-4">
              <div className="w-32 h-40 rounded-lg overflow-hidden shadow-sm">
                <Image width={128} height={160} src={src} alt={"profile"} />
              </div>
              <div className="px-2 grid grid-cols-2 gap-2 w-full">
                <p title="Employee Name">{employee.name}</p>
                <p title="Employee ID">{employee.employeeId}</p>
                <p title="Position">{employee.position?.name}</p>
                <p title="Department">{employee.department?.name}</p>
                <p title="Joined Date">
                  {dayjs(employee.joinedDate).format(formatDate)}
                </p>
                <p title="Reviewed By">{user.name}</p>
              </div>
            </div>
            <div
              className="w-full h-full p-2"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                changeForm("evaluations", [
                  ...appraisalForm.evaluations,
                  { evaluation: evaluationDragStart },
                ]);
              }}
            >
              <p className="p-2 text-center font-semibold bg-blue-500 mb-2 text-white rounded-sm shadow">
                Evaluation
              </p>
              {evaluationDragStart && (
                <div className="w-full center border border-dashed border-green-500 rounded-lg h-20 p-2 font-semibold inactive-text">
                  Drop Here
                  <Plus className="w-8" />
                </div>
              )}
              {appraisalForm.evaluations.length <= 0 && (
                <ShowNoText className="pb-[150px]">
                  Please Select Employee Evaluation
                </ShowNoText>
              )}
              {appraisalForm.evaluations.map((i, k) => {
                const select = i.rating
                  ? reviews.find((r) => r.value === i.rating)
                  : undefined;
                return (
                  <div key={k} className="mb-2">
                    {!i.rating && (
                      <p className="font-semibold text-red-500">Need rating</p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">
                        {i.evaluation.name} ({i.evaluation.skillType} skills)
                      </p>
                      <Select
                        onValueChange={(value) =>
                          changeForm(
                            "evaluations",
                            appraisalForm.evaluations.map((e) =>
                              e.evaluation._id === i.evaluation._id
                                ? { ...e, rating: value }
                                : e
                            )
                          )
                        }
                      >
                        <SelectTrigger
                          className={cn(
                            "w-[180px]",
                            !i.rating ? "border-red-500" : "border-green-500"
                          )}
                        >
                          <SelectValue
                            placeholder={
                              select
                                ? `${select.value} ${select.description}`
                                : "Select rating"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {reviews.map((s, sk) => (
                            <SelectItem key={sk} value={s.value.toString()}>
                              {s.value} {s.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="my-2">
                      <Textarea
                        value={i.comment}
                        onChange={(e) =>
                          changeForm(
                            "evaluations",
                            appraisalForm.evaluations.map((evalua) =>
                              i.evaluation._id === evalua.evaluation._id
                                ? { ...evalua, comment: e.target.value }
                                : evalua
                            )
                          )
                        }
                        placeholder="Enter your comment for this ratings"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              changeForm("developmentplans", [
                ...appraisalForm.developmentplans,
                { developmentplan: developmentPlanDragStart },
              ]);
            }}
            className="px-2 border-t py-4"
          >
            <p className="p-2 text-center font-semibold bg-blue-500 mb-2 text-white rounded-sm shadow">
              Development Plan
            </p>
            {developmentPlanDragStart && (
              <div className="w-full center border border-dashed border-green-500 rounded-lg h-20 p-2 font-semibold inactive-text">
                Drop Here
                <Plus className="w-8" />
              </div>
            )}
            {appraisalForm.developmentplans.length <= 0 && (
              <ShowNoText className="pb-[150px]">
                Please select employee development plan question
              </ShowNoText>
            )}
            {appraisalForm.developmentplans.map((d, k) => {
              return (
                <Fragment key={k}>
                  <Label>{d.developmentplan.question}</Label>
                  <Textarea
                    value={d.plan}
                    onChange={(e) =>
                      changeForm(
                        "developmentplans",
                        appraisalForm.developmentplans.map((i) =>
                          i.developmentplan._id === d.developmentplan._id
                            ? { ...d, plan: e.target.value }
                            : i
                        )
                      )
                    }
                  />
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
      <div className="w-[200px] 2xl:w-[400px] cart-bg shadow-lg px-2">
        <p className="p-2 font-semibold">Development Plans</p>
        <AddDevelopmentPlan
          form={developmentplan}
          setForm={setDevelopmentplan}
          open={dopen}
          setOpen={setDOpen}
          updateData={() => {}}
        />
        <div className="">
          {developmentplans.map((i, k) => (
            <article
              draggable={
                !appraisalForm.developmentplans.some(
                  (e) => e.developmentplan._id === i._id
                )
              }
              onDragStart={() => setDevelopmentPlanDragStart(i)}
              onDragEnd={() => setDevelopmentPlanDragStart(null)}
              onClick={() => {
                if (ADMIN !== role) return;
                setOpen(true);
                setDevelopmentplan({ ...i, edit: true });
              }}
              className="mt-1 p-2 flex justify-between"
              key={k}
            >
              <div>
                <p className="font-semibold">{i.question}</p>
              </div>
              {!appraisalForm.developmentplans.some(
                (e) => e.developmentplan?._id === i._id
              ) ? (
                <Button
                  onClick={(e) => {
                    changeForm("developmentplans", [
                      ...appraisalForm.developmentplans,
                      { developmentplan: i },
                    ]);
                    e.stopPropagation();
                  }}
                >
                  +
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={(e) => {
                    changeForm(
                      "developmentplans",
                      appraisalForm.developmentplans.filter(
                        (e) => e.developmentplan._id !== i._id
                      )
                    );
                    e.stopPropagation();
                  }}
                >
                  -
                </Button>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CreateAppraisal;
