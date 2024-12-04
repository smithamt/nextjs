export async function GET() {
  return Response.json({ name: "scheduleRequests get" });
}

export async function POST() {
  return Response.json({ name: "scheduleRequests post" });
}

export async function PUT() {
  return Response.json({ name: "scheduleRequests put" });
}

export async function DELETE() {
  return Response.json({ name: "scheduleRequests delete" });
}
