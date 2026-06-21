import { PlatformSlug, Source } from "@shared/types/entites";

import { platformRepo } from "../repositories";
import { SourcesRepository } from "../repositories/sources.repo";

type MockSource = {
  platformSlug: PlatformSlug;
  external_id: string;
  name: string;
  icon_path: string;
  url: string;
};

const mockSources: MockSource[] = [
  // Telegram
  {
    platformSlug: "tg",
    external_id: "mash",
    name: "Mash",
    url: "https://t.me/mash",
    icon_path: "",
  },
  {
    platformSlug: "tg",
    external_id: "rian_ru",
    name: "РИА Новости",
    url: "https://t.me/rian_ru",
    icon_path: "",
  },
  {
    platformSlug: "tg",
    external_id: "readovkanews",
    name: "Readovka",
    url: "https://t.me/readovkanews",
    icon_path: "",
  },
  {
    platformSlug: "tg",
    external_id: "bazabazon",
    name: "Baza",
    url: "https://t.me/bazabazon",
    icon_path: "",
  },
  {
    platformSlug: "tg",
    external_id: "shot_shot",
    name: "SHOT",
    url: "https://t.me/shot_shot",
    icon_path: "",
  },

  // VK
  {
    platformSlug: "vk",
    external_id: "lentach",
    name: "Лентач",
    url: "https://vk.com/lentach",
    icon_path: "",
  },
  {
    platformSlug: "vk",
    external_id: "mhddtt",
    name: "Mash",
    url: "https://vk.com/mhddtt",
    icon_path: "",
  },
  {
    platformSlug: "vk",
    external_id: "ria",
    name: "РИА Новости",
    url: "https://vk.com/ria",
    icon_path: "",
  },

  // YouTube
  {
    platformSlug: "yt",
    external_id: "vdud",
    name: "вДудь",
    url: "https://youtube.com/@VDud",
    icon_path: "",
  },
  {
    platformSlug: "yt",
    external_id: "varlamov",
    name: "Варламов",
    url: "https://youtube.com/@varlamov",
    icon_path: "",
  },
];

export const createMockSourcesSeed = () => {
  const sourcesRepo = new SourcesRepository();

  // Если источники уже есть — пропускаем (мок-сидер заливает только пустую БД)
  if (sourcesRepo.findAll().length > 0) return;

  const platforms = platformRepo.findAll();
  const platformIdBySlug = new Map(platforms.map((p) => [p.slug, p.id]));

  mockSources.forEach((mock) => {
    const platformId = platformIdBySlug.get(mock.platformSlug);
    if (!platformId) return;

    const source: Omit<Source, "id"> = {
      platform_id: platformId,
      external_id: mock.external_id,
      name: mock.name,
      url: mock.url,
      icon_path: mock.icon_path ?? "",
      created_at: new Date().toISOString(),
    };

    sourcesRepo.create(source);
  });
};
