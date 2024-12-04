export async function GET() {
  return Response.json({ name: "posts get" });
}

export async function POST() {
  return Response.json({ name: "posts post" });
}

export async function PUT() {
  return Response.json({ name: "posts put" });
}

export async function DELETE() {
  return Response.json({ name: "posts delete" });
}
