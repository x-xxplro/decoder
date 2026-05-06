import tasks from '../data/tasks.json' with { type: 'json' };
import { initGame, submitAnswer, startTimer, stopTimer } from '../core/game.js';
import { renderDraft } from './draft.js';
import { showModal } from './modal.js';

let gameState = null;

export function renderGame() {
  console.log('renderGame вызван');
  const app = document.getElementById('app');
  const params = new URLSearchParams(location.hash.split('?')[1]);
  const cipherName = params.get('cipher');
  const level = parseInt(params.get('level')) || 1;
  
  console.log('Выбран шифр:', cipherName, 'уровень:', level);
  
  // Фильтруем задания по шифру и уровню
  const matchingTasks = tasks.filter(t => t.cipher === cipherName && t.level === level);
  
  let task;
  if (matchingTasks.length > 0) {
    // Выбираем случайное задание
    const randomIndex = Math.floor(Math.random() * matchingTasks.length);
    task = matchingTasks[randomIndex];
    console.log(`Выбрано случайное задание ${task.id} из ${matchingTasks.length} доступных`);
  } else {
    // Если нет точного совпадения, ищем хоть какое-то этого шифра
    const fallbackTasks = tasks.filter(t => t.cipher === cipherName);
    if (fallbackTasks.length > 0) {
      task = fallbackTasks[Math.floor(Math.random() * fallbackTasks.length)];
      task = { ...task, level: level };
    } else {
      console.warn('Задание не найдено, создаю тестовое');
      // Настройки по умолчанию для каждого шифра
      const defaultSettings = {
        caesar: { shift: 3 },
        atbash: {},
        polybius: {},
        vigenere: { key: 'КЛЮЧ' },
        morse: {},
        playfair: { key: 'ШИФР' }
      };
      
      const defaultCiphertexts = {
        caesar: 'ТУЛЁХЗ',
        atbash: 'ЦРОЯКО',
        polybius: '26 22 41 14 23',
        vigenere: 'ЫЛБШЁ',
        morse: '.--. .-. .. .-- . -',
        playfair: 'ИЧРФ'
      };
      
      task = {
        id: 999,
        cipher: cipherName || 'caesar',
        level: level,
        plaintext: "ПРИВЕТ",
        ciphertext: defaultCiphertexts[cipherName] || 'ПРИВЕТ',
        settings: defaultSettings[cipherName] || {},
        history: "Тестовое задание на русском языке."
      };
    }
  }
  
  // Сброс таймера, если был
  if (gameState) stopTimer(gameState);
  
  gameState = initGame(task);
  console.log('gameState.task:', gameState.task);
  console.log('gameState.task.settings:', gameState.task.settings);
  
  // Названия уровней
  const levelNames = ['', 'НОВИЧОК', 'РЕКРУТ', 'КРИПТОГРАФ'];
  
  app.innerHTML = `
    <div id="gameContainer">
      <!-- Шапка -->
      <div class="panel" id="headerPanel">
        <h2 id="cipherTitle">${task.cipher.toUpperCase()} | ${levelNames[level]}</h2>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div class="attempts-indicator" id="attemptsDisplay">
            <span>ATTEMPTS:</span>
            <span id="attemptsIcons"></span>
            <span id="attemptsText"></span>
          </div>
          <div class="timer" id="timerDisplay">00:00</div>
        </div>
      </div>
      
      <!-- Шифротекст -->
      <div class="panel" id="cipherPanel">
        <div class="label">ШИФРОТЕКСТ</div>
        <div class="cipher-text" id="cipherText">${task.ciphertext}</div>
        <button id="copyCipherBtn" class="small">[ КОПИРОВАТЬ ]</button>
      </div>
      
      <!-- Черновик -->
      <div class="panel" id="draftPanel">
        <div id="draftContainer">Загрузка черновика...</div>
      </div>
      
      <!-- Финальный ответ -->
      <div class="panel" id="answerPanel">
        <div class="label">ОТВЕТ</div>
        <div style="display: flex; align-items: baseline;">
          <span class="prompt">$</span>
          <input type="text" id="finalAnswer" placeholder="Введите расшифрованный текст..." style="flex: 1; margin-left: 5px;">
        </div>
        <button id="submitAnswerBtn" class="primary">ВЗЛОМАТЬ</button>
        <div id="feedbackArea"></div>
      </div>
    </div>
    <div style="display: flex; gap: 1rem; margin-top: 1rem;">
      <button onclick="location.hash='#'"> [ НА ГЛАВНУЮ ]</button>
    </div>
  `;

  console.log('task перед renderDraft:', task);
  console.log('task.plaintext:', task.plaintext);
  console.log('task.ciphertext:', task.ciphertext);
  console.log('gameState:', gameState);
  // Инициализация черновика
  renderDraft(document.getElementById('draftContainer'), task, gameState);
  
  // Обновление UI попыток
  updateAttemptsUI();
  
  // Запуск таймера
  startTimer(gameState, 
    (timeLeft) => {
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      const timerEl = document.getElementById('timerDisplay');
      if (timerEl) {
        timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        timerEl.className = 'timer';
        if (timeLeft < 10) timerEl.classList.add('critical');
        else if (timeLeft < 30) timerEl.classList.add('warning');
      }
    },
    () => {
      showModal('<h2>Время вышло</h2><p>Вы не успели расшифровать сообщение.</p>', [
        { text: 'Попробовать снова', callback: () => location.reload() },
        { text: 'На главную', callback: () => location.hash = '#' }
      ]);
    }
  );
  
  // Копирование шифротекста
  document.getElementById('copyCipherBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(task.ciphertext);
    const btn = document.getElementById('copyCipherBtn');
    btn.textContent = '[ СКОПИРОВАНО ]';
    setTimeout(() => { btn.textContent = '[ КОПИРОВАТЬ ]'; }, 2000);
  });
  
  // Отправка ответа
  document.getElementById('submitAnswerBtn').addEventListener('click', handleSubmit);
  document.getElementById('finalAnswer').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSubmit();
  });
}

function handleSubmit() {
  if (!gameState || gameState.isGameOver) return;
  
  const input = document.getElementById('finalAnswer').value;
  const feedbackArea = document.getElementById('feedbackArea');
  
  const result = submitAnswer(gameState, input);
  
  switch (result.status) {
    case 'win':
      showModal(`
        <h2>ВЗЛОМ УСПЕШЕН</h2>
        <p><strong>Фраза:</strong> ${gameState.task.plaintext}</p>
        <p><em>${gameState.task.history}</em></p>
        <p>Затраченное время: ${Math.floor((gameState.totalTime - gameState.remainingTime) / 60)}:${String((gameState.totalTime - gameState.remainingTime) % 60).padStart(2, '0')}</p>
        <p>Ошибок: ${result.errorCount || 0}</p>
      `, [
        { text: 'Пройти ещё раз', callback: () => location.reload() },
        { text: 'Выбрать уровень', callback: () => location.hash = `#game?cipher=${gameState.task.cipher}` },
        { text: 'На главную', callback: () => location.hash = '#' }
      ]);
      document.getElementById('submitAnswerBtn').disabled = true;
      break;
      
    case 'lose':
      feedbackArea.innerHTML = '<div class="error-message">ПОПЫТКИ ИСЧЕРПАНЫ</div>';
      showModal('<h2>Попытки исчерпаны</h2><p>Правильный ответ: <strong>' + gameState.task.plaintext + '</strong></p>', [
        { text: 'Попробовать снова', callback: () => location.reload() },
        { text: 'Выбрать уровень', callback: () => location.hash = `#game?cipher=${gameState.task.cipher}` },
        { text: 'На главную', callback: () => location.hash = '#' }
      ]);
      document.getElementById('submitAnswerBtn').disabled = true;
      break;
      
    case 'retry':
      feedbackArea.innerHTML = `<div class="error-message">${result.message}</div>`;
      document.getElementById('finalAnswer').style.borderColor = '#FF3333';
      setTimeout(() => {
        if (document.getElementById('finalAnswer')) 
          document.getElementById('finalAnswer').style.borderColor = '';
      }, 1000);
      updateAttemptsUI();
      break;
  }
}

function updateAttemptsUI() {
  const iconsEl = document.getElementById('attemptsIcons');
  const textEl = document.getElementById('attemptsText');
  if (!gameState || !iconsEl || !textEl) return;
  
  const { maxAttempts, remainingAttempts } = gameState;
  
  if (maxAttempts === Infinity || maxAttempts === undefined) {
    iconsEl.innerHTML = '<span class="attempt-token">∞</span>';
    textEl.textContent = '10';
  } else {
    let icons = '';
    for (let i = 0; i < maxAttempts; i++) {
      icons += i < remainingAttempts ? '<span class="attempt-token">▓</span>' : '<span class="attempt-token">░</span>';
    }
    iconsEl.innerHTML = icons;
    textEl.textContent = `${remainingAttempts}/${maxAttempts}`;
  }
}