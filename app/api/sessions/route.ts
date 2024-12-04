export async function GET() {
  return Response.json({ name: "sessions get" });
}

export async function POST() {
  return Response.json({ name: "sessions post" });
}

export async function PUT() {
  return Response.json({ name: "sessions put" });
}

export async function DELETE() {
  return Response.json({ name: "sessions delete" });
}
