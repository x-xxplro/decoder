import { initRouter } from './router.js';

console.log('app.js загружен');

if (document.readyState === 'loading') {
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

  app.innerHTML = '';
  console.log('Запуск роутера...');
  initRouter();

  initMarquee();
  initTheme();
  initSlidePanel();
}

// ==================== БЕГУЩАЯ СТРОКА ====================
function initMarquee() {
  let marqueeActive = false;
  let marqueePos = 0;
  let marqueeSpeed = 1;
  let marqueeDir = 1;
  const marqueeColors = ['#00FF41', '#FFD700', '#00BFFF', '#FF3333', '#B347EA'];
  let marqueeColorIdx = 0;
  let marqueeAnimId = null;

  const marqueeText = document.getElementById('marqueeText');
  if (marqueeText) {
    marqueeText.innerHTML += ' &nbsp;&nbsp;&nbsp; ' + marqueeText.innerHTML;
  }

  function animateMarquee() {
    marqueePos += marqueeSpeed * marqueeDir;
    const textWidth = marqueeText.scrollWidth / 2;
    if (marqueePos > textWidth) marqueePos = 0;
    if (marqueePos < -textWidth) marqueePos = 0;
    marqueeText.style.transform = 'translateX(' + (-marqueePos) + 'px)';
    marqueeAnimId = requestAnimationFrame(animateMarquee);
  }

  function showMarquee() {
    const marquee = document.getElementById('marquee');
    const controls = document.getElementById('marqueeControls');
    if (marquee) marquee.style.display = 'block';
    if (controls) controls.style.display = 'flex';
    marqueeActive = true;
    if (!marqueeAnimId) animateMarquee();
    localStorage.setItem('decoder_marquee_hidden', 'false');
  }

  function hideMarquee() {
    const marquee = document.getElementById('marquee');
    const controls = document.getElementById('marqueeControls');
    if (marquee) marquee.style.display = 'none';
    if (controls) controls.style.display = 'none';
    marqueeActive = false;
    if (marqueeAnimId) {
      cancelAnimationFrame(marqueeAnimId);
      marqueeAnimId = null;
    }
    localStorage.setItem('decoder_marquee_hidden', 'true');
  }

  const marqueeClose = document.getElementById('marqueeClose');
  if (marqueeClose) {
    marqueeClose.addEventListener('click', hideMarquee);
  }

  document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === ']' || e.key === 'ъ')) {
      e.preventDefault();
      if (marqueeActive) hideMarquee();
      else showMarquee();
    }
  });

  const marqueeDirBtn = document.getElementById('marqueeDir');
  const marqueeSpeedBtn = document.getElementById('marqueeSpeed');
  const marqueeColorBtn = document.getElementById('marqueeColor');

  if (marqueeDirBtn) {
    marqueeDirBtn.addEventListener('click', function() {
      marqueeDir *= -1;
      this.textContent = marqueeDir === 1 ? '[ → ]' : '[ ← ]';
    });
  }

  if (marqueeSpeedBtn) {
    marqueeSpeedBtn.addEventListener('click', function() {
      const speeds = [0.5, 1, 2, 3];
      const labels = ['[ ▶ ]', '[ ▶▶ ]', '[ ▶▶▶ ]', '[ ▶▶▶▶ ]'];
      const idx = speeds.indexOf(marqueeSpeed);
      marqueeSpeed = speeds[(idx + 1) % speeds.length];
      this.textContent = labels[(idx + 1) % speeds.length];
    });
  }

  if (marqueeColorBtn) {
    marqueeColorBtn.addEventListener('click', function() {
      marqueeColorIdx = (marqueeColorIdx + 1) % marqueeColors.length;
      if (marqueeText) marqueeText.style.color = marqueeColors[marqueeColorIdx];
    });
  }

  if (localStorage.getItem('decoder_marquee_hidden') !== 'true') {
    showMarquee();
  }
}

// ==================== ПЕРЕКЛЮЧАТЕЛЬ ТЕМЫ ====================
function initTheme() {
  const themeBtn = document.getElementById('themeToggle');
  const themeBtnPanel = document.getElementById('themeTogglePanel');
  const openPanelBtn = document.getElementById('openPanel');

  function applyTheme(isLight) {
    if (isLight) {
      document.body.classList.add('light-theme');
      if (themeBtn) themeBtn.innerHTML = '[ ТЕМА ]';
      if (themeBtnPanel) themeBtnPanel.innerHTML = '[ СМЕНИТЬ ТЕМУ ]';
      // Кнопка ИНФО
      if (openPanelBtn) {
        openPanelBtn.style.background = '#f0f0e8';
        openPanelBtn.style.color = '#1a6b1a';
        openPanelBtn.style.borderColor = '#1a6b1a';
      }
    } else {
      document.body.classList.remove('light-theme');
      if (themeBtn) themeBtn.innerHTML = '[ ТЕМА ]';
      if (themeBtnPanel) themeBtnPanel.innerHTML = '[ СМЕНИТЬ ТЕМУ ]';
      // Кнопка ИНФО
      if (openPanelBtn) {
        openPanelBtn.style.background = '#0a0a0a';
        openPanelBtn.style.color = '#00FF41';
        openPanelBtn.style.borderColor = '#00FF41';
      }
    }
  }

  const savedTheme = localStorage.getItem('decoder_theme') === 'light';
  applyTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', function() {
      const isLight = !document.body.classList.contains('light-theme');
      localStorage.setItem('decoder_theme', isLight ? 'light' : 'dark');
      applyTheme(isLight);
    });
  }

  if (themeBtnPanel) {
    themeBtnPanel.addEventListener('click', function() {
      const isLight = !document.body.classList.contains('light-theme');
      localStorage.setItem('decoder_theme', isLight ? 'light' : 'dark');
      applyTheme(isLight);
    });
  }
}

// ==================== ВЫДВИЖНАЯ ПАНЕЛЬ ====================
function initSlidePanel() {
  const openPanelBtn = document.getElementById('openPanel');
  const closePanelBtn = document.getElementById('closePanel');
  const slidePanel = document.getElementById('slidePanel');
  const themeToggle = document.getElementById('themeToggle');

  if (openPanelBtn && slidePanel) {
    openPanelBtn.addEventListener('click', function() {
      slidePanel.style.right = '0';
      this.style.display = 'none';
      if (themeToggle) themeToggle.style.display = 'none';
    });
  }

  if (closePanelBtn && slidePanel) {
    closePanelBtn.addEventListener('click', function() {
      slidePanel.style.right = '-380px';
      if (openPanelBtn) openPanelBtn.style.display = 'block';
      if (themeToggle) themeToggle.style.display = 'block';
    });
  }
}