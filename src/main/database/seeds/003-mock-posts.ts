import { Post } from "@shared/types/entites";

import { PostRepository } from "../repositories/post.repo";
import { SourcesRepository } from "../repositories/sources.repo";

const sampleTexts = [
  "Срочно: в Москве задержали группу людей по подозрению в мошенничестве.",
  "Минфин предложил новые меры поддержки IT-отрасли. Подробности — в карточках.",
  "Стоимость нефти Brent выросла на 2%, реакция рынка предсказуема.",
  "В метро запустили новый поезд «Москва-2026» — что в нём изменилось.",
  "Эксклюзивное интервью с предпринимателем — как построить бизнес с нуля.",
  "Аналитики прогнозируют рост экономики на 3.2% по итогам года.",
  "Новый трейлер ожидаемого фильма собрал 10 млн просмотров за сутки.",
  "В РАН рассказали о новом исследовании в области искусственного интеллекта.",
  "Что известно о пожаре в подмосковном складе — главные факты.",
  "Сборная России по футболу сыграет товарищеский матч в марте.",
  "Глава ЦБ выступила с заявлением по ключевой ставке.",
  "В Роскомнадзоре прокомментировали новые ограничения в интернете.",
];

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomDate = (daysBack: number) => {
  const now = Date.now();
  const offset = randomBetween(0, daysBack * 24 * 60 * 60 * 1000);
  return new Date(now - offset).toISOString();
};

export const createMockPostsSeed = () => {
  const sourcesRepo = new SourcesRepository();
  const postsRepo = new PostRepository();

  if (postsRepo.findAll().length > 0) return;

  const sources = sourcesRepo.findAll();
  if (sources.length === 0) return;

  sources.forEach((source) => {
    const postsCount = randomBetween(3, 15);

    for (let i = 0; i < postsCount; i++) {
      const publishedAt = randomDate(7);

      const post: Omit<Post, "id"> = {
        source_id: source.id,
        external_id: `${source.id}_${i}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        text: sampleTexts[randomBetween(0, sampleTexts.length - 1)],
        published_at: publishedAt,
        created_at: new Date().toISOString(),
      };

      postsRepo.create(post);
    }
  });
};
