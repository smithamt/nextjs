export async function GET() {
  return Response.json({ name: "holidays get" });
}

export async function POST() {
  return Response.json({ name: "holidays post" });
}

export async function PUT() {
  return Response.json({ name: "holidays put" });
}

export async function DELETE() {
  return Response.json({ name: "holidays delete" });
}
