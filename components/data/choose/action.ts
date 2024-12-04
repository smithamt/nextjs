"use server";
import { cookie } from "@/lib/utils";
import { Model } from "mongoose";
import { cookies } from "next/headers";
import { cache } from "react";

export async function updateParams(key: string, value: string) {
  const expires = new Date(Date.now() + cookie.duration);
  cookies().set(key, value, { expires });
}

export async function deleteParams(key: string) {
  cookies().set(key, "");
}

export const getData = cache(
  async <T>({ model, query }: { model: Model<T>; query: any }) => {
    const data = await model.find(query).sort({ createdAt: -1 }).lean();
    const count = await model.countDocuments(query);
    return { data, count };
  }
);
