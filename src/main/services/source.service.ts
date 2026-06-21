import fs from "node:fs/promises";
import path from "node:path";

import { sourceRepo } from "@main/database/repositories";
import { PlatformSlug } from "@shared/types/entites";
import { app } from "electron";
import sharp from "sharp";

type SaveIconProps = {
  platform: PlatformSlug;
  u8a: Uint8Array;
  sourceId: number;
};

const ALLOWED_FORMATS = ["png", "jpeg", "webp"];

const saveIcon = async ({ platform, u8a, sourceId }: SaveIconProps) => {
  const buffer = Buffer.from(u8a);
  const image = sharp(buffer);

  const metadata = await image.metadata();
  if (!metadata.format || !ALLOWED_FORMATS.includes(metadata.format)) {
    throw new Error(`Недопустимый формат файла: ${metadata.format}`);
  }

  const iconsDir = path.join(app.getPath("userData"), "icons", platform);
  await fs.mkdir(iconsDir, { recursive: true });

  const fileName = `${sourceId}.webp`;
  const fullPath = path.join(iconsDir, fileName);

  await image
    .resize(128, 128, { fit: "cover" })
    .webp({ quality: 85 })
    .toFile(fullPath);

  return path.join(platform, fileName);
};

export const uploadFile = async ({
  platform,
  u8a,
  sourceId,
}: SaveIconProps) => {
  const iconPath = await saveIcon({ platform, u8a, sourceId });
  sourceRepo.updateIconPath(sourceId, iconPath);
  return iconPath;
};
