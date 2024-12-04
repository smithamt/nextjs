export async function GET() {
  return Response.json({ name: "schedules get" });
}

export async function POST() {
  return Response.json({ name: "schedules post" });
}

export async function PUT() {
  return Response.json({ name: "schedules put" });
}

export async function DELETE() {
  return Response.json({ name: "schedules delete" });
}
