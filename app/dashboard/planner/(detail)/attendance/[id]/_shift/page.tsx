import ShowNoText from "@/components/app/nodata";
import DefaultDataShow from "@/components/default/show";
import ShiftModel from "@/models/shifts/model";

async function PlannerAttendanceDetailShift({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const shift = await ShiftModel.findOne({
    $or: [
      { _id: searchParams.shift },
      {
        employee: params.id,
        date: searchParams.date,
      },
    ],
  }).populate("schedule createdBy", "name");

  if (!shift) return <ShowNoText>No Shift Found</ShowNoText>;

  return <DefaultDataShow toSkip={["employee"]} data={JSON.stringify(shift)} />;
}

export default PlannerAttendanceDetailShift;
