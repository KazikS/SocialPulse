import { PlatformSlug, Source } from "@shared/types/entites";

import { PlatformsRepository } from "../repositories";
import { SourcesRepository } from "../repositories/sources.repo";

type MockSource = {
  platformSlug: PlatformSlug;
  external_id: string;
  name: string;
  url: string;
};

const mockSources: MockSource[] = [
  // Telegram
  { platformSlug: "tg", external_id: "mash", name: "Mash", url: "https://t.me/mash" },
  { platformSlug: "tg", external_id: "rian_ru", name: "РИА Новости", url: "https://t.me/rian_ru" },
  { platformSlug: "tg", external_id: "readovkanews", name: "Readovka", url: "https://t.me/readovkanews" },
  { platformSlug: "tg", external_id: "bazabazon", name: "Baza", url: "https://t.me/bazabazon" },
  { platformSlug: "tg", external_id: "shot_shot", name: "SHOT", url: "https://t.me/shot_shot" },

  // VK
  { platformSlug: "vk", external_id: "lentach", name: "Лентач", url: "https://vk.com/lentach" },
  { platformSlug: "vk", external_id: "mhddtt", name: "Mash", url: "https://vk.com/mhddtt" },
  { platformSlug: "vk", external_id: "ria", name: "РИА Новости", url: "https://vk.com/ria" },

  // YouTube
  { platformSlug: "yt", external_id: "vdud", name: "вДудь", url: "https://youtube.com/@VDud" },
  { platformSlug: "yt", external_id: "varlamov", name: "Варламов", url: "https://youtube.com/@varlamov" },
];

export const createMockSourcesSeed = () => {
  const sourcesRepo = new SourcesRepository();
  const platformsRepo = new PlatformsRepository();

  // Если источники уже есть — пропускаем (мок-сидер заливает только пустую БД)
  if (sourcesRepo.findAll().length > 0) return;

  const platforms = platformsRepo.findAll();
  const platformIdBySlug = new Map(platforms.map((p) => [p.slug, p.id]));

  mockSources.forEach((mock) => {
    const platformId = platformIdBySlug.get(mock.platformSlug);
    if (!platformId) return;

    const source: Omit<Source, "id"> = {
      platform_id: platformId,
      external_id: mock.external_id,
      name: mock.name,
      url: mock.url,
      created_at: new Date().toISOString(),
    };

    sourcesRepo.create(source);
  });
};
