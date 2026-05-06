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
}