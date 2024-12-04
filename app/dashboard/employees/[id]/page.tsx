import BackArrowWithTitle from "@/components/app/arrow";
import DefaultDataShow from "@/components/default/show";
import { Label } from "@/components/ui/label";
import { getUser } from "@/data/user";
import EmployeeModel from "@/models/employees/model";
import { ADMIN_HOD_FINANCE_EDITOR_GROUP_ADMIN } from "@/roles";
import dayjs from "dayjs";
import { Types } from "mongoose";
import Image from "next/image";
import { notFound } from "next/navigation";

async function EmployeeDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const user = await getUser();
  if (!user) return;

  const pattern = new RegExp(id, "i");
  let query: any = { employeeId: { $regex: pattern } };
  if (Types.ObjectId.isValid(id)) {
    query = { _id: id };
  }

  const employee = (
    await EmployeeModel.findOne(query).populate(
      "position department currency language branch company createdBy",
      "name"
    )
  )?.toObject();

  if (!employee) return notFound();

  if (
    !ADMIN_HOD_FINANCE_EDITOR_GROUP_ADMIN.includes(user.role) &&
    employee._id.toString() !== user._id.toString()
  )
    return notFound();

  const src = employee.profile?.image
    ? `/api/images/${employee.profile.image}/300/300`
    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <div className="w-full h-screen px-4 pb-4 overflow-y-auto">
      <BackArrowWithTitle to="/dashboard/employees/cart">
        Employee Detail
      </BackArrowWithTitle>
      <div className="rounded-lg cart-bg shadow-sm w-full h-auto">
        <div className="flex w-full p-4 border-b">
          <Image
            width={160}
            height={200}
            className="rounded-lg"
            src={src}
            alt={"profile"}
          />
          <div className="p-2 grid grid-cols-3 gap-4 flex-1 px-4">
            {[
              { name: "Name", value: employee.name },
              { name: "Employee Id", value: employee.employeeId },
              { name: "Department", value: employee.department?.name },
              { name: "Position", value: employee.position?.name },
              { name: "Score", value: employee.score },
              {
                name: "Joined Date",
                value: dayjs(employee.joinedDate).format("YYYY-MM-DD"),
              },
            ].map((i, k) => {
              return (
                <div key={k}>
                  <Label>{i.name}</Label>
                  <p className="text-lg font-semibold">{i.value}</p>
                </div>
              );
            })}
          </div>
        </div>
        <DefaultDataShow
          className="p-4"
          chicontainercls="border rounded-md p-2"
          chichildcls="inactive-text"
          data={employee}
        />
      </div>
    </div>
  );
}

export default EmployeeDetail;
