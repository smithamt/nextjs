export async function GET() {
  return Response.json({ name: "positions get" });
}

export async function POST() {
  return Response.json({ name: "positions post" });
}

export async function PUT() {
  return Response.json({ name: "positions put" });
}

export async function DELETE() {
  return Response.json({ name: "positions delete" });
}
