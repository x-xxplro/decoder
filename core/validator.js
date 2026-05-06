/**
 * Нормализация текста: верхний регистр, удаление не-букв и не-цифр.
 * Для азбуки Морзе пробелы важны, поэтому для неё нужна особая обработка (см. game.js).
 */
export function normalize(text) {
  return text
    .toUpperCase()
    .replace(/[^A-ZА-Я0-9]/g, '');
}

/**
 * Сравнение двух строк после нормализации.
 */
export function validate(userInput, correctAnswer, cipherType = null) {
  if (cipherType === 'morse') {
    // Для морзе убираем лишние пробелы, но оставляем структуру слов
    const clean = (str) => str.trim().replace(/\s+/g, ' ').toUpperCase();
    return clean(userInput) === clean(correctAnswer);
  }
  return normalize(userInput) === normalize(correctAnswer);
}