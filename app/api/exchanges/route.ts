export async function GET() {
  return Response.json({ name: "exchanges get" });
}

export async function POST() {
  return Response.json({ name: "exchanges post" });
}

export async function PUT() {
  return Response.json({ name: "exchanges put" });
}

export async function DELETE() {
  return Response.json({ name: "exchanges delete" });
}
