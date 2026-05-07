import { initRouter } from './router.js';

console.log('app.js загружен');

// Проверяем, что DOM уже готов
if (document.readyState === 'loading') {
  console.log('DOM ещё загружается, ждём...');
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM загружен, запускаем приложение');
    startApp();
  });
} else {
  console.log('DOM уже готов, запускаем приложение');
  startApp();
}

function startApp() {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Элемент #app не найден!');
    return;
  }
  
  // Очищаем экран загрузки
  app.innerHTML = '';
  console.log('Запуск роутера...');
  initRouter();
  // Переключатель темы
const themeBtn = document.getElementById('themeToggle');
if (themeBtn) {
  // Проверяем сохранённую тему
  if (localStorage.getItem('decoder_theme') === 'light') {
    document.body.classList.add('light-theme');
    themeBtn.innerHTML = '[ ☀️ ТЕМА ]';
  }
  
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    if (document.body.classList.contains('light-theme')) {
      localStorage.setItem('decoder_theme', 'light');
      themeBtn.innerHTML = '[ ☀️ ТЕМА ]';
    } else {
      localStorage.setItem('decoder_theme', 'dark');
      themeBtn.innerHTML = '[ 🌙 ТЕМА ]';
    }
  });
}
}