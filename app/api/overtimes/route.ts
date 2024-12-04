export async function GET() {
  return Response.json({ name: "overtimes get" });
}

export async function POST() {
  return Response.json({ name: "overtimes post" });
}

export async function PUT() {
  return Response.json({ name: "overtimes put" });
}

export async function DELETE() {
  return Response.json({ name: "overtimes delete" });
}
