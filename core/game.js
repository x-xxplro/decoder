import { validate } from './validator.js';
import { addAchievement, getAchievements } from './storage.js';

/**
 * Создаёт состояние игры на основе задания.
 */
export function initGame(task) {
  const attemptsMap = { 1: Infinity, 1: 10, 2: 5, 3: 2 };
  const timeMap = { 1: 300, 2: 600, 3: 900 };

  return {
    task: task,
    level: task.level,
    maxAttempts: attemptsMap[task.level],
    remainingAttempts: attemptsMap[task.level],
    totalTime: timeMap[task.level],
    remainingTime: timeMap[task.level],
    timerInterval: null,
    isDraftAvailable: task.level !== 3,
    isHintsAvailable: task.level === 1,
    isGameOver: false,
    startTime: Date.now(),
    errorCount: 0, // счётчик ошибок
  };
}

/**
 * Обрабатывает отправку ответа. Возвращает объект результата.
 */
export function submitAnswer(state, userInput) {
  if (state.isGameOver) {
    return { status: 'already_over' };
  }

  const isCorrect = validate(userInput, state.task.plaintext, state.task.cipher);

  if (isCorrect) {
    state.isGameOver = true;
    stopTimer(state);
    
    // Проверка достижений
    checkAchievements(state);
    
    return { 
      status: 'win',
      timeSpent: state.totalTime - state.remainingTime,
      attemptsUsed: state.maxAttempts === Infinity ? '∞' : state.maxAttempts - state.remainingAttempts + 1,
      errorCount: state.errorCount
    };
  } else {
    state.errorCount++;
    if (state.remainingAttempts !== Infinity) {
      state.remainingAttempts--;
    }
    
    if (state.remainingAttempts === 0) {
      state.isGameOver = true;
      stopTimer(state);
      return { status: 'lose' };
    }
    
    return { 
      status: 'retry', 
      remainingAttempts: state.remainingAttempts,
      message: `Неверно. Осталось попыток: ${state.remainingAttempts === Infinity ? '∞' : state.remainingAttempts}`
    };
  }
}

/**
 * Проверка и выдача достижений по итогам успешной игры.
 */
function checkAchievements(state) {
  const { task, level, totalTime, remainingTime, errorCount } = state;
  const timeSpent = totalTime - remainingTime;
  const achievements = getAchievements();
  const achievementsIds = achievements.map(a => a.id);
  
  // НОВИЧОК
  addAchievement('first_hack'); // Первый взлом
  
  if (task.cipher === 'caesar' && level === 1) {
    addAchievement('first_caesar');
  }
  if (task.cipher === 'atbash') {
    addAchievement('first_atbash');
  }
  if (task.cipher === 'polybius') {
    addAchievement('first_polybius');
  }
  if (task.cipher === 'vigenere') {
    addAchievement('first_vigenere');
  }
  if (task.cipher === 'morse') {
    addAchievement('first_morse');
  }
  if (task.cipher === 'playfair') {
    addAchievement('first_playfair');
  }
  
  // МАСТЕР (уровень Криптограф)
  if (level === 3) {
    addAchievement('no_draft'); // Без черновика
    
    if (task.cipher === 'caesar') addAchievement('master_caesar');
    if (task.cipher === 'atbash') addAchievement('master_atbash');
    if (task.cipher === 'polybius') addAchievement('master_polybius');
    if (task.cipher === 'vigenere') addAchievement('master_vigenere');
    if (task.cipher === 'morse') addAchievement('master_morse');
    if (task.cipher === 'playfair') addAchievement('master_playfair');
  }
  
  // ЭКСПЕРТ
  // Скорость звука (< 20% времени)
  if (timeSpent < totalTime * 0.2) {
    addAchievement('speed_of_sound');
  }
  
  // С первой попытки
  if (errorCount === 0 && level > 1) {
    addAchievement('first_try');
  }
  
  // Демон скорости (< 30 сек)
  if (timeSpent < 30) {
    addAchievement('speed_demon');
  }
  
  // Идеальный взлом (Криптограф + быстро + без ошибок)
  if (level === 3 && errorCount === 0 && timeSpent < totalTime * 0.3) {
    addAchievement('perfect_run');
  }
  
  // Полуночный хакер
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 4) {
    addAchievement('midnight_hacker');
  }
  
  // Проверка на "Все новичок"
  const noviceCiphers = ['first_caesar', 'first_atbash', 'first_polybius', 'first_vigenere', 'first_morse', 'first_playfair'];
  if (noviceCiphers.every(id => achievementsIds.includes(id) || id === `first_${task.cipher}`)) {
    addAchievement('all_novice');
  }
  
  // Проверка на "Все мастер"
  const masterCiphers = ['master_caesar', 'master_atbash', 'master_polybius', 'master_vigenere', 'master_morse', 'master_playfair'];
  if (masterCiphers.every(id => achievementsIds.includes(id) || (level === 3 && id === `master_${task.cipher}`))) {
    addAchievement('all_master');
  }
  
  // Счётчик взломов
  const hackCount = achievements.filter(a => 
    !['full_library', 'glitch'].includes(a.id)
  ).length + 1;
  
  if (hackCount >= 10) addAchievement('ten_hacks');
  if (hackCount >= 50) addAchievement('fifty_hacks');
  if (hackCount >= 100) addAchievement('hundred_hacks');
  
  // День без ошибок (проверка последних 3 игр)
  checkNoMistakesDay();
  
  // Коллекционер
  const collectorIds = [
    'first_caesar', 'first_atbash', 'first_polybius', 'first_vigenere', 'first_morse', 'first_playfair',
    'master_caesar', 'master_atbash', 'master_polybius', 'master_vigenere', 'master_morse', 'master_playfair'
  ];
  if (collectorIds.every(id => achievementsIds.includes(id) || 
      (level === 3 && id === `master_${task.cipher}`) || 
      (id === `first_${task.cipher}`))) {
    addAchievement('collector');
  }
}

function checkNoMistakesDay() {
  // Упрощённая проверка — можно хранить историю игр в localStorage
  const recentGames = JSON.parse(localStorage.getItem('decoder_recent_games') || '[]');
  recentGames.push({ date: new Date().toISOString(), errorCount: 0 });
  
  if (recentGames.length > 3) {
    recentGames.shift(); // оставляем только последние 3
  }
  
  localStorage.setItem('decoder_recent_games', JSON.stringify(recentGames));
  
  if (recentGames.length >= 3 && recentGames.every(g => g.errorCount === 0)) {
    addAchievement('no_mistakes_day');
  }
}

export function startTimer(state, onTick, onTimeOut) {
  state.remainingTime = state.totalTime;
  state.timerInterval = setInterval(() => {
    const now = Date.now();
    const elapsed = Math.floor((now - state.startTime) / 1000);
    state.remainingTime = Math.max(0, state.totalTime - elapsed);
    
    onTick(state.remainingTime);
    
    if (state.remainingTime <= 0) {
      stopTimer(state);
      state.isGameOver = true;
      onTimeOut();
    }
  }, 250);
}

export function stopTimer(state) {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}