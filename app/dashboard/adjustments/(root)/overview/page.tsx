import connectMongo from "@/config/mongo";
import OverviewHolidays from "./holidays";
import OverviewLeaves from "./leaves";
import AttendanceModel from "@/models/attendances/model";

function getFirstDayOfWeek(date: Date) {
  const currentDate = new Date(date);
  const day = currentDate.getDay();
  const diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // Adjust if day is Sunday
  return new Date(currentDate.setDate(diff));
}

async function AdjustmentsOverview() {
  await connectMongo();

  const today = new Date();
  const startDate = getFirstDayOfWeek(today);

  const off = await AttendanceModel.countDocuments({
    date: { $gte: startDate, $lte: today },
    status: "Off",
  });

  return (
    <div className="w-full h-full pr-4">
      <OverviewLeaves startDate={startDate} today={today} />
      <OverviewHolidays startDate={startDate} today={today} />
      <OverviewLeaves startDate={startDate} today={today} />
      <OverviewHolidays startDate={startDate} today={today} />
    </div>
  );
}

export default AdjustmentsOverview;
