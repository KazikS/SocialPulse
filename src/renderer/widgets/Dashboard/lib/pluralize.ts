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
