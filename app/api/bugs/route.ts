export async function GET() {
  return Response.json({ name: "bugs get" });
}

export async function POST() {
  return Response.json({ name: "bugs post" });
}

export async function PUT() {
  return Response.json({ name: "bugs put" });
}

export async function DELETE() {
  return Response.json({ name: "bugs delete" });
}
