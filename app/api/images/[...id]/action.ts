import fs from "fs";
import sharp from "sharp";

const imageExtensions = [".jpg", ".png", ".jpeg"];

export const getImage = async ({
  id,
  width,
  height,
}: {
  id: string;
  width: string;
  height: string;
}) => {
  let image = null;

  for (const ext of imageExtensions) {
    try {
      image = await fs.promises.readFile(`images/${id}${ext}`);
    //   console.log("image", image);
      break; // Stop searching if a valid image is found
    } catch (error) {}
  }

  let data = null;

  const mimetype = ".jpeg";

  const imgBuffer = image && Buffer.from(image);
  if (width == "original" && height == "original") {
    data = { resizedBuffer: imgBuffer, mimetype };
  } else if (imgBuffer) {
    const resizedBuffer = await sharp(imgBuffer)
      .resize(Number(width), Number(height))
      .toBuffer();
    data = { resizedBuffer, mimetype };
  }

  return data;
};
