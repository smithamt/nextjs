import PlannerAttendanceDetailPage from "@/app/dashboard/planner/(detail)/attendance/[id]/page";

async function PlannerAttendanceDetailPageDot({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <PlannerAttendanceDetailPage params={params} searchParams={searchParams} />
  );
}

export default PlannerAttendanceDetailPageDot;
