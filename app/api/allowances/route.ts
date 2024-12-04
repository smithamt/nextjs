export async function GET() {
  return Response.json({ name: "allowances get" });
}

export async function POST() {
  return Response.json({ name: "allowances post" });
}

export async function PUT() {
  return Response.json({ name: "allowances put" });
}

export async function DELETE() {
  return Response.json({ name: "allowances delete" });
}
