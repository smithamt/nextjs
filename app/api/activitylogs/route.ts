import ActivityLogSchema from "../../../models/activitylogs/model";

export async function GET() {
  const activities = await ActivityLogSchema.find().limit(20);
  return Response.json(activities);
}

export async function POST() {
  return Response.json({ name: "activitylog psot" });
}

export async function PUT() {
  return Response.json({ name: "activitylog put" });
}

export async function DELETE() {
  return Response.json({ name: "activitylog delete" });
}
