import ImageModel from "@/models/image/model";
import { NextRequest, NextResponse } from "next/server";
import { getImage } from "./action";

export async function GET(req: NextRequest) {
  const values = req.url.split("/api/images")[1].split("/");
  const width = values[values.length - 2];
  const height = values[values.length - 1];
  const id = values[values.length - 3];

  const image = await getImage({
    id,
    width,
    height,
  });

  if (!image || !image?.resizedBuffer)
    return Response.json({ error: "not found" });

  return new NextResponse(image.resizedBuffer, {
    headers: {
      "Content-Type": image.mimetype,
    },
  });
}

export async function POST() {
  return Response.json({ name: "image post" });
}

export async function PUT() {
  return Response.json({ name: "image put" });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string | string[] } }
) {
  await ImageModel.findByIdAndDelete(params.id[0]);
  return Response.json({ name: "image delete" });
}
