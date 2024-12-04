export async function GET() {
  return Response.json({ name: "messages get" });
}

export async function POST() {
  return Response.json({ name: "messages post" });
}

export async function PUT() {
  return Response.json({ name: "messages put" });
}

export async function DELETE() {
  return Response.json({ name: "messages delete" });
}
