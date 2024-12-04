export async function GET() {
  return Response.json({ name: "salaryIncrement get" });
}

export async function POST() {
  return Response.json({ name: "salaryIncrement post" });
}

export async function PUT() {
  return Response.json({ name: "salaryIncrement put" });
}

export async function DELETE() {
  return Response.json({ name: "salaryIncrement delete" });
}
