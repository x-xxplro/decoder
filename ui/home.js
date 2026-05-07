import { getAchievements } from '../core/storage.js';

const ciphers = [
  { id: 'caesar', name: 'ЦЕЗАРЬ', desc: 'Сдвиг букв алфавита', icon: 'caesar' },
  { id: 'atbash', name: 'АТБАШ', desc: 'Зеркальная замена', icon: 'atbash' },
  { id: 'polybius', name: 'ПОЛИБИЙ', desc: 'Квадрат 5×5', icon: 'polybius' },
  { id: 'vigenere', name: 'ВИЖЕНЕР', desc: 'Ключевое слово', icon: 'vigenere' },
  { id: 'morse', name: 'МОРЗЕ', desc: 'Точки и тире', icon: 'morse' },
  { id: 'playfair', name: 'ПЛЕЙФЕР', desc: 'Биграммы', icon: 'playfair' }
];

const icons = {
  caesar: `<svg viewBox="0 0 64 64" width="64" height="64"><path fill="none" stroke="#00FF41" stroke-width="2" d="M20 50 L20 20 L30 15 L44 15 L44 25 L30 25 L30 20" stroke-linecap="round" stroke-linejoin="round"/><path fill="none" stroke="#00FF41" stroke-width="2" d="M32 40 L32 50 M26 45 L38 45"/></svg>`,
  atbash: `<svg viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="28" r="3" fill="none" stroke="#00FF41" stroke-width="1.5"/><path fill="none" stroke="#00FF41" stroke-width="2" d="M12 15 Q20 10 25 18 Q28 22 30 28 Q32 35 28 42 Q24 48 18 50"/><path fill="none" stroke="#00FF41" stroke-width="2" d="M52 15 Q44 10 39 18 Q36 22 34 28 Q32 35 36 42 Q40 48 46 50"/></svg>`,
  polybius: `<svg viewBox="0 0 64 64" width="64" height="64"><rect x="10" y="10" width="44" height="44" fill="none" stroke="#00FF41" stroke-width="2"/><line x1="10" y1="19" x2="54" y2="19" stroke="#00FF41" stroke-width="1" opacity="0.5"/><line x1="10" y1="28" x2="54" y2="28" stroke="#00FF41" stroke-width="1" opacity="0.5"/><line x1="10" y1="37" x2="54" y2="37" stroke="#00FF41" stroke-width="1" opacity="0.5"/><line x1="10" y1="46" x2="54" y2="46" stroke="#00FF41" stroke-width="1" opacity="0.5"/></svg>`,
  vigenere: `<svg viewBox="0 0 64 64" width="64" height="64"><circle cx="32" cy="32" r="12" fill="none" stroke="#00FF41" stroke-width="2"/><path fill="none" stroke="#00FF41" stroke-width="2" d="M32 20 L32 16 L28 12"/></svg>`,
  morse: `<svg viewBox="0 0 64 64" width="64" height="64"><circle cx="16" cy="32" r="3" fill="#00FF41"/><line x1="19" y1="32" x2="28" y2="32" stroke="#00FF41" stroke-width="2"/><circle cx="46" cy="32" r="3" fill="#00FF41"/></svg>`,
  playfair: `<svg viewBox="0 0 64 64" width="64" height="64"><rect x="10" y="10" width="44" height="44" fill="none" stroke="#00FF41" stroke-width="2"/><rect x="15" y="15" width="14" height="14" fill="none" stroke="#00FF41" stroke-width="1"/><rect x="35" y="35" width="14" height="14" fill="none" stroke="#00FF41" stroke-width="1"/></svg>`
};

function showCipherInfo(cipherId) {
  var creators = {
    caesar: { 
      name: 'Гай Юлий Цезарь', 
      years: '100–44 гг. до н.э.', 
      fact: 'Римский император и полководец. Использовал шифр сдвига на 3 буквы для секретной военной переписки с генералами.',
      portrait: 'https://i.pinimg.com/736x/ab/70/05/ab70050f648da62694d614b9efa7e0d6.jpg'
    },
    atbash: { 
      name: 'Пророк Иеремия', 
      years: 'VII–VI вв. до н.э.', 
      fact: 'Библейский пророк Ветхого Завета. Шифр Атбаш упоминается в Книге Иеремии (глава 51, стих 1).',
      portrait: 'https://i.pinimg.com/1200x/48/e9/69/48e9694a3836a7a32e611a5b5d751588.jpg'
    },
    polybius: { 
      name: 'Полибий', 
      years: '200–120 гг. до н.э.', 
      fact: 'Древнегреческий историк и государственный деятель. Изобрёл квадрат 5×5 для передачи сообщений факелами на расстоянии.',
      portrait: 'https://stuki-druki.com/aforizms/Polybios02.jpg'
    },
    vigenere: { 
      name: 'Блез де Виженер', 
      years: '1523–1596', 
      fact: 'Французский дипломат и криптограф. Его полиалфавитный шифр считался невзламываемым почти 300 лет.',
      portrait: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRnpr6L5LDKV5ulm8aQhyXAyOzeSkWjtXoEw&s'
    },
    morse: { 
      name: 'Сэмюэл Морзе', 
      years: '1791–1872', 
      fact: 'Американский изобретатель и художник. Создал электромеханический телеграф и азбуку Морзе в 1838 году.',
      portrait: 'https://uploads4.wikiart.org/00301/images/samuel-morse/samuel-morse.jpg!Portrait.jpg'
    },
    playfair: { 
      name: 'Чарльз Уитстон', 
      years: '1802–1875', 
      fact: 'Британский физик и изобретатель. Создал биграммный шифр, названный в честь лорда Лайона Плейфера.',
      portrait: 'https://media.sciencephoto.com/c0/26/46/87/c0264687-800px-wm.jpg'
    }
  };
   
  var data = creators[cipherId];
  if (!data) return;
  
  var existing = document.getElementById('creatorPopup');
  if (existing) existing.remove();
  
  var overlay = document.createElement('div');
  overlay.id = 'creatorPopup';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:10000;';
  overlay.onclick = function(e) { if (e.target === overlay) overlay.remove(); };
  
  var isLight = document.body.classList.contains('light-theme');
  var bg = isLight ? '#fff' : '#111';
  var border = isLight ? '#1a6b1a' : '#00FF41';
  var title = isLight ? '#1a6b1a' : '#00FF41';
  
  var popup = document.createElement('div');
  popup.style.cssText = 'background:' + bg + ';border:2px solid ' + border + ';padding:1.5rem;max-width:380px;text-align:center;box-shadow:0 0 30px ' + (isLight ? 'rgba(0,0,0,0.2)' : 'rgba(0,255,65,0.2)') + ';border-radius:4px;';
  
  popup.innerHTML = 
    '<div style="font-size:0.7rem;color:#888;letter-spacing:2px;margin-bottom:1rem;">СОЗДАТЕЛЬ ШИФРА</div>' +
    '<img src="' + data.portrait + '" alt="' + data.name + '" style="width:120px;height:150px;object-fit:cover;border:2px solid ' + border + ';border-radius:4px;margin-bottom:1rem;" onerror="this.style.display=\'none\'">' +
    '<h3 style="color:' + title + ';font-size:1.1rem;letter-spacing:1px;margin-bottom:0.3rem;">' + data.name + '</h3>' +
    '<p style="color:#888;font-size:0.8rem;margin-bottom:0.5rem;">' + data.years + '</p>' +
    '<p style="color:#aaa;font-size:0.8rem;line-height:1.5;margin-bottom:1rem;">' + data.fact + '</p>' +
    '<button onclick="document.getElementById(\'creatorPopup\').remove()" style="border:1px solid ' + border + ';color:' + title + ';background:transparent;padding:0.5rem 1.5rem;cursor:pointer;font-family:monospace;font-size:0.8rem;">[ ЗАКРЫТЬ ]</button>';
  
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}

function showDeveloperInfo() {
  var modal = document.createElement('div');
  modal.className = 'dev-modal';
  modal.innerHTML = '<div class="dev-modal-content"><div class="dev-modal-header"><span class="prompt-symbol">></span> РАЗРАБОТЧИК<button class="dev-modal-close" onclick="this.closest(\'.dev-modal\').remove()">[X]</button></div><div class="dev-modal-body"><div class="info-section"><div class="info-label">ПРОЕКТ</div><div class="info-value">DECODER — браузерная игра в области основ защиты информации и истории шифрования</div></div><div class="info-divider"></div><div class="info-section"><div class="info-label">РАЗРАБОТЧИК</div><div class="info-value highlight">Казакова М.Р.</div></div><div class="info-divider"></div><div class="info-section"><div class="info-label">СПЕЦИАЛЬНОСТЬ</div><div class="info-value">5-04-0612-02 «Разработка и сопровождение ПО информационных систем», PC02-23</div></div><div class="info-divider"></div><div class="info-section"><div class="info-label">РОЛЬ</div><div class="info-value">Проектировщик интерфейсов, Frontend и Backend разработчик</div></div><div class="info-divider"></div><div class="info-section"><div class="info-label">ДАТА</div><div class="info-value">04.05.2026</div></div><div class="info-divider"></div><div class="info-section"><div class="info-label">СТЕК</div><div class="info-value"><span class="tech-badge">HTML5</span> <span class="tech-badge">CSS3</span> <span class="tech-badge">JavaScript (SPA)</span></div></div><div class="info-divider"></div><p class="dev-quote">"Шифрование — это не сокрытие данных, а искусство их преобразования"</p></div></div>';
  document.body.appendChild(modal);
  modal.addEventListener('click', function(e) { if (e.target === modal) modal.remove(); });
}

export function renderHome() {
  var app = document.getElementById('app');
  var achievements = getAchievements();
  var achievementCount = achievements.length;
  
  app.innerHTML = '<div class="home-container">' +
    '<header class="home-header">' +
    '<div class="header-line"><span class="prompt-symbol">></span></div>' +
    '<h1 class="main-title"><span class="glitch-text" data-text="DECODER">DECODER</span></h1>' +
    '<div class="subtitle-container"><span class="line-decoration"></span><p class="subtitle">Классические шифры</p><span class="line-decoration"></span></div>' +
    '<div class="status-info"><span class="status-dot"></span><span class="status-text">СИСТЕМА АКТИВНА</span><span class="status-separator">|</span><span class="status-text">ДОСТИЖЕНИЙ: ' + achievementCount + '</span></div>' +
    '</header>' +
    '<main class="cipher-grid">' +
    ciphers.map(function(cipher, index) {
      return '<div class="cipher-card" data-cipher="' + cipher.id + '" style="animation-delay: ' + (index * 0.1) + 's">' +
        '<div class="card-header"><span class="card-number">[' + String(index + 1).padStart(2, '0') + ']</span><span class="card-arrow">→</span></div>' +
        '<div class="card-icon">' + icons[cipher.icon] + '</div>' +
        '<div class="card-content"><h3 class="card-title">' + cipher.name + '</h3><p class="card-description">' + cipher.desc + '</p></div>' +
        '<div class="card-footer"><span class="card-action">[ ВЗЛОМАТЬ ]</span><span class="card-bracket">}</span></div>' +
        '</div>';
    }).join('') +
    '</main>' +
    '<footer class="home-footer">' +
    '<div class="footer-line"></div>' +
    '<nav class="footer-nav">' +
    '<button class="nav-button" onclick="location.hash=\'#library\'"><span class="nav-icon">📚</span><span class="nav-label">Библиотека шифров</span></button>' +
    '<button class="nav-button" onclick="location.hash=\'#achievements\'"><span class="nav-icon">🏆</span><span class="nav-label">Достижения</span>' + (achievementCount > 0 ? '<span class="nav-badge">' + achievementCount + '</span>' : '') + '</button>' +
    '<button class="nav-button" onclick="showDeveloperInfo()"><span class="nav-icon">⚙</span><span class="nav-label">Разработчик</span></button>' +
    '</nav>' +
    '<div class="footer-copyright"><span class="copyright-symbol">©</span> 2026 DECODER v1.0</div>' +
    '</footer>' +
    '</div>';
  
  var cards = document.querySelectorAll('.cipher-card');
  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener('click', function() {
      location.hash = '#game?cipher=' + this.getAttribute('data-cipher');
    });
    cards[i].addEventListener('contextmenu', function(e) {
      e.preventDefault();
      showCipherInfo(this.getAttribute('data-cipher'));
    });
  }
}