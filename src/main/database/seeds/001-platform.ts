import { Platform } from "@shared/types/entites";
import { PlatformsRepository } from "../repositories";

const basePlatforms: Omit<Platform, "id">[] = [
  {
    name: "Telegram",
    slug: "tg",
  },
  {
    name: "ВКонтакте",
    slug: "vk",
  },
  {
    name: "MAX",
    slug: "max",
  },
  {
    name: "YouTube",
    slug: "yt",
  },
];

export const createPlatformSeed = () => {
  const repo = new PlatformsRepository();

  basePlatforms.forEach((platform) => {
    repo.createOrIgnore(platform);
  });
};
