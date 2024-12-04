"use server";
import { cookies } from "next/headers";
import { cookie } from "./utils";

export async function updateTheme(theme: "light" | "dark") {
  const expires = new Date(Date.now() + cookie.duration);
  cookies().set("theme", theme, { expires });
}

export async function updateNavState(title: "organization", state: boolean) {
  const expires = new Date(Date.now() + cookie.duration);
  cookies().set(`nav-${title}`, state.toString(), { expires });
}
