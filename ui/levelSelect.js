const levelInfo = [
  {
    level: 1,
    name: 'НОВИЧОК',
    icon: '🟢',
    time: '5:00',
    attempts: '10',
    draft: 'Полный доступ',
    hints: 'Подсветка символов',
    description: 'Идеально для знакомства с шифром',
    color: '#00FF41'
  },
  {
    level: 2,
    name: 'РЕКРУТ',
    icon: '🟡',
    time: '10:00',
    attempts: '5',
    draft: 'Полный доступ',
    hints: 'Без подсветки',
    description: 'Для тех, кто уже знаком с основами',
    color: '#FFD700'
  },
  {
    level: 3,
    name: 'КРИПТОГРАФ',
    icon: '🔴',
    time: '15:00',
    attempts: '2',
    draft: 'Заблокирован',
    hints: 'Без подсказок',
    description: 'Расшифровка в уме или на бумаге',
    color: '#FF3333'
  }
];

export function renderLevelSelect() {
  const app = document.getElementById('app');
  const params = new URLSearchParams(location.hash.split('?')[1]);
  const cipher = params.get('cipher');
  
  const cipherNames = {
    caesar: 'ЦЕЗАРЬ',
    atbash: 'АТБАШ',
    polybius: 'ПОЛИБИЙ',
    vigenere: 'ВИЖЕНЕР',
    morse: 'МОРЗЕ',
    playfair: 'ПЛЕЙФЕР'
  };
  
  const cipherName = cipherNames[cipher] || cipher.toUpperCase();
  
  app.innerHTML = `
    <div class="level-select-container">
      <header class="level-select-header">
        <div class="header-line">
          <span class="prompt-symbol">></span>
          <span style="opacity: 0.7; margin-left: 0.5rem; font-size: 0.9rem;">ВЫБОР УРОВНЯ СЛОЖНОСТИ</span>
        </div>
        <h1 class="main-title" style="text-align: center; font-size: 2.2rem; margin: 0.8rem 0;">
          <span class="glitch-text" data-text="${cipherName}">${cipherName}</span>
        </h1>
        <p style="text-align: center; opacity: 0.6; margin-bottom: 1.5rem; font-size: 0.85rem;">
          Выберите уровень сложности для взлома шифра
        </p>
      </header>

      <div class="levels-grid">
        ${levelInfo.map(lvl => `
          <div class="level-card" 
               onclick="location.hash='#game?cipher=${cipher}&level=${lvl.level}'"
               style="--level-color: ${lvl.color};">
            
            <div class="level-card-header">
              <span class="level-icon">${lvl.icon}</span>
              <span class="level-number">УРОВЕНЬ ${lvl.level}</span>
            </div>
            
            <h2 class="level-name" style="color: ${lvl.color};">${lvl.name}</h2>
            
            <div class="level-stats">
              <div class="level-stat">
                <span class="level-stat-label">⏱  ВРЕМЯ</span>
                <span class="level-stat-value">${lvl.time}</span>
              </div>
              <div class="level-stat">
                <span class="level-stat-label">🔄  ПОПЫТКИ</span>
                <span class="level-stat-value">${lvl.attempts}</span>
              </div>
              <div class="level-stat">
                <span class="level-stat-label">📝  ЧЕРНОВИК</span>
                <span class="level-stat-value">${lvl.draft}</span>
              </div>
              <div class="level-stat">
                <span class="level-stat-label">💡  ПОДСКАЗКИ</span>
                <span class="level-stat-value">${lvl.hints}</span>
              </div>
            </div>
            
            <p class="level-description">${lvl.description}</p>
            
            <button class="level-play-btn" style="border-color: ${lvl.color}; color: ${lvl.color};">
              [ ВЫБРАТЬ ]
            </button>
          </div>
        `).join('')}
      </div>

      <button class="nav-button" onclick="location.hash='#'" style="margin: 1.5rem auto; display: flex;">
        [ НА ГЛАВНУЮ ]
      </button>
    </div>
  `;
}