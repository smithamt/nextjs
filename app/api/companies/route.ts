export async function GET() {
  return Response.json({ name: "companies get" });
}

export async function POST() {
  return Response.json({ name: "companies post" });
}

export async function PUT() {
  return Response.json({ name: "companies put" });
}

export async function DELETE() {
  return Response.json({ name: "companies delete" });
}
