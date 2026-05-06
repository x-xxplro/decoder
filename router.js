import { renderHome } from './ui/home.js';
import { renderLevelSelect } from './ui/levelSelect.js';
import { renderGame } from './ui/gameView.js';
import { renderLibrary } from './ui/library.js';
import { renderAchievements } from './ui/achievements.js';

export function initRouter() {
  window.removeEventListener('hashchange', route);
  window.addEventListener('hashchange', route);
  route();
}

function route() {
  const hash = location.hash || '#';
  console.log('Router: текущий хэш =', hash);
  
  try {
    if (hash.startsWith('#game?')) {
      // Проверяем, есть ли уже уровень в параметрах
      const params = new URLSearchParams(hash.split('?')[1]);
      if (params.get('level')) {
        // Запускаем игру с выбранным уровнем
        console.log('Запуск игры с уровнем...');
        renderGame();
      } else {
        // Показываем выбор уровня
        console.log('Показываем выбор уровня...');
        renderLevelSelect();
      }
    } else if (hash.startsWith('#library')) {
      console.log('Загружаем библиотеку...');
      renderLibrary();
    } else if (hash.startsWith('#achievements')) {
      console.log('Загружаем достижения...');
      renderAchievements();
    } else {
      console.log('Загружаем главный экран...');
      renderHome();
    }
  } catch (error) {
    console.error('Ошибка в роутере:', error);
    document.getElementById('app').innerHTML = `
      <div style="color: red; padding: 20px;">
        <h2>> ОШИБКА ЗАГРУЗКИ</h2>
        <p>${error.message}</p>
        <button onclick="location.hash='#'">[ НА ГЛАВНУЮ ]</button>
      </div>
    `;
  }
}