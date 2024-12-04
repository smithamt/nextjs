export async function GET() {
  return Response.json({ name: "image get" });
}

export async function POST() {
  return Response.json({ name: "image post" });
}

export async function PUT() {
  return Response.json({ name: "image put" });
}

export async function DELETE() {
  return Response.json({ name: "image delete" });
}
