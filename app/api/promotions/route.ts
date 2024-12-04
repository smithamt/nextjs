export async function GET() {
  return Response.json({ name: "promotions get" });
}

export async function POST() {
  return Response.json({ name: "promotions post" });
}

export async function PUT() {
  return Response.json({ name: "promotions put" });
}

export async function DELETE() {
  return Response.json({ name: "promotions delete" });
}
