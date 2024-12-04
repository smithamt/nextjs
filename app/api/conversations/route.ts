export async function GET() {
  return Response.json({ name: "conversations get" });
}

export async function POST() {
  return Response.json({ name: "conversations post" });
}

export async function PUT() {
  return Response.json({ name: "conversations put" });
}

export async function DELETE() {
  return Response.json({ name: "conversations delete" });
}
