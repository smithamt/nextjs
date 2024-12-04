export async function GET() {
  return Response.json({ name: "editors get" });
}

export async function POST() {
  return Response.json({ name: "editors post" });
}

export async function PUT() {
  return Response.json({ name: "editors put" });
}

export async function DELETE() {
  return Response.json({ name: "editors delete" });
}
