export async function GET() {
  return Response.json({ name: "transfers get" });
}

export async function POST() {
  return Response.json({ name: "transfers post" });
}

export async function PUT() {
  return Response.json({ name: "transfers put" });
}

export async function DELETE() {
  return Response.json({ name: "transfers delete" });
}
