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

// сколько дней назад начинаем генерировать (чуть больше полугода)
const DAYS_BACK = 190;
// вероятность, что в конкретный день у источника был хотя бы один пост
const POST_DAY_PROBABILITY = 0.5;

// дата N дней назад со случайным «дневным» временем
const dateNDaysAgo = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(randomBetween(7, 22), randomBetween(0, 59), 0, 0);
  return date.toISOString();
};

export const createMockPostsSeed = () => {
  const sourcesRepo = new SourcesRepository();
  const postsRepo = new PostRepository();

  if (postsRepo.findAll().length > 0) return;

  const sources = sourcesRepo.findAll();
  if (sources.length === 0) return;

  sources.forEach((source) => {
    // идём по каждому дню за последние полгода
    for (let daysAgo = 0; daysAgo < DAYS_BACK; daysAgo++) {
      // в часть дней постов не было — пропускаем
      if (Math.random() > POST_DAY_PROBABILITY) continue;

      // в «активный» день — от 1 до 3 публикаций
      const postsThisDay = randomBetween(1, 3);

      for (let i = 0; i < postsThisDay; i++) {
        const post: Omit<Post, "id"> = {
          source_id: source.id,
          external_id: `${source.id}_${daysAgo}_${i}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          text: sampleTexts[randomBetween(0, sampleTexts.length - 1)],
          published_at: dateNDaysAgo(daysAgo),
          created_at: new Date().toISOString(),
        };

        postsRepo.create(post);
      }
    }
  });
};
