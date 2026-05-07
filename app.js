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
  // Бегущая строка (активация по Ctrl+])
var marqueeActive = false;
var marqueeEnabled = true; // можно отключить навсегда
var marqueePos = 0;
var marqueeSpeed = 1;
var marqueeDir = 1;
var marqueeColors = ['#00FF41', '#FFD700', '#00BFFF', '#FF3333', '#B347EA'];
var marqueeColorIdx = 0;
var marqueeAnimId = null;

var marqueeText = document.getElementById('marqueeText');
if (marqueeText) {
  marqueeText.innerHTML += ' &nbsp;&nbsp;&nbsp; ' + marqueeText.innerHTML;
}

function animateMarquee() {
  marqueePos += marqueeSpeed * marqueeDir;
  var textWidth = marqueeText.scrollWidth / 2;
  if (marqueePos > textWidth) marqueePos = 0;
  if (marqueePos < -textWidth) marqueePos = 0;
  marqueeText.style.transform = 'translateX(' + (-marqueePos) + 'px)';
  marqueeAnimId = requestAnimationFrame(animateMarquee);
}

function showMarquee() {
  if (!marqueeEnabled) return;
  var marquee = document.getElementById('marquee');
  var controls = document.getElementById('marqueeControls');
  if (marquee) marquee.style.display = 'block';
  if (controls) controls.style.display = 'flex';
  marqueeActive = true;
  if (!marqueeAnimId) animateMarquee();
  localStorage.setItem('decoder_marquee_hidden', 'false');
}

function hideMarquee() {
  var marquee = document.getElementById('marquee');
  var controls = document.getElementById('marqueeControls');
  if (marquee) marquee.style.display = 'none';
  if (controls) controls.style.display = 'none';
  marqueeActive = false;
  if (marqueeAnimId) {
    cancelAnimationFrame(marqueeAnimId);
    marqueeAnimId = null;
  }
  localStorage.setItem('decoder_marquee_hidden', 'true');
}

// Кнопка закрытия
var marqueeClose = document.getElementById('marqueeClose');
if (marqueeClose) {
  marqueeClose.addEventListener('click', hideMarquee);
}

// Горячие клавиши Ctrl+]
document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && (e.key === ']' || e.key === 'ъ')) {
    e.preventDefault();
    if (marqueeActive) {
      hideMarquee();
    } else {
      showMarquee();
    }
  }
});

// Управление бегущей строкой
var marqueeDirBtn = document.getElementById('marqueeDir');
var marqueeSpeedBtn = document.getElementById('marqueeSpeed');
var marqueeColorBtn = document.getElementById('marqueeColor');

if (marqueeDirBtn) {
  marqueeDirBtn.addEventListener('click', function() {
    marqueeDir *= -1;
    this.textContent = marqueeDir === 1 ? '[ → ]' : '[ ← ]';
  });
}

if (marqueeSpeedBtn) {
  marqueeSpeedBtn.addEventListener('click', function() {
    var speeds = [0.5, 1, 2, 3];
    var labels = ['[ ▶ ]', '[ ▶▶ ]', '[ ▶▶▶ ]', '[ ▶▶▶▶ ]'];
    var idx = speeds.indexOf(marqueeSpeed);
    marqueeSpeed = speeds[(idx + 1) % speeds.length];
    this.textContent = labels[(idx + 1) % speeds.length];
  });
}

if (marqueeColorBtn) {
  marqueeColorBtn.addEventListener('click', function() {
    marqueeColorIdx = (marqueeColorIdx + 1) % marqueeColors.length;
    marqueeText.style.color = marqueeColors[marqueeColorIdx];
  });
}

// Проверяем, не была ли скрыта строка ранее
if (localStorage.getItem('decoder_marquee_hidden') !== 'true') {
  showMarquee();
}
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
