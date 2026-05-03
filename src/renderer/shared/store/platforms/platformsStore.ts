import { Platform } from "@shared/types/entites";

import { api } from "@/shared/api";

/** Загруженные платформы. null — данные ещё не загружали. */
let cache: Platform[] | null = null;

/** Активный запрос, если он сейчас выполняется. Защита от дублей. */
let promise: Promise<Platform[]> | null = null;

/**
 * In-memory кэш для списка платформ.
 *
 * Загружает платформы из БД один раз за сессию приложения и хранит
 * результат в памяти модуля. Все последующие вызовы getPlatforms()
 * возвращают данные синхронно из кэша без запросов к БД.
 *
 * Логика:
 * 1. Если cache уже заполнен — возвращаем его сразу.
 * 2. Если cache пуст, но promise уже летит — возвращаем тот же promise
 *    (защита от race condition при параллельных вызовах).
 * 3. Если оба пусты — стартуем новый запрос, сохраняем его в promise,
 *    после успешного ответа кладём данные в cache.
 *
 * Кэш сбрасывается только при перезапуске приложения.
 */
export const getPlatforms = async (): Promise<Platform[]> => {
  if (cache) return cache;
  if (promise) return promise;

  promise = api.platforms.getAll().then((data) => {
    cache = data;
    promise = null;
    return data;
  });
  return promise;
};
