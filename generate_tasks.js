import { writeFileSync } from 'fs';

// Русский алфавит (33 буквы)
const RU = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';

// ==================== ФУНКЦИИ ШИФРОВАНИЯ ====================

function caesarEncrypt(text, shift) {
  return text.split('').map(ch => {
    const idx = RU.indexOf(ch);
    if (idx === -1) return ch;
    return RU[(idx + shift) % 33];
  }).join('');
}

function atbashEncrypt(text) {
  return text.split('').map(ch => {
    const idx = RU.indexOf(ch);
    if (idx === -1) return ch;
    return RU[32 - idx];
  }).join('');
}

function polybiusEncrypt(text) {
  // Классический квадрат Полибия 5×5 (буквы объединены: Е+Ё, И+Й, Ь+Ъ)
  const grid = [
    ['А', 'Б', 'В', 'Г', 'Д'],
    ['Е', 'Ж', 'З', 'И', 'К'],   // Е=Ё, И=Й
    ['Л', 'М', 'Н', 'О', 'П'],
    ['Р', 'С', 'Т', 'У', 'Ф'],
    ['Х', 'Ц', 'Ч', 'Ш', 'Щ']
  ];
  // Буквы за пределами квадрата
  const extra = {
    'Ё': 'Е', 'Й': 'И', 'Ъ': 'Ь',
    'Ы': 'Ь', 'Ь': 'Ь', 'Э': 'Е',
    'Ю': 'У', 'Я': 'А'
  };
  
  return text.split('').map(ch => {
    if (ch === ' ') return '  ';
    let searchChar = ch;
    if (extra[ch]) searchChar = extra[ch];
    
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        if (grid[row][col] === searchChar) {
          return `${row + 1}${col + 1}`;
        }
      }
    }
    return '??';
  }).join(' ');
}

function vigenereEncrypt(text, key) {
  let result = '';
  for (let i = 0, j = 0; i < text.length; i++) {
    const ch = text[i];
    const idx = RU.indexOf(ch);
    if (idx === -1) {
      result += ch;
      continue;
    }
    const keyChar = key[j % key.length];
    const keyIdx = RU.indexOf(keyChar);
    result += RU[(idx + keyIdx) % 33];
    j++;
  }
  return result;
}

function morseEncrypt(text) {
  const morseMap = {
    'А': '.-', 'Б': '-...', 'В': '.--', 'Г': '--.', 'Д': '-..', 'Е': '.', 'Ё': '.',
    'Ж': '...-', 'З': '--..', 'И': '..', 'Й': '.---', 'К': '-.-', 'Л': '.-..',
    'М': '--', 'Н': '-.', 'О': '---', 'П': '.--.', 'Р': '.-.', 'С': '...',
    'Т': '-', 'У': '..-', 'Ф': '..-.', 'Х': '....', 'Ц': '-.-.', 'Ч': '---.',
    'Ш': '----', 'Щ': '--.-', 'Ъ': '--.--', 'Ы': '-.--', 'Ь': '-..-',
    'Э': '..-..', 'Ю': '..--', 'Я': '.-.-', ' ': '/'
  };
  return text.split('').map(ch => morseMap[ch] || ch).join(' ');
}

function playfairEncrypt(text, key) {
  const cleanKey = key.toUpperCase().replace(/[^А-ЯЁ]/g, '');
  
  // Полный алфавит + знаки
  const fullAlphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ.,!';
  
  // Строим матрицу без дубликатов
  const seen = new Set();
  const chars = [];
  
  // Сначала ключ
  for (const ch of cleanKey) {
    if (!seen.has(ch)) {
      seen.add(ch);
      chars.push(ch);
    }
  }
  
  // Потом алфавит + знаки
  for (const ch of fullAlphabet) {
    if (!seen.has(ch)) {
      seen.add(ch);
      chars.push(ch);
    }
  }
  
  const cells = chars.slice(0, 36);
  
  // Матрица 6×6
  const matrix = [];
  for (let i = 0; i < 6; i++) {
    matrix.push(cells.slice(i * 6, i * 6 + 6));
  }
  
  // Поиск позиции
  function findPos(char) {
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        if (matrix[r][c] === char) return [r, c];
      }
    }
    return null;
  }
  
  // Очищаем текст: убираем пробелы, оставляем только русские буквы
  const clean = text.toUpperCase().replace(/[^А-ЯЁ]/g, '');
  
  if (clean.length === 0) return 'ОШИБКА';
  
  // Разбиваем на пары
  const pairs = [];
  let i = 0;
  while (i < clean.length) {
    let a = clean[i];
    let b = clean[i + 1];
    
    if (!b) {
      b = 'Х'; // Добавляем Х если нечётное
      i += 1;
    } else if (a === b) {
      b = 'Х'; // Одинаковые буквы — вставляем Х
      i += 1;
    } else {
      i += 2;
    }
    
    pairs.push([a, b]);
  }
  
  // Шифруем пары
  let result = '';
  for (const [a, b] of pairs) {
    const posA = findPos(a);
    const posB = findPos(b);
    
    if (!posA || !posB) {
      console.error('Не найдена буква:', a, b);
      result += '??';
      continue;
    }
    
    const [r1, c1] = posA;
    const [r2, c2] = posB;
    
    if (r1 === r2) {
      // Одна строка — вправо
      result += matrix[r1][(c1 + 1) % 6];
      result += matrix[r2][(c2 + 1) % 6];
    } else if (c1 === c2) {
      // Один столбец — вниз
      result += matrix[(r1 + 1) % 6][c1];
      result += matrix[(r2 + 1) % 6][c2];
    } else {
      // Прямоугольник — меняем столбцы
      result += matrix[r1][c2];
      result += matrix[r2][c1];
    }
  }
  
  return result;
}

// ==================== СЛОВАРИ ====================

const words = {
  level1: [
    'ПРИВЕТ', 'ШИФР', 'ТАЙНА', 'КЛЮЧ', 'КОД', 'ЩИТ', 'МЕЧ', 'СВЕТ', 'ТЬМА', 'ЗНАК',
    'ВЕТЕР', 'ГОЛОС', 'СТЕНА', 'МОСТ', 'ЗАМОК', 'СЛЕД', 'ПУТЬ', 'ДОЖДЬ', 'ЗВУК', 'МАЯК'
  ],
  level2: [
    'СЕКРЕТНЫЙ КОД', 'ТАЙНОЕ ПОСЛАНИЕ', 'ШИФР ЦЕЗАРЯ', 'ВЗЛОМ ШИФРА',
    'ЗАЩИТА ДАННЫХ', 'КЛЮЧ ШИФРОВАНИЯ', 'ТАЙНАЯ ОПЕРАЦИЯ', 'СЕКРЕТНАЯ МИССИЯ',
    'КОДОВОЕ СЛОВО', 'АГЕНТ ПОД ПРИКРЫТИЕМ', 'ШИФРОВАННЫЙ КАНАЛ', 'ТАЙНЫЙ АГЕНТ',
    'СЕКРЕТНАЯ КОМНАТА', 'ЗАШИФРОВАННЫЙ ТЕКСТ', 'КРИПТОГРАФИЧЕСКИЙ КЛЮЧ',
    'ТАЙНАЯ ПЕРЕПИСКА', 'СЕКРЕТНЫЙ АРХИВ', 'ШИФРОВАЛЬНАЯ МАШИНА',
    'ТАЙНЫЙ ШИФР', 'КРИПТОАНАЛИТИК'
  ],
  level3: [
    'ПРИШЁЛ УВИДЕЛ ПОБЕДИЛ',
    'ЗНАНИЕ ЭТО СИЛА',
    'ИНФОРМАЦИЯ ПРАВИТ МИРОМ',
    'ШИФРЫ МЕНЯЮТ ИСТОРИЮ',
    'ТАЙНЫ ДОЛЖНЫ ОСТАВАТЬСЯ ТАЙНАМИ',
    'КРИПТОГРАФИЯ НАУКА О СЕКРЕТАХ',
    'КАЖДЫЙ ШИФР МОЖНО ВЗЛОМАТЬ',
    'БЕЗОПАСНОСТЬ ПРЕВЫШЕ ВСЕГО',
    'ДОВЕРЯЙ НО ПРОВЕРЯЙ',
    'ШИФРОВАНИЕ СПАСАЕТ ЖИЗНИ',
    'СЛОЖНЫЙ ПАРОЛЬ ЗАЛОГ УСПЕХА',
    'ТАЙНАЯ СВЯЗЬ РЕШАЕТ ИСХОД ВОЙНЫ',
    'КРИПТОГРАФЫ ГЕРОИ НЕВИДИМОГО ФРОНТА',
    'СЕКРЕТНАЯ ИНФОРМАЦИЯ ЦЕННЕЕ ЗОЛОТА',
    'ВЗЛОМ ШИФРА ЭТО ИСКУССТВО',
    'МАТЕМАТИКА ОСНОВА КРИПТОГРАФИИ',
    'КВАНТОВЫЕ КОМПЬЮТЕРЫ УГРОЗА ШИФРАМ',
    'ИСТОРИЯ ШИФРОВ ЭТО ИСТОРИЯ ВОЙН',
    'ЗАЩИТА ИНФОРМАЦИИ ЭТО ЗАЩИТА СВОБОДЫ',
    'НАСТОЯЩАЯ ТАЙНА НЕВИДИМА'
  ]
};

// Исторические справки
const histories = {
  level1: [
    'Короткое слово русского языка.',
    'Базовое слово для тренировки.',
    'Простое слово, чтобы размяться.',
    'Одно из частотных слов в криптографии.',
    'Слово, которое часто шифруют новички.'
  ],
  level2: [
    'Фраза, связанная с миром шифрования.',
    'Термин из области криптографии.',
    'Выражение, популярное среди криптографов.',
    'Фраза-пароль для доступа к секретам.',
    'Кодовое выражение агентов.'
  ],
  level3: [
    'Известное высказывание о шифрах.',
    'Цитата великого криптографа.',
    'Мудрость, скрытая за шифром.',
    'Историческая фраза о тайнах.',
    'Афоризм о безопасности информации.'
  ]
};

// Ключи для шифров
const vigenereKeys = ['КЛЮЧ', 'ШИФР', 'ТАЙНА', 'СЕКРЕТ', 'КОД', 'ЗАЩИТА', 'АГЕНТ', 'ВЗЛОМ', 'КРИПТО', 'МАСТЕР'];
const playfairKeys = ['ШИФР', 'КЛЮЧ', 'ТАЙНА', 'СЕКРЕТ', 'КОД'];

// ==================== ГЕНЕРАЦИЯ ====================

const tasks = [];
let id = 1;

const ciphers = [
  { name: 'caesar', generator: caesarEncrypt, settings: (level) => ({ shift: level === 1 ? 3 : level === 2 ? 7 : 11 }) },
  { name: 'atbash', generator: atbashEncrypt, settings: () => ({}) },
  { name: 'polybius', generator: polybiusEncrypt, settings: () => ({}) },
  { name: 'vigenere', generator: (text, level) => vigenereEncrypt(text, vigenereKeys[(level - 1) * 3 + Math.floor(Math.random() * 3)]), settings: (level) => ({ key: vigenereKeys[(level - 1) * 3] }) },
  { name: 'morse', generator: morseEncrypt, settings: () => ({}) },
  { name: 'playfair', generator: (text, level) => playfairEncrypt(text, playfairKeys[level - 1]), settings: (level) => ({ key: playfairKeys[level - 1] }) }
];

for (const cipher of ciphers) {
  for (let level = 1; level <= 3; level++) {
    const wordList = words['level' + level];
    const historyList = histories['level' + level];
    
    // Для Виженера и Плейфера — фиксированный ключ для каждого уровня
    const settings = cipher.settings(level);
    
    for (let i = 0; i < 20; i++) {
      const plaintext = wordList[i];
      let ciphertext;
      
      if (cipher.name === 'vigenere') {
        ciphertext = vigenereEncrypt(plaintext, settings.key);
      } else if (cipher.name === 'playfair') {
        ciphertext = playfairEncrypt(plaintext, settings.key);
      } else {
        ciphertext = cipher.generator(plaintext, level);
      }
      
      tasks.push({
        id: id++,
        cipher: cipher.name,
        level: level,
        plaintext: plaintext,
        ciphertext: ciphertext,
        settings: settings,
        history: historyList[i % historyList.length]
      });
    }
  }
}

// Записываем в файл
writeFileSync('./data/tasks.json', JSON.stringify(tasks, null, 2), 'utf-8');
console.log(`✅ Сгенерировано ${tasks.length} заданий (360)`);
console.log('📁 Файл сохранён: ./data/tasks.json');