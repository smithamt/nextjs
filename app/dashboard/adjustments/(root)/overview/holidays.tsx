import Image from "next/image";
import { BarChartComponent } from "./_components/bar/barchart";
import AttendanceModel from "@/models/attendances/model";

async function OverviewHolidays({
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
        fromModel: "Holiday",
      },
    },
    {
      $group: {
        _id: "$leave", // Group by leave type
        count: { $sum: 1 }, // Count the number of documents in each group
      },
    },
  ]);

  const populatedLeaves = await AttendanceModel.populate(
    leaves.filter((l) => l._id),
    {
      path: "_id", // The field to populate
      model: "Holiday", // The model to use for population
      select: "name profile", // The field to select from the LeaveType model
    }
  );
  return (
    <div className="cart-bg rounded-md shadow-sm p-3 mb-4 min-h-[300px]">
      <p className="font-bold text-lg">Weekly holidays result</p>
      <div className="mt-2">
        <div className="flex">
          {populatedLeaves
            .filter((l) => l._id)
            .map((item) => ({
              path: "",
              name: item._id?.name,
              count: item.count,
              icon: item._id?.profile,
            }))
            .map((item, index) => {
              const src = item.icon?.image
                ? `/api/images/${item.icon.image}/50/50`
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
              return (
                <div
                  key={index}
                  className="mr-2 h-[108px] w-auto rounded-md hover:shadow-md p-4 cursor-pointer"
                >
                  <p className="flex items-center">
                    <Image
                      src={src}
                      alt="profile"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <strong className="text-xs capitalize ml-2">
                      {item?.name}{" "}
                    </strong>
                  </p>
                  <p className="text-lg">{item?.count}</p>
                </div>
              );
            })}
        </div>
      </div>
      <div className="w-[70%] h-[250px]">
        <BarChartComponent />
      </div>
    </div>
  );
}

export default OverviewHolidays;
