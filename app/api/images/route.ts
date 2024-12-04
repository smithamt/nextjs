import { getUser } from "@/data/user";
import ImageModel from "@/models/image/model";
import fs from "fs-extra";
import { NextRequest, NextResponse } from "next/server";

import path from "path";

export async function GET() {
  return Response.json({ name: "image get" });
}

export async function POST(request: NextRequest) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "User not found!" }, { status: 404 });

  const formData = await request.formData();
  const file = formData.get("image") as File;

  if (!file)
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  const newImage = new ImageModel({
    state: "new",
    author: user._id, // Replace with actual author ID
    image: {
      fieldname: file.name,
      originalname: file.name,
      encoding: "7bit",
      mimetype: file.type,
      filename: file.name,
      path: "images", // You can leave this empty if not saving to disk
      buffer: buffer,
      size: file.size,
      extension: path.extname(file.name),
    },
    status: "draft",
    ref: "some_ref",
    createdBy: user._id, // Replace with actual creator ID
  });

  const filePath = path.join(
    process.cwd(),
    "images",
    newImage._id.toString() + path.extname(file.name)
  );

  await newImage.save();
  // Ensure the directory exists
  await fs.ensureDir(path.dirname(filePath));
  // Write the file to the filesystem
  await fs.writeFile(filePath, buffer);

  return NextResponse.json({ _id: newImage._id });
}

export async function PUT() {
  return Response.json({ name: "image put" });
}

export async function DELETE() {
  return Response.json({ name: "image delete" });
}
