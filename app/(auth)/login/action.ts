"use server";
import connectMongo from "@/config/mongo";
import { createSession, verifySession } from "@/lib/session";
import { cookie } from "@/lib/utils";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateRefreshToken, generateToken } from "./token";
import EmployeeModel from "@/models/employees/model";
import SessionSchema from "@/models/sessions/model";

export async function login(state: any, formData: FormData) {
  await connectMongo();

  const data = {
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  const query: any = {
    isPublic: true,
  };

  query.$or = [
    { employeeId: new RegExp("^" + data.username + "$", "i") },
    { email: data.username },
  ];

  const user = await EmployeeModel.findOne(query).select("+password");

  if (!user) return { error: "invalid credentials" };
  if (user.password) {
    const match = await bcrypt.compare(data.password, user.password);
    if (!match) return { error: "invalid credential!" };
  }

  const token = generateToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());
  const expires = new Date(Date.now() + cookie.duration);
  const sessionData = { token, refreshToken };
  const session = await SessionSchema.create({
    expires,
    session: sessionData,
    user: user._id,
  });

  await createSession(session._id);
  const nextUrl = formData.get("nextUrl") as string;
  redirect(nextUrl || "/dashboard/home");
}

export async function logout() {
  await connectMongo();
  const session = await verifySession();
  if (!session) return;
  await SessionSchema.findByIdAndUpdate(session.sub, {
    isPublic: false,
  });

  cookies().set(cookie.name, "", { expires: new Date(0) });
  redirect("/login");
}
