import { Request } from "@/types";

export async function GET(request: Request) {
  return Response.json({ name: "planner post" });
}

export async function POST() {
  return Response.json({ name: "planner post" });
}

export async function PUT() {
  return Response.json({ name: "planner put" });
}

export async function DELETE() {
  return Response.json({ name: "planner delete" });
}
