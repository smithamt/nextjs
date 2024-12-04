export async function GET() {
  return Response.json({ name: "leaves get" });
}

export async function POST() {
  return Response.json({ name: "leaves post" });
}

export async function PUT() {
  return Response.json({ name: "leaves put" });
}

export async function DELETE() {
  return Response.json({ name: "leaves delete" });
}
