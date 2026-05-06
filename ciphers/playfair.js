// Полный алфавит для 6×6 (33 буквы + 3 знака)
const ALPHABET = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ.,!';

/**
 * Построение матрицы 6×6 из ключа
 */
function generateMatrix(key) {
  const cleanKey = key.toUpperCase().replace(/[^А-ЯЁ]/g, '');

  const seen = new Set();
  const chars = [];

  // ключ
  for (const ch of cleanKey) {
    if (!seen.has(ch)) {
      seen.add(ch);
      chars.push(ch);
    }
  }

  // алфавит + знаки
  for (const ch of ALPHABET) {
    if (!seen.has(ch)) {
      seen.add(ch);
      chars.push(ch);
    }
  }

  const cells = chars.slice(0, 36);

  const matrix = [];
  for (let i = 0; i < 6; i++) {
    matrix.push(cells.slice(i * 6, i * 6 + 6));
  }

  return matrix;
}

/**
 * Поиск позиции символа
 */
function findPosition(matrix, char) {
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      if (matrix[row][col] === char) {
        return { row, col };
      }
    }
  }
  return null;
}

/**
 * Удаление служебных "Х"
 */
function removeFillers(text) {
  return text
    .replace(/([А-ЯЁ])Х\1/g, '$1$1') // АХА → АА
    .replace(/Х$/g, '');            // хвост
}

/**
 * ДЕШИФРОВКА ПЛЕЙФЕРА
 */
export function decryptPlayfair(cipherText, key, options = {}) {
  if (!key) return cipherText;

  const matrix = generateMatrix(key);

  const cleanText = cipherText
    .toUpperCase()
    .replace(/\s/g, ''); // ВАЖНО: синхрон с UI

  const pairs = [];
  for (let i = 0; i < cleanText.length; i += 2) {
    const a = cleanText[i];
    const b = cleanText[i + 1] || 'Х';
    pairs.push([a, b]);
  }

  let result = '';

  for (const [a, b] of pairs) {
    const posA = findPosition(matrix, a);
    const posB = findPosition(matrix, b);

    if (!posA || !posB) {
      console.warn('Не найден символ:', a, b);
      continue;
    }

    // одна строка
    if (posA.row === posB.row) {
      result += matrix[posA.row][(posA.col + 5) % 6];
      result += matrix[posB.row][(posB.col + 5) % 6];
    }

    // один столбец
    else if (posA.col === posB.col) {
      result += matrix[(posA.row + 5) % 6][posA.col];
      result += matrix[(posB.row + 5) % 6][posB.col];
    }

    // прямоугольник
    else {
      result += matrix[posA.row][posB.col];
      result += matrix[posB.row][posA.col];
    }
  }

  return options.removeFillers ? removeFillers(result) : result;
}

/**
 * ШИФРОВАНИЕ ПЛЕЙФЕРА
 */
export function encryptPlayfair(plainText, key) {
  if (!key) return plainText;

  const matrix = generateMatrix(key);

  const cleanText = plainText
    .toUpperCase()
    .replace(/[^А-ЯЁ]/g, '');

  const pairs = [];
  let i = 0;

  while (i < cleanText.length) {
    const a = cleanText[i];
    let b = cleanText[i + 1];

    if (!b) {
      b = 'Х';
      i += 1;
    } else if (a === b) {
      b = 'Х';
      i += 1;
    } else {
      i += 2;
    }

    pairs.push([a, b]);
  }

  let result = '';

  for (const [a, b] of pairs) {
    const posA = findPosition(matrix, a);
    const posB = findPosition(matrix, b);

    if (!posA || !posB) {
      console.warn('Не найден символ:', a, b);
      continue;
    }

    // одна строка
    if (posA.row === posB.row) {
      result += matrix[posA.row][(posA.col + 1) % 6];
      result += matrix[posB.row][(posB.col + 1) % 6];
    }

    // один столбец
    else if (posA.col === posB.col) {
      result += matrix[(posA.row + 1) % 6][posA.col];
      result += matrix[(posB.row + 1) % 6][posB.col];
    }

    // прямоугольник
    else {
      result += matrix[posA.row][posB.col];
      result += matrix[posB.row][posA.col];
    }
  }

  return result;
}