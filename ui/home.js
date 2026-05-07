import { getAchievements } from '../core/storage.js';

const ciphers = [
  { 
    id: 'caesar', 
    name: 'ЦЕЗАРЬ', 
    desc: 'Сдвиг букв алфавита',
    icon: 'caesar'
  },
  { 
    id: 'atbash', 
    name: 'АТБАШ', 
    desc: 'Зеркальная замена',
    icon: 'atbash'
  },
  { 
    id: 'polybius', 
    name: 'ПОЛИБИЙ', 
    desc: 'Квадрат 5×5',
    icon: 'polybius'
  },
  { 
    id: 'vigenere', 
    name: 'ВИЖЕНЕР', 
    desc: 'Ключевое слово',
    icon: 'vigenere'
  },
  { 
    id: 'morse', 
    name: 'МОРЗЕ', 
    desc: 'Точки и тире',
    icon: 'morse'
  },
  { 
    id: 'playfair', 
    name: 'ПЛЕЙФЕР', 
    desc: 'Биграммы',
    icon: 'playfair'
  }
];

// SVG иконки для каждого шифра
const icons = {
  caesar: `<svg viewBox="0 0 64 64" width="64" height="64">
    <path fill="none" stroke="#00FF41" stroke-width="2" d="M20 50 L20 20 L30 15 L44 15 L44 25 L30 25 L30 20" stroke-linecap="round" stroke-linejoin="round"/>
    <path fill="none" stroke="#00FF41" stroke-width="2" d="M32 40 L32 50 M26 45 L38 45"/>
    <path fill="none" stroke="#00FF41" stroke-width="1.5" d="M12 50 Q12 30 20 25" opacity="0.5"/>
  </svg>`,
  
  atbash: `<svg viewBox="0 0 64 64" width="64" height="64">
    <circle cx="32" cy="28" r="3" fill="none" stroke="#00FF41" stroke-width="1.5"/>
    <path fill="none" stroke="#00FF41" stroke-width="2" d="M12 15 Q20 10 25 18 Q28 22 30 28 Q32 35 28 42 Q24 48 18 50"/>
    <path fill="none" stroke="#00FF41" stroke-width="2" d="M52 15 Q44 10 39 18 Q36 22 34 28 Q32 35 36 42 Q40 48 46 50"/>
    <line x1="28" y1="28" x2="36" y2="28" stroke="#00FF41" stroke-width="1" stroke-dasharray="2,2"/>
  </svg>`,
  
  polybius: `<svg viewBox="0 0 64 64" width="64" height="64">
    <rect x="10" y="10" width="44" height="44" fill="none" stroke="#00FF41" stroke-width="2"/>
    <line x1="10" y1="19" x2="54" y2="19" stroke="#00FF41" stroke-width="1" opacity="0.5"/>
    <line x1="10" y1="28" x2="54" y2="28" stroke="#00FF41" stroke-width="1" opacity="0.5"/>
    <line x1="10" y1="37" x2="54" y2="37" stroke="#00FF41" stroke-width="1" opacity="0.5"/>
    <line x1="10" y1="46" x2="54" y2="46" stroke="#00FF41" stroke-width="1" opacity="0.5"/>
    <line x1="19" y1="10" x2="19" y2="54" stroke="#00FF41" stroke-width="1" opacity="0.5"/>
    <line x1="28" y1="10" x2="28" y2="54" stroke="#00FF41" stroke-width="1" opacity="0.5"/>
    <line x1="37" y1="10" x2="37" y2="54" stroke="#00FF41" stroke-width="1" opacity="0.5"/>
    <line x1="46" y1="10" x2="46" y2="54" stroke="#00FF41" stroke-width="1" opacity="0.5"/>
  </svg>`,
  
  vigenere: `<svg viewBox="0 0 64 64" width="64" height="64">
    <circle cx="32" cy="32" r="12" fill="none" stroke="#00FF41" stroke-width="2"/>
    <path fill="none" stroke="#00FF41" stroke-width="2" d="M32 20 L32 16 L28 12"/>
    <path fill="none" stroke="#00FF41" stroke-width="2" d="M32 16 L36 12"/>
    <text x="28" y="36" fill="#00FF41" font-family="monospace" font-size="12" text-anchor="middle">A</text>
    <text x="24" y="30" fill="#00FF41" font-family="monospace" font-size="10" text-anchor="middle" opacity="0.7">B</text>
    <text x="40" y="30" fill="#00FF41" font-family="monospace" font-size="10" text-anchor="middle" opacity="0.7">C</text>
  </svg>`,
  
  morse: `<svg viewBox="0 0 64 64" width="64" height="64">
    <circle cx="16" cy="32" r="3" fill="#00FF41"/>
    <line x1="19" y1="32" x2="28" y2="32" stroke="#00FF41" stroke-width="2"/>
    <circle cx="31" cy="32" r="3" fill="none" stroke="#00FF41" stroke-width="1.5"/>
    <line x1="34" y1="32" x2="43" y2="32" stroke="#00FF41" stroke-width="2"/>
    <circle cx="46" cy="32" r="3" fill="#00FF41"/>
    <path fill="none" stroke="#00FF41" stroke-width="1.5" d="M10 24 Q16 18 22 20" opacity="0.5"/>
    <path fill="none" stroke="#00FF41" stroke-width="1.5" d="M42 44 Q48 46 54 42" opacity="0.5"/>
  </svg>`,
  
  playfair: `<svg viewBox="0 0 64 64" width="64" height="64">
    <rect x="10" y="10" width="44" height="44" fill="none" stroke="#00FF41" stroke-width="2"/>
    <rect x="15" y="15" width="14" height="14" fill="none" stroke="#00FF41" stroke-width="1" opacity="0.6"/>
    <rect x="35" y="15" width="14" height="14" fill="none" stroke="#00FF41" stroke-width="1" opacity="0.6"/>
    <rect x="15" y="35" width="14" height="14" fill="none" stroke="#00FF41" stroke-width="1" opacity="0.6"/>
    <rect x="35" y="35" width="14" height="14" fill="none" stroke="#00FF41" stroke-width="1" opacity="0.6"/>
    <text x="22" y="25" fill="#00FF41" font-family="monospace" font-size="10" text-anchor="middle">A</text>
    <text x="42" y="25" fill="#00FF41" font-family="monospace" font-size="10" text-anchor="middle">B</text>
    <text x="22" y="45" fill="#00FF41" font-family="monospace" font-size="10" text-anchor="middle">C</text>
    <text x="42" y="45" fill="#00FF41" font-family="monospace" font-size="10" text-anchor="middle">D</text>
  </svg>`
};

window.showCipherInfo = function(cipherId) {
  const info = {
    caesar: { name: 'Цезарь', year: 'I век до н.э.', author: 'Гай Юлий Цезарь', fact: 'Сдвиг на 3 буквы вправо. Самый известный шифр древности.' },
    atbash: { name: 'Атбаш', year: 'VI век до н.э.', author: 'Древний Израиль', fact: 'Зеркальная замена: А↔Я. Упоминается в Книге Иеремии.' },
    polybius: { name: 'Полибий', year: 'II век до н.э.', author: 'Полибий', fact: 'Квадрат 5×5. Передача сигналов факелами на расстоянии.' },
    vigenere: { name: 'Виженер', year: '1553 год', author: 'Блез де Виженер', fact: 'Полиалфавитный шифр. 300 лет считался невзламываемым.' },
    morse: { name: 'Морзе', year: '1838 год', author: 'Сэмюэл Морзе', fact: 'Точки и тире. Сигнал SOS: ... --- ... Принят в 1906 году.' },
    playfair: { name: 'Плейфер', year: '1854 год', author: 'Чарльз Уитстон', fact: 'Биграммный шифр. Матрица 6×6. Использовался в Первой мировой.' }
  };
  
  const data = info[cipherId];
  const existing = document.getElementById('cipherInfoPanel');
  if (existing) existing.remove();
  
  const panel = document.createElement('div');
  panel.id = 'cipherInfoPanel';
  panel.style.cssText = 'position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #111; border: 2px solid #00FF41; padding: 1rem 1.5rem; z-index: 999; max-width: 400px; text-align: center; box-shadow: 0 0 20px rgba(0,255,65,0.3); animation: fadeIn 0.3s;';
  panel.innerHTML = `
    <b style="color:#00FF41;">${data.name}</b><br>
    <span style="font-size:0.8rem;color:#888;">${data.author}, ${data.year}</span><br>
    <span style="font-size:0.75rem;color:#aaa;">${data.fact}</span>
    <br><button onclick="this.parentElement.remove()" style="margin-top:0.5rem;font-size:0.7rem;">[ ЗАКРЫТЬ ]</button>
  `;
  document.body.appendChild(panel);
  setTimeout(() => panel.remove(), 5000);
};

export function renderHome() {
  const app = document.getElementById('app');
  
  const achievements = getAchievements();
  const achievementCount = achievements.length;
  
  app.innerHTML = `
    <div class="home-container">
      <!-- Заголовок -->
      <header class="home-header">
        <div class="header-line">
          <span class="prompt-symbol">></span>
        </div>
        <h1 class="main-title">
          <span class="glitch-text" data-text="DECODER">DECODER</span>
        </h1>
        <div class="subtitle-container">
          <span class="line-decoration"></span>
          <p class="subtitle">Классические шифры</p>
          <span class="line-decoration"></span>
        </div>
        <div class="status-info">
          <span class="status-dot"></span>
          <span class="status-text">СИСТЕМА АКТИВНА</span>
          <span class="status-separator">|</span>
          <span class="status-text">ДОСТИЖЕНИЙ: ${achievementCount}</span>
        </div>
      </header>

      <!-- Сетка карточек -->
      <main class="cipher-grid">
        ${ciphers.map((cipher, index) => `
          <div class="cipher-card" 
               onclick="showCipherInfo('${cipher.id}')"
               ondblclick="location.hash='#game?cipher=${cipher.id}'">
               style="animation-delay: ${index * 0.1}s">
            <div class="card-header">
              <span class="card-number">[${String(index + 1).padStart(2, '0')}]</span>
              <span class="card-arrow">→</span>
            </div>
            <div class="card-icon">
              ${icons[cipher.icon]}
            </div>
            <div class="card-content">
              <h3 class="card-title">${cipher.name}</h3>
              <p class="card-description">${cipher.desc}</p>
            </div>
            <div class="card-footer">
              <span class="card-action">[ ВЗЛОМАТЬ ]</span>
              <span class="card-bracket">}</span>
            </div>
          </div>
        `).join('')}
      </main>

      <!-- Футер с навигацией -->
      <footer class="home-footer">
        <div class="footer-line"></div>
        <nav class="footer-nav">
          <button class="nav-button" onclick="location.hash='#library'">
            <span class="nav-label">Библиотека шифров</span>
          </button>
          
          <button class="nav-button" onclick="location.hash='#achievements'">
            <span class="nav-label">Достижения</span>
            ${achievementCount > 0 ? `<span class="nav-badge">${achievementCount}</span>` : ''}
          </button>
          
          <button class="nav-button" onclick="showDeveloperInfo()">
            <span class="nav-label">Разработчик</span>
          </button>
        </nav>
        <div class="footer-copyright">
          <span class="copyright-symbol">©</span> 2026 DECODER v1.0
        </div>
      </footer>
    </div>
  `;

  // Добавляем функцию показа информации о разработчике
  window.showDeveloperInfo = function() {
    const modal = document.createElement('div');
    modal.className = 'dev-modal';
    modal.innerHTML = `
      <div class="dev-modal-content">
        <div class="dev-modal-header">
          <span class="prompt-symbol">></span> РАЗРАБОТЧИК
          <button class="dev-modal-close" onclick="this.closest('.dev-modal').remove()">[X]</button>
        </div>
        <div class="dev-modal-body">
          <div class="info-section">
            <div class="info-label">ПРОЕКТ</div>
            <div class="info-value">DECODER — браузерная игра в области основ защиты информации и истории шифрования</div>
          </div>
          
          <div class="info-divider"></div>
          
          <div class="info-section">
            <div class="info-label">РАЗРАБОТЧИК</div>
            <div class="info-value highlight">Казакова М.Р.</div>
          </div>
          
          <div class="info-divider"></div>
          
          <div class="info-section">
            <div class="info-label">СПЕЦИАЛЬНОСТЬ</div>
            <div class="info-value">5-04-0612-02 «Разработка и сопровождение программного обеспечения информационных систем», PC02-23</div>
          </div>
          
          <div class="info-divider"></div>
          
          <div class="info-section">
            <div class="info-label">РОЛЬ</div>
            <div class="info-value">Проектировщик интерфейсов, Frontend и Backend разработчик</div>
          </div>
          
          <div class="info-divider"></div>
          
          <div class="info-section">
            <div class="info-label">ДАТА</div>
            <div class="info-value">04.05.2026</div>
          </div>
          
          <div class="info-divider"></div>
          
          <div class="info-section">
            <div class="info-label">СТЕК ТЕХНОЛОГИЙ</div>
            <div class="info-value">
              <span class="tech-badge">HTML5</span>
              <span class="tech-badge">CSS3</span>
              <span class="tech-badge">JavaScript (SPA)</span>
            </div>
          </div>
          
          <div class="info-divider"></div>
          
          <p class="dev-quote">"Шифрование — это не сокрытие данных, а искусство их преобразования"</p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  };
}