export async function GET() {
  return Response.json({ name: "updates get" });
}

export async function POST() {
  return Response.json({ name: "updates post" });
}

export async function PUT() {
  return Response.json({ name: "updates put" });
}

export async function DELETE() {
  return Response.json({ name: "updates delete" });
}
