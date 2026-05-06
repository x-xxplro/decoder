import { decryptCaesar } from '../ciphers/caesar.js';
import { decryptAtbash } from '../ciphers/atbash.js';
import { decryptVigenere } from '../ciphers/vigenere.js';
import { getMorseTable } from '../ciphers/morse.js';
import { decryptPolybius } from '../ciphers/polybius.js';
import { decryptPlayfair } from '../ciphers/playfair.js';

export function renderDraft(container, task, state) {
  const { cipher, ciphertext, settings } = task;
  container.innerHTML = '';
  
  if (!state.isDraftAvailable && cipher !== 'vigenere' && cipher !== 'playfair') {
    container.innerHTML = '<div class="label">// ЧЕРНОВИК ЗАБЛОКИРОВАН (уровень Криптограф)</div>';
    return;
  }

  switch (cipher) {
    case 'caesar':
      renderCaesarDraft(container, ciphertext, settings, state);
      break;
    case 'atbash':
      renderAtbashDraft(container, ciphertext, state);
      break;
    case 'polybius':
      renderPolybiusDraft(container, ciphertext, state);
      break;
    case 'vigenere':
      renderVigenereDraft(container, ciphertext, state);
      break;
    case 'morse':
      renderMorseDraft(container, ciphertext, state);
      break;
    case 'playfair':
      // ИСПРАВЛЕНО: передаём 3 параметра, не 4
      renderPlayfairDraft(container, ciphertext, state);
      break;
    default:
      container.innerHTML = '<p>Черновик не поддерживается для этого шифра.</p>';
  }
}

function renderCaesarDraft(container, ciphertext, settings, state) {
  const initialShift = settings.shift || 0;
  const plaintext = state.task.plaintext;
  const isHintsAvailable = state.isHintsAvailable; // уровень Новичок
  
  container.innerHTML = `
    <div class="label">// SCRATCHPAD: Цезарь</div>
    <div style="margin-bottom: 1rem;">
      <label style="display: flex; align-items: center; gap: 10px;">
        <span>Сдвиг:</span>
        <input type="range" id="caesarShift" min="0" max="32" value="${initialShift}" style="flex: 1;" />
        <span id="shiftValue" style="min-width: 30px; text-align: center; font-weight: bold;">${initialShift}</span>
      </label>
    </div>
    <div class="cipher-text" id="decryptedPreview"></div>
    <button id="caesarClear">[ ОЧИСТИТЬ ]</button>
  `;
  
  const shiftInput = document.getElementById('caesarShift');
  const shiftDisplay = document.getElementById('shiftValue');
  const previewDiv = document.getElementById('decryptedPreview');
  
  // Функция обновления preview с подсветкой
  function updatePreview(shift) {
    const decrypted = decryptCaesar(ciphertext, shift);
    
    if (isHintsAvailable) {
      // Подсвечиваем правильные буквы зелёным фоном
      let html = '';
      for (let i = 0; i < decrypted.length; i++) {
        const char = decrypted[i];
        const isCorrect = i < plaintext.length && char.toUpperCase() === plaintext[i].toUpperCase();
        if (isCorrect && char !== ' ') {
          html += `<span style="background-color: rgba(0, 255, 65, 0.3); padding: 2px 4px; border-radius: 2px;">${char}</span>`;
        } else {
          html += char;
        }
      }
      previewDiv.innerHTML = html;
    } else {
      previewDiv.textContent = decrypted;
    }
  }
  
  // Обработчик ползунка
  shiftInput.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    shiftDisplay.textContent = val;
    updatePreview(val);
  });
  
  // Кнопка очистки
  document.getElementById('caesarClear').addEventListener('click', () => {
    shiftInput.value = 0;
    shiftDisplay.textContent = '0';
    updatePreview(0);
  });
  
  // Начальное отображение
  updatePreview(initialShift);
}

function renderAtbashDraft(container, ciphertext, state) {
  const isHintsAvailable = state.isHintsAvailable; // уровень Новичок
  const plaintext = state.task.plaintext;
  
  // Таблица соответствия Атбаш (русский алфавит)
  const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
  const reversed = alphabet.split('').reverse().join('');
  
  // Разбиваем на две строки для отображения
  const topRow = alphabet.split('');
  const bottomRow = reversed.split('');
  
  container.innerHTML = `
    <div class="label">// SCRATCHPAD: Атбаш</div>
    
    <!-- Таблица соответствия -->
    <div class="atbash-table" style="margin-bottom: 1.5rem;">
      <div style="display: grid; grid-template-columns: repeat(11, 1fr); gap: 2px; font-size: 0.75rem; text-align: center; margin-bottom: 4px;">
        ${topRow.map(ch => `<span style="color: #888; padding: 4px;">${ch}</span>`).join('')}
      </div>
      <div style="display: grid; grid-template-columns: repeat(11, 1fr); gap: 2px; font-size: 0.75rem; text-align: center; border-top: 1px solid #333; padding-top: 4px;">
        ${bottomRow.map(ch => `<span style="color: var(--text-primary); padding: 4px;">${ch}</span>`).join('')}
      </div>
      <div style="display: grid; grid-template-columns: repeat(11, 1fr); gap: 2px; font-size: 0.65rem; text-align: center; color: #555; margin-top: 2px;">
        ${topRow.map((ch, i) => `<span>${ch}↔${bottomRow[i]}</span>`).join('')}
      </div>
    </div>
    
    <!-- Строка шифротекста -->
    <div class="cipher-text" style="font-size: 1.8rem; letter-spacing: 0.8rem; margin-bottom: 1rem;">
      ${ciphertext}
    </div>
    
    <!-- Поле для ручного ввода -->
    <div style="margin-bottom: 1rem;">
      <label style="display: block; margin-bottom: 0.5rem; color: #888;">Введите расшифровку для каждой буквы:</label>
      <div id="atbashInputRow" style="display: flex; gap: 5px; flex-wrap: wrap; align-items: center;">
        ${ciphertext.split('').map((ch, idx) => {
          if (ch === ' ') {
            return '<span style="width: 20px; display: inline-block;"></span>';
          }
          return `<input type="text" 
                         maxlength="1" 
                         class="atbash-char-input" 
                         data-index="${idx}" 
                         data-expected="${plaintext[idx] || ''}"
                         style="width: 35px; height: 40px; text-align: center; font-size: 1.2rem; border: 1px solid #333; background: transparent; color: var(--text-primary);" />`;
        }).join('')}
      </div>
    </div>
    
    <button id="atbashClear">[ ОЧИСТИТЬ ]</button>
    <div id="atbashPartial" style="margin-top: 0.5rem; font-size: 0.8rem; color: #888;"></div>
  `;
  
  // Обработчики для полей ввода
  const inputs = document.querySelectorAll('.atbash-char-input');
  
  inputs.forEach(input => {
    input.addEventListener('input', function(e) {
      const value = this.value.toUpperCase();
      this.value = value;
      
      const expected = this.dataset.expected;
      
      if (isHintsAvailable && value) {
        // Подсветка правильных букв зелёным
        if (value === expected.toUpperCase()) {
          this.style.backgroundColor = 'rgba(0, 255, 65, 0.3)';
          this.style.borderColor = '#00FF41';
          this.style.boxShadow = '0 0 5px rgba(0, 255, 65, 0.4)';
        } else {
          this.style.backgroundColor = 'rgba(255, 51, 51, 0.1)';
          this.style.borderColor = '#333';
          this.style.boxShadow = 'none';
        }
      }
      
      // Автоматический переход к следующему полю
      if (value && this.nextElementSibling && this.nextElementSibling.classList.contains('atbash-char-input')) {
        this.nextElementSibling.focus();
      }
      
      updatePartialAnswer();
    });
    
    // Переход по стрелкам
    input.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowRight' && this.nextElementSibling && this.nextElementSibling.classList.contains('atbash-char-input')) {
        e.preventDefault();
        this.nextElementSibling.focus();
      }
      if (e.key === 'ArrowLeft' && this.previousElementSibling && this.previousElementSibling.classList.contains('atbash-char-input')) {
        e.preventDefault();
        this.previousElementSibling.focus();
      }
    });
  });
  
  // Кнопка очистки
  document.getElementById('atbashClear').addEventListener('click', () => {
    inputs.forEach(inp => {
      inp.value = '';
      inp.style.backgroundColor = 'transparent';
      inp.style.borderColor = '#333';
      inp.style.boxShadow = 'none';
    });
    document.getElementById('atbashPartial').textContent = '';
    if (inputs[0]) inputs[0].focus();
  });
  
  // Собираем частичный ответ
  function updatePartialAnswer() {
    let partial = '';
    const allInputs = document.querySelectorAll('.atbash-char-input');
    allInputs.forEach(inp => {
      partial += inp.value || '_';
    });
    document.getElementById('atbashPartial').textContent = `Текущий ввод: ${partial}`;
  }
  
  // Фокус на первом поле
  if (inputs[0]) inputs[0].focus();
}

function renderPolybiusDraft(container, ciphertext, state) {
  const isHintsAvailable = state.isHintsAvailable;
  const plaintext = state.task.plaintext;
  
  // Классическая сетка 5×5 (как в генераторе)
  const gridData = [
    ['А','Б','В','Г','Д'],
    ['Е','Ж','З','И','К'],
    ['Л','М','Н','О','П'],
    ['Р','С','Т','У','Ф'],
    ['Х','Ц','Ч','Ш','Щ']
  ];
  
  // Объединённые буквы
  const extraInfo = {
    'Е': 'Е/Ё', 'И': 'И/Й', 'Ь': 'Ь/Ъ/Ы',
    'У': 'У/Ю', 'А': 'А/Я', 'Э': 'Е (Э)'
  };
  
  function findInGrid(coords) {
    const row = parseInt(coords[0]) - 1;
    const col = parseInt(coords[1]) - 1;
    if (row >= 0 && row < 5 && col >= 0 && col < 5 && gridData[row][col]) {
      const letter = gridData[row][col];
      return extraInfo[letter] || letter;
    }
    return '?';
  }
  
  const pairs = ciphertext.match(/\d{2}/g) || [];
  
  container.innerHTML = `
    <div class="label">// SCRATCHPAD: Квадрат Полибия (5×5)</div>
    
    <!-- Статичная сетка -->
    <div style="margin-bottom: 1.5rem;">
      <div style="color: #888; font-size: 0.8rem; margin-bottom: 0.5rem;">Таблица координат:</div>
      <div style="display: inline-block; border: 1px solid #333; background: rgba(0,0,0,0.3);">
        <div style="display: grid; grid-template-columns: 35px repeat(5, 55px); gap: 0; text-align: center; font-size: 0.7rem; color: #666; border-bottom: 1px solid #333;">
          <div style="padding: 6px;"></div>
          <div style="padding: 6px;">1</div><div style="padding: 6px;">2</div><div style="padding: 6px;">3</div><div style="padding: 6px;">4</div><div style="padding: 6px;">5</div>
        </div>
        ${gridData.map((row, rowIdx) => `
          <div style="display: grid; grid-template-columns: 35px repeat(5, 55px); gap: 0; text-align: center; ${rowIdx < 4 ? 'border-bottom: 1px solid #222;' : ''}">
            <div style="padding: 10px 4px; color: #666; font-size: 0.7rem;">${rowIdx + 1}</div>
            ${row.map((cell, colIdx) => `
              <div style="padding: 10px 4px; color: var(--text-primary); font-size: 1.1rem; ${colIdx < 4 ? 'border-right: 1px solid #222;' : ''}">
                ${cell}
                ${extraInfo[cell] ? `<div style="font-size: 0.55rem; color: #555; margin-top: 2px;">${extraInfo[cell]}</div>` : ''}
              </div>
            `).join('')}
          </div>
        `).join('')}
      </div>
      <div style="margin-top: 0.5rem; font-size: 0.7rem; color: #555;">
        ✦ Буквы объединены: Е/Ё, И/Й, Ь/Ъ/Ы, У/Ю, А/Я, Э→Е
      </div>
    </div>
    
    <!-- Остальное без изменений -->
    <div style="margin-bottom: 1rem;">
      <span style="color: #888; font-size: 0.8rem;">Шифротекст:</span>
      <div class="cipher-text" style="font-size: 1.4rem; letter-spacing: 0.5rem; padding: 0.5rem;">
        ${ciphertext}
      </div>
    </div>
    
    <div style="margin-bottom: 1rem; font-size: 0.8rem; color: #888;">
      Координаты: <span style="color: var(--text-primary); letter-spacing: 2px;">${pairs.join(' ')}</span>
    </div>
    
    <div style="margin-bottom: 1rem;">
      <label style="display: block; margin-bottom: 0.5rem; color: #888;">Введите буквы по координатам:</label>
      <div id="polybiusInputRow" style="display: flex; gap: 8px; flex-wrap: wrap; align-items: flex-end;">
        ${pairs.map((pair, idx) => {
          const expectedChar = plaintext[idx] || '';
          const gridLetter = findInGrid(pair);
          return `<div style="display: flex; flex-direction: column; align-items: center; gap: 3px;" title="Координаты ${pair} → ${gridLetter}">
            <span style="font-size: 0.65rem; color: #555;">${pair}</span>
            <input type="text" 
                   maxlength="1" 
                   class="polybius-char-input" 
                   data-index="${idx}" 
                   data-coords="${pair}"
                   data-expected="${expectedChar}"
                   data-gridletter="${gridLetter}"
                   style="width: 40px; height: 44px; text-align: center; font-size: 1.3rem; border: 1px solid #333; background: transparent; color: var(--text-primary);" />
          </div>`;
        }).join('')}
      </div>
    </div>
    
    <button id="polybiusClear">[ ОЧИСТИТЬ ]</button>
    
    <div id="polybiusPartial" style="margin-top: 0.8rem; font-size: 0.85rem; color: #888; min-height: 1.5rem;"></div>
  `;
  
  const inputs = document.querySelectorAll('.polybius-char-input');
  
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      const value = this.value.toUpperCase();
      this.value = value;
      
      const expected = this.dataset.expected;
      
      if (isHintsAvailable && value) {
        if (value === expected.toUpperCase()) {
          this.style.backgroundColor = 'rgba(0, 255, 65, 0.3)';
          this.style.borderColor = '#00FF41';
          this.style.boxShadow = '0 0 6px rgba(0, 255, 65, 0.4)';
        } else {
          this.style.backgroundColor = 'rgba(255, 51, 51, 0.15)';
          this.style.borderColor = '#FF3333';
          this.style.boxShadow = 'none';
        }
      }
      
      updatePartialAnswer();
      
      if (value) {
        const parentDiv = this.closest('div');
        const nextDiv = parentDiv.nextElementSibling;
        if (nextDiv) {
          const nextInput = nextDiv.querySelector('input');
          if (nextInput) setTimeout(() => nextInput.focus(), 50);
        }
      }
    });
    
    input.addEventListener('keydown', function(e) {
      const parentDiv = this.closest('div');
      
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextDiv = parentDiv.nextElementSibling;
        if (nextDiv) { const ni = nextDiv.querySelector('input'); if (ni) ni.focus(); }
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevDiv = parentDiv.previousElementSibling;
        if (prevDiv) { const pi = prevDiv.querySelector('input'); if (pi) pi.focus(); }
      }
      if (e.key === 'Backspace' && !this.value) {
        e.preventDefault();
        const prevDiv = parentDiv.previousElementSibling;
        if (prevDiv) {
          const prevInput = prevDiv.querySelector('input');
          if (prevInput) {
            prevInput.value = '';
            prevInput.focus();
            prevInput.style.backgroundColor = 'transparent';
            prevInput.style.borderColor = '#333';
            prevInput.style.boxShadow = 'none';
            updatePartialAnswer();
          }
        }
      }
    });
    
    input.addEventListener('focus', function() {
      this.style.borderColor = '#00FF41';
      this.style.boxShadow = '0 0 8px rgba(0, 255, 65, 0.3)';
      this.title = `Координаты ${this.dataset.coords} → ${this.dataset.gridletter}`;
    });
    
    input.addEventListener('blur', function() {
      if (!isHintsAvailable || !this.value) {
        this.style.borderColor = '#333';
        this.style.boxShadow = 'none';
      }
    });
  });
  
  document.getElementById('polybiusClear').addEventListener('click', () => {
    inputs.forEach(inp => {
      inp.value = '';
      inp.style.backgroundColor = 'transparent';
      inp.style.borderColor = '#333';
      inp.style.boxShadow = 'none';
    });
    document.getElementById('polybiusPartial').textContent = '';
    if (inputs[0]) inputs[0].focus();
  });
  
  function updatePartialAnswer() {
    let partial = '';
    document.querySelectorAll('.polybius-char-input').forEach(inp => {
      partial += inp.value || '_';
    });
    document.getElementById('polybiusPartial').textContent = `Текущий ввод: ${partial}`;
  }
  
  if (inputs[0]) inputs[0].focus();
}

function renderVigenereDraft(container, ciphertext, state) {
  const isHintsAvailable = state.isHintsAvailable;
  const isDraftAvailable = state.isDraftAvailable;
  const settings = state.task.settings;
  const plaintext = state.task.plaintext;
  
  const taskKey = settings?.key || '';
  const alphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
  
  // Загадки для Криптографа
  const riddles = {
    'КЛЮЧ': 'Меня вставляют в замок, но я не железный. Без меня шифр не открыть. Что я?',
    'ШИФР': 'Я прячу слова за занавесом букв. Меня придумал Цезарь, а усовершенствовал Виженер. Что я?',
    'ТАЙНА': 'Меня знают двое, и пока молчат — я существую. Стоит одному рассказать — я исчезаю. Что я?',
    'СЕКРЕТ': 'Я лежу на дне души, меня доверяют лишь избранным. Разгласишь — пропаду. Что я?',
    'КОД': 'Я — набор символов, понятный лишь посвящённым. Программисты пишут меня каждый день. Что я?',
    'ЗАЩИТА': 'Я стою на страже данных, но я не антивирус. Я сложнее пароля. Что я?',
    'АГЕНТ': 'Я работаю под прикрытием, у меня есть позывной. Моя задача — передать сообщение. Кто я?',
    'КРИПТО': 'Моё имя с греческого — "тайный". Я прячу смысл от чужих глаз. Что я?',
    'МАСТЕР': 'Я достиг высот в своём деле. Ключ и шифр подчиняются мне. Кто я?',
    'ВЗЛОМ': 'Я — то, чего боится каждый шифр. Меня совершают хакеры. Что я?'
  };
  
  const riddle = riddles[taskKey] || `Подсказка: слово из ${taskKey.length} букв, начинается на "${taskKey[0]}" и заканчивается на "${taskKey[taskKey.length-1]}"`;
  
  // Генерация таблицы Виженера
  function generateVigenereTable() {
    let html = '<div style="overflow: auto; max-height: 400px; border: 1px solid #222;">';
    html += '<table style="border-collapse: collapse; font-family: var(--font-mono);">';
    
    // Заголовок столбцов
    html += '<thead><tr>';
    html += '<th style="position: sticky; top: 0; left: 0; background: #0a0a0a; z-index: 2; padding: 6px 8px; font-size: 0.7rem; color: #888; border-right: 2px solid #333; border-bottom: 2px solid #333;">КЛЮЧ→</th>';
    for (let j = 0; j < 33; j++) {
      html += `<th style="position: sticky; top: 0; background: #0a0a0a; z-index: 1; padding: 6px 4px; font-size: 0.7rem; color: #00FF41; font-weight: bold; border-bottom: 2px solid #333; min-width: 24px; text-align: center;">${alphabet[j]}</th>`;
    }
    html += '</tr></thead><tbody>';
    
    // Строки таблицы
    for (let i = 0; i < 33; i++) {
      html += '<tr>';
      html += `<td style="position: sticky; left: 0; background: #0a0a0a; z-index: 1; padding: 6px 8px; font-size: 0.7rem; color: #00FF41; font-weight: bold; border-right: 2px solid #333; text-align: center;">${alphabet[i]}</td>`;
      
      for (let j = 0; j < 33; j++) {
        const char = alphabet[(j + i) % 33];
        html += `<td style="padding: 4px 2px; font-size: 0.7rem; color: #aaa; text-align: center; ${j % 6 === 0 && j > 0 ? 'border-left: 1px solid #222;' : ''}">${char}</td>`;
      }
      html += '</tr>';
    }
    
    html += '</tbody></table></div>';
    return html;
  }
  
  const cipherChars = ciphertext.split('');
  
  container.innerHTML = `
    <div class="label">// SCRATCHPAD: Виженер</div>
    
    ${isDraftAvailable ? `
      <!-- Подсказка с ключом -->
      <div style="background: rgba(0,255,65,0.05); border: 1px solid rgba(0,255,65,0.15); padding: 0.8rem 1rem; margin-bottom: 1rem; border-radius: 2px; display: flex; align-items: center; gap: 1rem;">
        <span style="font-size: 0.7rem; color: #888;">🔑 КЛЮЧ:</span>
        <span style="font-size: 1.2rem; color: #00FF41; font-weight: bold; letter-spacing: 4px; text-shadow: 0 0 8px rgba(0,255,65,0.4);">${taskKey}</span>
        <span style="font-size: 0.6rem; color: #555;">(повторяется циклически)</span>
      </div>
      
      <!-- Таблица -->
      <details style="margin-bottom: 1rem;">
        <summary style="cursor: pointer; font-size: 0.8rem; color: #888; padding: 0.6rem 1rem; border: 1px solid #333; background: rgba(0,0,0,0.3); user-select: none;">
          📊 ТАБЛИЦА ВИЖЕНЕРА — РАЗВЕРНУТЬ/СВЕРНУТЬ
        </summary>
        <div style="border: 1px solid #333; border-top: none;">
          ${generateVigenereTable()}
        </div>
      </details>
      
      <!-- ПРАВИЛЬНАЯ легенда -->
      <div style="display: flex; gap: 1.5rem; margin-bottom: 1rem; font-size: 0.65rem; color: #888; flex-wrap: wrap;">
        <span>🔑 <b style="color:#00FF41;">Столбец</b> = буква ключа</span>
        <span>🔍 В столбце найти <b style="color:#FFD700;">букву шифротекста</b></span>
        <span>📤 <b style="color:#00FF41;">Строка</b> этой ячейки = буква ответа</span>
      </div>
      
      <!-- Шифротекст -->
      <div style="margin-bottom: 1rem;">
        <span style="font-size: 0.7rem; color: #888;">ШИФРОТЕКСТ:</span>
        <div class="cipher-text" style="font-size: 1.5rem; letter-spacing: 0.6rem; padding: 0.5rem;">
          ${ciphertext}
        </div>
      </div>
      
      <!-- Ключ над полями ввода -->
      <div style="margin-bottom: 0.3rem; font-size: 0.65rem; color: #00FF41; letter-spacing: 2px; opacity: 0.8;">
        Ключ: ${cipherChars.map((ch, i) => ch === ' ' ? '·' : taskKey[i % taskKey.length]).join(' ')}
      </div>
      
      <!-- Поля для ручного ввода -->
      <div style="margin-bottom: 1rem;">
        <label style="display: block; font-size: 0.7rem; color: #888; margin-bottom: 0.5rem;">
          ВВЕДИТЕ РАСШИФРОВАННЫЕ БУКВЫ:
        </label>
        <div id="vigenereInputRow" style="display: flex; gap: 3px; flex-wrap: wrap; align-items: flex-end;">
          ${cipherChars.map((ch, idx) => {
            if (ch === ' ') {
              return '<span style="width: 14px;"></span>';
            }
            const expectedChar = plaintext[idx] || '';
            const keyChar = taskKey[idx % taskKey.length];
            // Ищем правильный ответ через таблицу
            const keyIdx = alphabet.indexOf(keyChar); // столбец
            // В этом столбце ищем букву шифротекста
            let correctChar = '?';
            for (let row = 0; row < 33; row++) {
              if (alphabet[(keyIdx + row) % 33] === ch) {
                correctChar = alphabet[row];
                break;
              }
            }
            
            return `<div style="display: flex; flex-direction: column; align-items: center; gap: 2px;">
              <span style="font-size: 0.5rem; color: #555;">${ch}</span>
              <input type="text" 
                     maxlength="1" 
                     class="vigenere-char-input" 
                     data-index="${idx}" 
                     data-cipher="${ch}"
                     data-key="${keyChar}"
                     data-expected="${expectedChar}"
                     data-correct="${correctChar}"
                     style="width: 32px; height: 38px; text-align: center; font-size: 1rem; border: 1px solid #333; background: transparent; color: var(--text-primary);" />
            </div>`;
          }).join('')}
        </div>
      </div>
      
      <button id="vigenereClear">[ ОЧИСТИТЬ ]</button>
      <div id="vigenerePartial" style="margin-top: 0.5rem; font-size: 0.75rem; color: #888; min-height: 1.2rem;"></div>
      
      <!-- ИСПРАВЛЕННАЯ инструкция -->
      <div style="margin-top: 1rem; padding: 0.8rem; border: 1px solid #222; font-size: 0.6rem; color: #555; line-height: 1.8;">
        <b style="color:#888;">📖 КАК РАСШИФРОВАТЬ ВИЖЕНЕРА:</b><br>
        1️⃣ Возьмите букву <b style="color:#00FF41;">ключа</b> (показана над полем) — это <b style="color:#00FF41;">СТОЛБЕЦ</b> в таблице<br>
        2️⃣ В этом столбце найдите <b style="color:#FFD700;">букву шифротекста</b> (жёлтая)<br>
        3️⃣ Буква в начале этой <b style="color:#00FF41;">СТРОКИ</b> (зелёный столбец слева) — это <b style="color:#00FF41;">ОТВЕТ</b><br>
        4️⃣ Впишите найденную букву в поле под шифротекстом<br>
        <br><i>Пример: ключ=К, шифр=Х → столбец "К", ищем "Х" → строка "Ц" → ответ "Ц"</i>
      </div>
    ` : `
      <!-- КРИПТОГРАФ: загадка -->
      <div style="background: rgba(255,51,51,0.06); border: 2px solid rgba(255,51,51,0.3); padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 2px;">
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
          <span style="font-size: 1.5rem;">⚠</span>
          <span style="font-size: 0.8rem; color: #FF3333; letter-spacing: 2px; font-weight: bold;">ЗАГАДКА КРИПТОГРАФА</span>
        </div>
        <p style="font-size: 1rem; color: #ddd; margin: 0.8rem 0; font-style: italic; line-height: 1.6; text-align: center;">
          «${riddle}»
        </p>
        <div style="text-align: center; margin-top: 1rem;">
          <span style="font-size: 0.65rem; color: #666; letter-spacing: 1px;">
            ОТВЕТ — КЛЮЧЕВОЕ СЛОВО (${taskKey.length} БУКВ)
          </span>
        </div>
        <div style="text-align: center; margin-top: 0.8rem;">
          <span style="font-size: 0.6rem; color: #555;">
            ${taskKey.length > 3 ? `Первая буква: <b style="color:#FF3333;">${taskKey[0]}</b>` : ''}
            ${taskKey.length > 4 ? ` | Последняя: <b style="color:#FF3333;">${taskKey[taskKey.length-1]}</b>` : ''}
          </span>
        </div>
      </div>
      
      <div class="cipher-text" style="font-size: 1.8rem; letter-spacing: 0.8rem; padding: 1rem; text-align: center;">
        ${ciphertext}
      </div>
      
      <p style="text-align: center; font-size: 0.65rem; color: #555; margin-top: 1rem;">
        Разгадайте загадку → определите ключ → расшифруйте текст
      </p>
    `}
  `;
  
  // Обработчики для полей ввода
  if (isDraftAvailable) {
    const inputs = document.querySelectorAll('.vigenere-char-input');
    
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        const value = this.value.toUpperCase();
        this.value = value;
        
        const expected = this.dataset.expected;
        
        if (isHintsAvailable && value) {
          if (value === expected.toUpperCase()) {
            this.style.backgroundColor = 'rgba(0, 255, 65, 0.3)';
            this.style.borderColor = '#00FF41';
            this.style.boxShadow = '0 0 6px rgba(0, 255, 65, 0.4)';
          } else {
            this.style.backgroundColor = 'rgba(255, 51, 51, 0.12)';
            this.style.borderColor = '#FF3333';
            this.style.boxShadow = 'none';
          }
        }
        
        updatePartialAnswer();
        
        if (value) {
          const parentDiv = this.closest('div');
          const nextDiv = parentDiv.nextElementSibling;
          if (nextDiv) {
            const nextInput = nextDiv.querySelector('input');
            if (nextInput) setTimeout(() => nextInput.focus(), 50);
          }
        }
      });
      
      input.addEventListener('keydown', function(e) {
        const parentDiv = this.closest('div');
        
        if (e.key === 'ArrowRight' || e.key === 'Tab') {
          e.preventDefault();
          const nd = parentDiv.nextElementSibling;
          if (nd) { const ni = nd.querySelector('input'); if (ni) ni.focus(); }
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const pd = parentDiv.previousElementSibling;
          if (pd) { const pi = pd.querySelector('input'); if (pi) pi.focus(); }
        }
        if (e.key === 'Backspace' && !this.value) {
          e.preventDefault();
          const pd = parentDiv.previousElementSibling;
          if (pd) {
            const pi = pd.querySelector('input');
            if (pi) {
              pi.value = '';
              pi.focus();
              pi.style.backgroundColor = 'transparent';
              pi.style.borderColor = '#333';
              pi.style.boxShadow = 'none';
              updatePartialAnswer();
            }
          }
        }
      });
      
      input.addEventListener('focus', function() {
        this.style.borderColor = '#00FF41';
        this.style.boxShadow = '0 0 6px rgba(0, 255, 65, 0.3)';
        this.title = `Ключ:${this.dataset.key} → столбец, ищем "${this.dataset.cipher}" → ответ:${this.dataset.correct}`;
      });
      
      input.addEventListener('blur', function() {
        if (!isHintsAvailable || !this.value) {
          this.style.borderColor = '#333';
          this.style.boxShadow = 'none';
        }
      });
    });
    
    document.getElementById('vigenereClear').addEventListener('click', () => {
      inputs.forEach(inp => {
        inp.value = '';
        inp.style.backgroundColor = 'transparent';
        inp.style.borderColor = '#333';
        inp.style.boxShadow = 'none';
      });
      document.getElementById('vigenerePartial').textContent = '';
      if (inputs[0]) inputs[0].focus();
    });
    
    function updatePartialAnswer() {
      let partial = '';
      document.querySelectorAll('.vigenere-char-input').forEach(inp => {
        partial += inp.value || '_';
      });
      document.getElementById('vigenerePartial').textContent = `Текущий ввод: ${partial}`;
    }
    
    if (inputs[0]) inputs[0].focus();
  }
}

function renderMorseDraft(container, ciphertext, state) {
  const isHintsAvailable = state.isHintsAvailable;
  const isDraftAvailable = state.isDraftAvailable;
  const plaintext = state.task.plaintext;
  
  // Таблица Морзе
  const morseMap = {
    'А': '.-', 'Б': '-...', 'В': '.--', 'Г': '--.', 'Д': '-..', 'Е': '.', 'Ё': '.',
    'Ж': '...-', 'З': '--..', 'И': '..', 'Й': '.---', 'К': '-.-', 'Л': '.-..',
    'М': '--', 'Н': '-.', 'О': '---', 'П': '.--.', 'Р': '.-.', 'С': '...',
    'Т': '-', 'У': '..-', 'Ф': '..-.', 'Х': '....', 'Ц': '-.-.', 'Ч': '---.',
    'Ш': '----', 'Щ': '--.-', 'Ъ': '--.--', 'Ы': '-.--', 'Ь': '-..-',
    'Э': '..-..', 'Ю': '..--', 'Я': '.-.-'
  };
  
  // Разбиваем шифротекст на группы
  const words = ciphertext.split('/').map(w => w.trim());
  const allGroups = [];
  words.forEach((word, wIdx) => {
    const letters = word.split(/\s+/);
    letters.forEach((group, lIdx) => {
      if (group) {
        allGroups.push({
          group: group,
          isLastInWord: lIdx === letters.length - 1,
          isLastWord: wIdx === words.length - 1
        });
      }
    });
  });
  
  container.innerHTML = `
    <div class="label">// SCRATCHPAD: Азбука Морзе</div>
    
    ${isDraftAvailable ? `
      <!-- Таблица Морзе (крупнее) -->
      <details style="margin-bottom: 1.5rem;" open>
        <summary style="cursor: pointer; font-size: 0.9rem; color: #888; padding: 0.8rem 1.2rem; border: 1px solid #333; background: rgba(0,0,0,0.3); user-select: none; letter-spacing: 1px;">
          📡 ТАБЛИЦА АЗБУКИ МОРЗЕ — РАЗВЕРНУТЬ/СВЕРНУТЬ
        </summary>
        <div style="border: 1px solid #333; border-top: none; background: rgba(0,0,0,0.2); padding: 1.2rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px;">
            ${Object.entries(morseMap).map(([letter, code]) => `
              <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; border: 1px solid #333; border-radius: 3px; font-size: 0.9rem; background: rgba(0,0,0,0.2);">
                <span style="color: #00FF41; font-weight: bold; font-size: 1.1rem; min-width: 24px; text-align: center;">${letter}</span>
                <span style="color: #ddd; letter-spacing: 3px; font-size: 0.95rem; font-weight: 500;">${code}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </details>
      
      <!-- Легенда -->
      <div style="display: flex; gap: 2rem; margin-bottom: 1.2rem; font-size: 0.7rem; color: #888;">
        <span>/ <b style="color:#888;">Разделитель слов</b></span>
      </div>
      
      <!-- Шифротекст -->
      <div style="margin-bottom: 1.2rem;">
        <span style="font-size: 0.75rem; color: #888;">ШИФРОТЕКСТ:</span>
        <div class="cipher-text" style="font-size: 1.4rem; letter-spacing: 0.5rem; padding: 0.6rem;">
          ${ciphertext}
        </div>
      </div>
      
      <!-- Поля для ручного ввода -->
      <div style="margin-bottom: 1rem;">
        <label style="display: block; font-size: 0.75rem; color: #888; margin-bottom: 0.6rem;">
          ВВЕДИТЕ РАСШИФРОВАННЫЕ БУКВЫ:
        </label>
        <div id="morseInputRow" style="display: flex; gap: 5px; flex-wrap: wrap; align-items: flex-end;">
          ${allGroups.map((item, idx) => {
            const expectedChar = plaintext[idx] || '';
            
            return `<div style="display: flex; flex-direction: column; align-items: center; gap: 4px; ${item.isLastInWord && !item.isLastWord ? 'margin-right: 14px;' : ''}">
              <span style="font-size: 0.6rem; color: #555; letter-spacing: 1.5px; max-width: 70px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${item.group}">${item.group}</span>
              <input type="text" 
                     maxlength="1" 
                     class="morse-char-input" 
                     data-index="${idx}" 
                     data-group="${item.group}"
                     data-expected="${expectedChar}"
                     style="width: 36px; height: 42px; text-align: center; font-size: 1.1rem; border: 1px solid #333; background: transparent; color: var(--text-primary);" />
            </div>`;
          }).join('')}
        </div>
      </div>
      
      <button id="morseClear">[ ОЧИСТИТЬ ]</button>
      <div id="morsePartial" style="margin-top: 0.6rem; font-size: 0.8rem; color: #888; min-height: 1.2rem;"></div>
      
      <!-- Инструкция -->
      <div style="margin-top: 1rem; padding: 0.7rem; border: 1px solid #222; font-size: 0.65rem; color: #555; line-height: 1.7;">
        <b style="color:#888;">📖 ИНСТРУКЦИЯ:</b><br>
        1. Посмотрите на код из <b style="color:#FFD700;">точек (●) и тире (▬)</b> над полем ввода<br>
        2. Найдите этот код в <b style="color:#00FF41;">таблице</b> (в правой колонке)<br>
        3. <b style="color:#00FF41;">Буква</b> слева от кода — это ответ<br>
        4. Впишите букву в поле под кодом<br>
        <i>Коды разделены пробелами, слова — символом /</i>
      </div>
    ` : `
      <!-- КРИПТОГРАФ: таблица и шифротекст -->
      <details style="margin-bottom: 1.5rem;" open>
        <summary style="cursor: pointer; font-size: 0.9rem; color: #888; padding: 0.8rem 1.2rem; border: 1px solid #333; background: rgba(0,0,0,0.3);">
          📡 ТАБЛИЦА АЗБУКИ МОРЗЕ
        </summary>
        <div style="border: 1px solid #333; border-top: none; background: rgba(0,0,0,0.2); padding: 1.2rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 5px;">
            ${Object.entries(morseMap).map(([letter, code]) => `
              <div style="display: flex; align-items: center; gap: 8px; padding: 7px 10px; border: 1px solid #333; border-radius: 2px; font-size: 0.85rem; background: rgba(0,0,0,0.2);">
                <span style="color: #00FF41; font-weight: bold; font-size: 1rem; min-width: 22px; text-align: center;">${letter}</span>
                <span style="color: #ddd; letter-spacing: 3px; font-size: 0.9rem;">${code}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </details>
      
      <div class="cipher-text" style="font-size: 1.4rem; letter-spacing: 0.5rem; padding: 0.6rem;">
        ${ciphertext}
      </div>
    `}
  `;
  
  // Обработчики для полей ввода
  if (isDraftAvailable) {
    const inputs = document.querySelectorAll('.morse-char-input');
    
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        const value = this.value.toUpperCase();
        this.value = value;
        
        const expected = this.dataset.expected;
        
        if (isHintsAvailable && value) {
          if (value === expected.toUpperCase()) {
            this.style.backgroundColor = 'rgba(0, 255, 65, 0.3)';
            this.style.borderColor = '#00FF41';
            this.style.boxShadow = '0 0 6px rgba(0, 255, 65, 0.4)';
          } else {
            this.style.backgroundColor = 'rgba(255, 51, 51, 0.12)';
            this.style.borderColor = '#FF3333';
            this.style.boxShadow = 'none';
          }
        }
        
        updatePartialAnswer();
        
        if (value) {
          const parentDiv = this.closest('div');
          const nextDiv = parentDiv.nextElementSibling;
          if (nextDiv) {
            const nextInput = nextDiv.querySelector('input');
            if (nextInput) setTimeout(() => nextInput.focus(), 50);
          }
        }
      });
      
      input.addEventListener('keydown', function(e) {
        const parentDiv = this.closest('div');
        
        if (e.key === 'ArrowRight' || e.key === 'Tab') {
          e.preventDefault();
          const nd = parentDiv.nextElementSibling;
          if (nd) { const ni = nd.querySelector('input'); if (ni) ni.focus(); }
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const pd = parentDiv.previousElementSibling;
          if (pd) { const pi = pd.querySelector('input'); if (pi) pi.focus(); }
        }
        if (e.key === 'Backspace' && !this.value) {
          e.preventDefault();
          const pd = parentDiv.previousElementSibling;
          if (pd) {
            const pi = pd.querySelector('input');
            if (pi) {
              pi.value = '';
              pi.focus();
              pi.style.backgroundColor = 'transparent';
              pi.style.borderColor = '#333';
              pi.style.boxShadow = 'none';
              updatePartialAnswer();
            }
          }
        }
      });
      
      input.addEventListener('focus', function() {
        this.style.borderColor = '#00FF41';
        this.style.boxShadow = '0 0 6px rgba(0, 255, 65, 0.3)';
        this.title = `Код: ${this.dataset.group}`;
      });
      
      input.addEventListener('blur', function() {
        if (!isHintsAvailable || !this.value) {
          this.style.borderColor = '#333';
          this.style.boxShadow = 'none';
        }
      });
    });
    
    document.getElementById('morseClear').addEventListener('click', () => {
      inputs.forEach(inp => {
        inp.value = '';
        inp.style.backgroundColor = 'transparent';
        inp.style.borderColor = '#333';
        inp.style.boxShadow = 'none';
      });
      document.getElementById('morsePartial').textContent = '';
      if (inputs[0]) inputs[0].focus();
    });
    
    function updatePartialAnswer() {
      let partial = '';
      document.querySelectorAll('.morse-char-input').forEach(inp => {
        partial += inp.value || '_';
      });
      document.getElementById('morsePartial').textContent = `Текущий ввод: ${partial}`;
    }
    
    if (inputs[0]) inputs[0].focus();
  }
}

function renderPlayfairDraft(container, ciphertext, state) {
  // Берём данные из state
  const isHintsAvailable = state?.isHintsAvailable || false;
  const isDraftAvailable = state?.isDraftAvailable !== false;
  const taskSettings = state?.task?.settings || {};
  const plaintext = state?.task?.plaintext || '';
  const taskKey = taskSettings.key || 'ШИФР';
  
  const fullAlphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ';
  
  const riddles = {
    'ШИФР': 'Я — метод сокрытия. Меня придумал Уитстон, а назвал Плейфер. Во мне буквы ходят парами. Что я?',
    'КЛЮЧ': 'Без меня замок не открыть, без меня шифр не взломать. Я — слово, а не железка. Что я?',
    'ТАЙНА': 'Меня шепчут на ухо. Я скрыта от всех, но известна двоим. Что я?',
    'СЕКРЕТ': 'Я хранюсь за семью печатями. Разгласишь — исчезну навсегда. Что я?',
    'КОД': 'Я заменяю буквы на символы. Хакеры меня взламывают. Программисты пишут. Что я?'
  };
  
  const riddle = riddles[taskKey] || `Подсказка: слово из ${taskKey.length} букв, начинается на «${taskKey[0]}», заканчивается на «${taskKey[taskKey.length-1]}»`;
  
function buildMatrix6x6(key) {
  // Очищаем ключ
  const clean = [];
  const keyUpper = key.toUpperCase().replace(/[^А-ЯЁ]/g, '');
  for (const ch of keyUpper) {
    if (!clean.includes(ch)) clean.push(ch);
  }
  
  // Полный набор: алфавит + знаки
  const fullAlphabet = 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ.,!';
  
  // Собираем без дубликатов
  const result = [...clean];
  for (const ch of fullAlphabet) {
    if (!result.includes(ch)) {
      result.push(ch);
    }
  }
  
  // Берём ровно 36
  const cells = result.slice(0, 36);
  
  // Проверка
  const unique = [...new Set(cells)];
  if (unique.length !== cells.length) {
    console.error('ДУБЛИКАТЫ В МАТРИЦЕ!', cells.length, 'ячеек,', unique.length, 'уникальных');
  }
  
  // Формируем 6×6
  const m = [];
  for (let i = 0; i < 6; i++) {
    m.push(cells.slice(i * 6, i * 6 + 6));
  }
  
  return m;
}
  
  const matrix = buildMatrix6x6(taskKey);
  const cipherClean = ciphertext.replace(/\s/g, '');
  const plainClean = plaintext.replace(/\s/g, '');
  
  const pairs = [];
  for (let i = 0; i < cipherClean.length; i += 2) {
    pairs.push(cipherClean.slice(i, i + 2));
  }
  
  container.innerHTML = `
    <div class="label">// SCRATCHPAD: Плейфер</div>
    
    ${isDraftAvailable ? `
      <div style="background: rgba(0,255,65,0.06); border: 1px solid rgba(0,255,65,0.2); padding: 1rem 1.2rem; margin-bottom: 1.2rem; display: flex; align-items: center; gap: 1.2rem; border-radius: 2px;">
        <span style="font-size: 0.75rem; color: #888; letter-spacing: 1px;">🔑 КЛЮЧ:</span>
        <span style="font-size: 1.4rem; color: #00FF41; font-weight: bold; letter-spacing: 5px; text-shadow: 0 0 10px rgba(0,255,65,0.5);">${taskKey}</span>
      </div>
      
      <div style="margin-bottom: 1.2rem;">
        <div style="font-size: 0.75rem; color: #888; margin-bottom: 0.4rem; letter-spacing: 1px;">📊 МАТРИЦА ПЛЕЙФЕРА (6×6):</div>
        <div style="display: inline-block; border: 2px solid #333; background: rgba(0,0,0,0.3);">
          <div style="display: flex; font-size: 0.55rem; color: #555; border-bottom: 1px solid #333;">
            <div style="width: 28px;"></div>
            <div style="width: 48px; text-align: center; padding: 3px 0;">1</div>
            <div style="width: 48px; text-align: center; padding: 3px 0;">2</div>
            <div style="width: 48px; text-align: center; padding: 3px 0;">3</div>
            <div style="width: 48px; text-align: center; padding: 3px 0;">4</div>
            <div style="width: 48px; text-align: center; padding: 3px 0;">5</div>
            <div style="width: 48px; text-align: center; padding: 3px 0;">6</div>
          </div>
          ${matrix.map((row, rowIdx) => `
            <div style="display: flex; ${rowIdx < 5 ? 'border-bottom: 1px solid #333;' : ''}">
              <div style="width: 28px; display: flex; align-items: center; justify-content: center; font-size: 0.55rem; color: #555;">${rowIdx + 1}</div>
              ${row.map((cell, colIdx) => `
                <div style="
                  width: 48px; height: 48px;
                  display: flex; align-items: center; justify-content: center;
                  font-size: 1.2rem; font-weight: bold;
                  color: ${'.!,'.includes(cell) ? '#FFD700' : '#00FF41'};
                  text-shadow: 0 0 5px rgba(0,255,65,0.3);
                  ${colIdx < 5 ? 'border-right: 1px solid #333;' : ''}
                ">${cell}</div>
              `).join('')}
            </div>
          `).join('')}
        </div>
        <div style="font-size: 0.55rem; color: #555; margin-top: 0.3rem;">
          🟡 Знаки: . , ! &nbsp;| 🟢 Буквы алфавита
        </div>
      </div>
      
      <div style="margin-bottom: 1rem; padding: 0.8rem; border: 1px solid #222; font-size: 0.7rem; color: #aaa; line-height: 1.8; background: rgba(0,0,0,0.2);">
        <b style="color:#00FF41;">📖 ПРАВИЛА РАСШИФРОВКИ (для каждой пары):</b><br>
        ▸ <b>Одна строка</b> → берём букву <b style="color:#FFD700;">СЛЕВА</b> от каждой (сдвиг -1)<br>
        ▸ <b>Один столбец</b> → берём букву <b style="color:#FFD700;">СВЕРХУ</b> от каждой (сдвиг -1)<br>
        ▸ <b>Прямоугольник</b> → буквы на <b style="color:#FFD700;">противоположных углах</b> (строки те же, столбцы меняются)
        <span style="color: #666;">⚠ Если в конце расшифровки осталась буква <b>Х</b> — она лишняя (добавлена при шифровании для чётности)</span>
      </div>
      
      <div class="cipher-text" style="font-size: 1.3rem; letter-spacing: 0.5rem; padding: 0.5rem; margin-bottom: 0.5rem;">
        ${ciphertext}
      </div>
      
      <div style="margin-bottom: 1rem; font-size: 0.75rem; color: #FFD700; letter-spacing: 3px; font-weight: bold;">
        ПАРЫ: ${pairs.join('  ')}
      </div>
      
      <label style="font-size: 0.75rem; color: #888; display: block; margin-bottom: 0.4rem;">ВВЕДИТЕ РАСШИФРОВКУ:</label>
      <div id="playfairInputRow" style="display: flex; gap: 3px; flex-wrap: wrap; align-items: flex-end; margin-bottom: 0.8rem;">
        ${cipherClean.split('').map((ch, idx) => {
          const expectedChar = plainClean[idx] || '';
          return `<div style="display: flex; flex-direction: column; align-items: center; gap: 3px; ${idx % 2 === 1 && idx < cipherClean.length - 1 ? 'margin-right: 10px;' : ''}">
            <span style="font-size: 0.55rem; color: #555;">${ch}</span>
            <input type="text" maxlength="1" class="playfair-char-input"
                   data-expected="${expectedChar}"
                   style="width: 38px; height: 44px; text-align: center; font-size: 1.2rem;
                          border: 1px solid #444; background: #0a0a0a; color: #00FF41;
                          font-family: monospace; outline: none; border-radius: 2px;" />
          </div>`;
        }).join('')}
      </div>
      
      <button id="playfairClear" style="font-family: monospace; background: transparent; color: #00FF41; border: 1px solid #00FF41; padding: 0.7rem 1.5rem; cursor: pointer; font-size: 0.9rem; letter-spacing: 2px;">[ ОЧИСТИТЬ ]</button>
      <div id="playfairPartial" style="margin-top: 0.6rem; font-size: 0.8rem; color: #888; min-height: 1.3rem; letter-spacing: 1px;"></div>
      
      <div style="margin-top: 1rem; padding: 0.6rem; border: 1px solid #222; font-size: 0.6rem; color: #666; line-height: 1.6;">
        💡 <b>Пример:</b> пара «КИ» в одной строке → берём левее → «ИК» (циклически)
      </div>
    ` : `
      <div style="background: rgba(255,51,51,0.06); border: 2px solid rgba(255,51,51,0.3); padding: 1.5rem; margin-bottom: 1.5rem; border-radius: 3px;">
        <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1rem;">
          <span style="font-size: 1.5rem;">⚠</span>
          <span style="font-size: 0.85rem; color: #FF3333; letter-spacing: 2px; font-weight: bold;">ЗАГАДКА КРИПТОГРАФА</span>
        </div>
        <p style="font-size: 1.05rem; color: #ddd; margin: 0.8rem 0; font-style: italic; line-height: 1.6; text-align: center;">
          «${riddle}»
        </p>
        <div style="text-align: center; margin-top: 1rem;">
          <span style="font-size: 0.7rem; color: #888;">ОТВЕТ — КЛЮЧ (${taskKey.length} БУКВ)</span>
        </div>
        ${taskKey.length > 3 ? `<div style="text-align: center; margin-top: 0.5rem; font-size: 0.65rem; color: #555;">
          Подсказка: первая буква <b style="color:#FF3333;">${taskKey[0]}</b>${taskKey.length > 4 ? `, последняя <b style="color:#FF3333;">${taskKey[taskKey.length-1]}</b>` : ''}
        </div>` : ''}
      </div>
      
      <div class="cipher-text" style="font-size: 1.8rem; letter-spacing: 0.8rem; padding: 1.2rem; text-align: center;">
        ${ciphertext}
      </div>
      
      <p style="text-align: center; font-size: 0.7rem; color: #555; margin-top: 1rem;">
        Разгадайте загадку → постройте матрицу 6×6 → расшифруйте пары
      </p>
    `}
  `;
  
  // Обработчики полей
  if (isDraftAvailable) {
    const inputs = document.querySelectorAll('.playfair-char-input');
    
    inputs.forEach(input => {
      input.addEventListener('input', function() {
        const value = this.value.toUpperCase().replace(/[^А-ЯЁ\.,!]/g, '');
        this.value = value;
        
        const expected = this.dataset.expected;
        
        if (isHintsAvailable && value) {
          if (value === expected.toUpperCase()) {
            this.style.backgroundColor = 'rgba(0, 255, 65, 0.3)';
            this.style.borderColor = '#00FF41';
            this.style.boxShadow = '0 0 6px rgba(0, 255, 65, 0.4)';
          } else {
            this.style.backgroundColor = 'rgba(255, 51, 51, 0.12)';
            this.style.borderColor = '#FF3333';
            this.style.boxShadow = 'none';
          }
        } else if (!value) {
          this.style.backgroundColor = 'transparent';
          this.style.borderColor = '#444';
          this.style.boxShadow = 'none';
        }
        
        updatePartialAnswer();
        
        if (value) {
          const parentDiv = this.closest('div');
          const nextDiv = parentDiv.nextElementSibling;
          if (nextDiv) {
            const nextInput = nextDiv.querySelector('input');
            if (nextInput) setTimeout(() => nextInput.focus(), 50);
          }
        }
      });
      
      input.addEventListener('keydown', function(e) {
        const parentDiv = this.closest('div');
        
        if (e.key === 'ArrowRight' || e.key === 'Tab') {
          e.preventDefault();
          const nd = parentDiv.nextElementSibling;
          if (nd) { const ni = nd.querySelector('input'); if (ni) ni.focus(); }
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          const pd = parentDiv.previousElementSibling;
          if (pd) { const pi = pd.querySelector('input'); if (pi) pi.focus(); }
        }
        if (e.key === 'Backspace' && !this.value) {
          e.preventDefault();
          const pd = parentDiv.previousElementSibling;
          if (pd) {
            const pi = pd.querySelector('input');
            if (pi) {
              pi.value = '';
              pi.focus();
              pi.style.backgroundColor = 'transparent';
              pi.style.borderColor = '#444';
              pi.style.boxShadow = 'none';
              updatePartialAnswer();
            }
          }
        }
      });
      
      input.addEventListener('focus', function() {
        this.style.borderColor = '#00FF41';
        this.style.boxShadow = '0 0 6px rgba(0, 255, 65, 0.3)';
      });
      
      input.addEventListener('blur', function() {
        if (!this.value) {
          this.style.borderColor = '#444';
          this.style.boxShadow = 'none';
        }
      });
    });
    
    document.getElementById('playfairClear').addEventListener('click', () => {
      inputs.forEach(inp => {
        inp.value = '';
        inp.style.backgroundColor = 'transparent';
        inp.style.borderColor = '#444';
        inp.style.boxShadow = 'none';
      });
      document.getElementById('playfairPartial').textContent = '';
      if (inputs[0]) inputs[0].focus();
    });
    
    function updatePartialAnswer() {
      let partial = '';
      document.querySelectorAll('.playfair-char-input').forEach(inp => {
        partial += inp.value || '_';
      });
      const partEl = document.getElementById('playfairPartial');
      if (partEl) partEl.textContent = `Текущий ввод: ${partial}`;
    }
    
    if (inputs[0]) inputs[0].focus();
  }
}