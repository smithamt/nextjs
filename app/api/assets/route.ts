export async function GET() {
  return Response.json({ name: "assets get" });
}

export async function POST() {
  return Response.json({ name: "assets post" });
}

export async function PUT() {
  return Response.json({ name: "assets put" });
}

export async function DELETE() {
  return Response.json({ name: "assets delete" });
}
