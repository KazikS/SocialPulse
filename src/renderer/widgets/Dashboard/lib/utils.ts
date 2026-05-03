import {
  Platform,
  PlatformSlug,
  Post,
  PostByPlatform,
} from "@shared/types/entites";
import dayjs, { Dayjs, extend, locale } from "dayjs";
import weekday from "dayjs/plugin/weekday";

import { PeriodVariants } from "./types";

extend(weekday);
locale("ru");

/**
 * Возвращает корректную форму слова в зависимости от числа.
 *
 * @param number Число, определяющее форму слова.
 * @param wordForms Массив из трёх форм слова:
 * - 0: для чисел, оканчивающихся на 1
 * - 1: для чисел, оканчивающихся на 2, 3, 4
 * - 2: для остальных чисел
 *
 * @returns Подходящая форма слова.
 */
export const pluralize = (number: number, wordForms: string[]) => {
  if (number > 100) number = number % 100;
  if (number >= 10 && number <= 20) return wordForms[2];
  if (number > 20) number = number % 10;

  return number === 1
    ? wordForms[0]
    : number > 1 && number < 5
      ? wordForms[1]
      : wordForms[2];
};

type GroupedByPlatform = Record<string, Post[]>;

export const groupedByPlatform = (rawData: PostByPlatform[]) => {
  return rawData.reduce<GroupedByPlatform>((acc, post) => {
    if (!acc[post.slug]) {
      acc[post.slug] = [];
    }
    acc[post.slug].push(post);
    return acc;
  }, {});
};

/**
 * В зависимости от того какой период придет функция форматирует полученную дату в нужный вид для метки
 *
 * @param date Дата в формате гггг-мм-дд
 * @param period один из вариантов юнион-типа PeriodVariants
 * @returns строка-метка для оси X, по которой пост будет агрегирован.
 */
export const getXKey = (date: Dayjs, period: PeriodVariants) => {
  switch (period) {
    case "week":
      return date.format("dd").toUpperCase();
    case "month":
      return date.format("D");
    case "halfYear":
      return date.format("MMM");
  }
};

/**
 * Функция сначала в зависимости от периода возвращает массив дней недели/дней месяца числами/месяцев прошедшего полугодия
 * после формируется массив объектов в виде
 * @example
 * [
 *  {x: метка, slug1: 0, slug2: 0, slug3: 0 ...}
 *  {x: метка, slug1: 0, slug2: 0, slug3: 0 ...}
 *  {x: метка, slug1: 0, slug2: 0, slug3: 0 ...}
 *  {x: метка, slug1: 0, slug2: 0, slug3: 0 ...}
 *  {x: метка, slug1: 0, slug2: 0, slug3: 0 ...}
 *  {x: метка, slug1: 0, slug2: 0, slug3: 0 ...}
 * ]
 *
 * @param period один из вариантов юнион-типа PeriodVariants
 * @param platformSlugs массив сущетсвующих в проекте слагов платформ (vk tg yt max)
 * @returns массив объектов вида {x: string, slug1: number, slug2: number, slug3: number ...} где x это
 * строка метка нужная а slug* это слаг платформы
 */
export const buildSkeletonData = (
  period: PeriodVariants,
  platformSlugs: string[],
) => {
  let xKeys: string[] = [];
  switch (period) {
    //массив дней недели в формате ПН ВТ СР ЧТ ПТ СБ ВС
    case "week": {
      const monday = dayjs().weekday(0);
      xKeys = Array.from({ length: 7 }, (_, i) =>
        monday.add(i, "day").format("dd").toUpperCase(),
      );
      break;
    }
    //массив всех дней месяца по номерам от 1 до 30/31
    case "month": {
      const days = dayjs().daysInMonth();
      xKeys = Array.from({ length: days }, (_, i) => String(i + 1));
      break;
    }
    //массив месяцев прошедшего полугодия и текущий включительно
    case "halfYear": {
      const start = dayjs().subtract(6, "month");
      xKeys = Array.from({ length: 6 }, (_, i) =>
        start.add(i, "month").format("MMM"),
      );
      break;
    }
  }
  //тут собирается массив: на каждую метку создается объект
  return xKeys.map((x) => {
    //метод fromEntries создает объект из массива с двумя значениями тут и возвращает объект на каждой итерации, записывая его в массив
    //получается
    const counts = Object.fromEntries(
      platformSlugs.map((slug) => [slug, 0]),
    ) as Record<PlatformSlug, number>;

    return { x, ...counts };
  });
};

/**
 *
 * @param posts массив постов всех статистику по которым нужно отобразить на графике
 * @param period период за который нужно отобразить статистику
 * @param platforms список платформ доступных
 * @returns подходящий тип данных для графиков recharts, то есть массив одинаковых объектов
 * @example
 * [
 *  {x: метка, slug1: кол-во постов, slug2: кол-во постов, slug3: кол-во постов ...}
 *  {x: метка, slug1: кол-во постов, slug2: кол-во постов, slug3: кол-во постов ...}
 *  {x: метка, slug1: кол-во постов, slug2: кол-во постов, slug3: кол-во постов ...}
 *  {x: метка, slug1: кол-во постов, slug2: кол-во постов, slug3: кол-во постов ...}
 *  {x: метка, slug1: кол-во постов, slug2: кол-во постов, slug3: кол-во постов ...}
 *  {x: метка, slug1: кол-во постов, slug2: кол-во постов, slug3: кол-во постов ...}
 * ]
 */
export const buildChartData = (
  posts: PostByPlatform[],
  period: PeriodVariants,
  platforms: Platform[],
) => {
  const slugs = platforms.map((platform) => platform.slug);
  const skeleton = buildSkeletonData(period, slugs);

  for (const post of posts) {
    const xKey = getXKey(dayjs(post.published_at.split("T")[0]), period);
    const row = skeleton.find((r) => r.x === xKey);
    if (row && post.slug in row) {
      row[post.slug] += 1;
    }
  }

  return skeleton;
};
