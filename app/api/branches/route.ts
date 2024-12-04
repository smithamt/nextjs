export async function GET() {
  return Response.json({ name: "branches get" });
}

export async function POST() {
  return Response.json({ name: "branches post" });
}

export async function PUT() {
  return Response.json({ name: "branches put" });
}

export async function DELETE() {
  return Response.json({ name: "branches delete" });
}
