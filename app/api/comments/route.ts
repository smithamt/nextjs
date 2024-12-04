export async function GET() {
  return Response.json({ name: "comments get" });
}

export async function POST() {
  return Response.json({ name: "comments post" });
}

export async function PUT() {
  return Response.json({ name: "comments put" });
}

export async function DELETE() {
  return Response.json({ name: "comments delete" });
}
