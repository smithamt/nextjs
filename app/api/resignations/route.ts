export async function GET() {
  return Response.json({ name: "resignations get" });
}

export async function POST() {
  return Response.json({ name: "resignations post" });
}

export async function PUT() {
  return Response.json({ name: "resignations put" });
}

export async function DELETE() {
  return Response.json({ name: "resignations delete" });
}
