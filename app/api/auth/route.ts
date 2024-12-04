"use server";
import { logout } from "@/app/(auth)/login/action";
import { updateSession } from "@/lib/session";
import middleware from "@/middleware";
import { Request } from "@/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await middleware(request);
  console.log("request session", request.session);
  const response = NextResponse.json({ name: "aung", nickname: "smith" });
  return await updateSession(request, response);
}

export async function POST(request: Request) {
  const data = await request.json();

  return Response.json(data);
}

export async function PUT() {
  return Response.json({ name: "auth put" });
}

export async function DELETE() {
  return logout();
}
