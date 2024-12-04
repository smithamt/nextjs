import { TreePalm } from "lucide-react";
import { LineChartComponent } from "./_components/line/linechart";
import AttendanceModel from "@/models/attendances/model";

async function OverviewLeaves({
  startDate,
  today,
}: {
  startDate: Date;
  today: Date;
}) {
  const leaves = await AttendanceModel.aggregate([
    {
      $match: {
        date: { $gte: startDate, $lte: today },
        leave: { $exists: true },
        fromModel: "Leave",
      },
    },
    {
      $group: {
        _id: "$leave",
        count: { $sum: 1 },
      },
    },
  ]);

  const populatedLeaves = await AttendanceModel.populate(
    leaves.filter((l) => l._id),
    {
      path: "_id",
      model: "Leave",
      select: "name",
    }
  );
  return (
    <div className="cart-bg rounded-md shadow-sm p-3 mb-4 h-auto w-full">
      <p className="font-bold text-lg">Weekly leave result</p>
      <div className="mt-2 h-[120px]">
        <div className="flex">
          {populatedLeaves
            .filter((l) => l._id)
            .map((item) => ({
              path: "",
              name: item._id?.name,
              count: item.count,
              icon: <TreePalm size={16} />,
            }))
            .map((item, index) => (
              <div
                key={index}
                className="mr-2 h-[108px] w-auto rounded-md hover:shadow-md p-4 cursor-pointer"
              >
                <p className="flex items-center">
                  <strong className="text-xs capitalize mr-2">
                    {item?.name}{" "}
                  </strong>
                  {item?.icon}
                </p>
                <p className="text-lg">{item?.count}</p>
              </div>
            ))}
        </div>
      </div>
      <div className="w-[70%] h-[200px]">
        <LineChartComponent />
      </div>
    </div>
  );
}

export default OverviewLeaves;
