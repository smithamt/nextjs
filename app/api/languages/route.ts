export async function GET() {
  return Response.json({ name: "languages get" });
}

export async function POST() {
  return Response.json({ name: "languages post" });
}

export async function PUT() {
  return Response.json({ name: "languages put" });
}

export async function DELETE() {
  return Response.json({ name: "languages delete" });
}
