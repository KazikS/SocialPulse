import { Platform } from "@shared/types/entites";

import { platformRepo } from "../repositories";

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
  basePlatforms.forEach((platform) => {
    platformRepo.createOrIgnore(platform);
  });
};
