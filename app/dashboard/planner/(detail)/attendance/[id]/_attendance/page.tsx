import ShowNoText from "@/components/app/nodata";
import DefaultDataShow from "@/components/default/show";
import AttendanceModel from "@/models/attendances/model";

async function PlannerAttendanceDetailAttendance({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let query: any = {
    employee: params.id,
    date: searchParams.date,
  };

  if (searchParams.attendance) query = { _id: searchParams.attendance };

  const attendance = await AttendanceModel.findOne(query).populate(
    "schedule",
    "name"
  );

  if (!attendance) return <ShowNoText>No Attendance Found</ShowNoText>;

  return (
    <DefaultDataShow toSkip={["employee"]} data={JSON.stringify(attendance)} />
  );
}

export default PlannerAttendanceDetailAttendance;
