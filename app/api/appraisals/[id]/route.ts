import { getUser } from "@/data/user";
import AppraisalModel from "@/models/appraisals/model";
import { actions, valid_role } from "@/roles";
import { NextRequest } from "next/server";
import { saveRemoveData } from "../../action";

export async function PUT() {
  return Response.json({ name: "appraisals put" });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser();
  if (!user)
    return Response.json({ error: "User not found!" }, { status: 404 });

  const validToDelete = valid_role("appraisals", user.role, actions.DELETE);

  if (!validToDelete)
    return Response.json({ error: "not allow!" }, { status: 401 });

  const appraisal = await AppraisalModel.findById(params.id);

  if (!appraisal)
    return Response.json({ name: "appraisal not found" }, { status: 404 });

  if (appraisal.status && appraisal.status !== "pending") {
    return Response.json({ error: "not allow!" }, { status: 401 });
  }

  await AppraisalModel.findByIdAndUpdate(appraisal._id, {
    isPublic: false,
  });

  await saveRemoveData({
    title: "appraisals",
    context: appraisal._id,
    fromModel: "Appraisal",
    employee: user._id,
  });

  return Response.json({ message: "appraisal deleted successfully" });
}
