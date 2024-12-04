export async function GET() {
  return Response.json({ name: "telegrams get" });
}

export async function POST() {
  return Response.json({ name: "telegrams post" });
}

export async function PUT() {
  return Response.json({ name: "telegrams put" });
}

export async function DELETE() {
  return Response.json({ name: "telegrams delete" });
}
