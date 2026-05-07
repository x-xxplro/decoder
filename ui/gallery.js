const defaultImages = [
  { url: 'https://udoba.org/sites/default/files/h5p/content/58147/images/file-6381323a7d974.jpeg', title: 'Шифр Цезаря', desc: 'Сдвиг на 3 позиции' },
  { url: 'https://naurok.com.ua/uploads/files/67061/33329/33501_images/5.jpg', title: 'Шифр Атбаш', desc: 'Зеркальная замена букв' },
  { url: 'https://studref.com/htm/img/15/6841/2.png', title: 'Квадрат Полибия', desc: 'Координатная сетка 5×5' },
  { url: 'https://findh.org/wp-content/uploads/2022/02/tablitsa-shifr-vizhenera.png', title: 'Таблица Виженера', desc: 'Полиалфавитный шифр' },
  { url: 'https://kids.azovlib.ru/images/%D0%98%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8F%20%D0%B2%D0%B5%D1%89%D0%B5%D0%B9/%D0%90%D0%B7%D0%B1%D1%83%D0%BA%D0%B0%20%D0%BC%D0%BE%D1%80%D0%B7%D0%B5.png', title: 'Азбука Морзе', desc: 'Точки и тире' },
  { url: 'https://nightquests.ru/wp-content/uploads/2017/04/shifr_playfair.png', title: 'Шифр Плейфера', desc: 'Биграммный шифр' }
];
export function renderGallery() {
  const app = document.getElementById('app');
  
  let images = JSON.parse(localStorage.getItem('decoder_gallery') || '[]');
  if (images.length === 0) {
    images = defaultImages;
    localStorage.setItem('decoder_gallery', JSON.stringify(images));
  }
  
  app.innerHTML = `
    <div class="gallery-container">
      <header class="library-header">
        <div class="header-line">
          <span class="prompt-symbol">></span>
        </div>
        <h1 class="main-title" style="font-size: 2.5rem;">
          <span class="glitch-text" data-text="ГАЛЕРЕЯ">ГАЛЕРЕЯ</span>
        </h1>
        <div class="subtitle-container">
          <span class="line-decoration"></span>
          <p class="subtitle">История шифрования в изображениях</p>
          <span class="line-decoration"></span>
        </div>
        <p style="text-align: center; opacity: 0.7; margin-bottom: 2rem;">
          Добавляйте изображения через URL или используйте готовую коллекцию
        </p>
      </header>
      
      <div style="text-align:center;margin-bottom:1.5rem;display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;">
        <input type="text" id="galleryUrl" placeholder="URL изображения..." style="width:280px;padding:0.5rem;">
        <input type="text" id="galleryTitle" placeholder="Название..." style="width:180px;padding:0.5rem;">
        <button id="galleryAdd">[ ДОБАВИТЬ ]</button>
        <button id="galleryReset">[ СБРОСИТЬ ]</button>
      </div>
      
      <div class="gallery-grid" id="galleryGrid">
        ${images.map((img, idx) => `
          <div class="gallery-item">
            <img src="${img.url}" alt="${img.title}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22150%22><rect fill=%22%23333%22 width=%22200%22 height=%22150%22/><text fill=%22%230F0%22 x=%22100%22 y=%2275%22 text-anchor=%22middle%22>Нет</text></svg>'">
            <div class="gallery-info">
              <b>${img.title}</b>
              <span>${img.desc || ''}</span>
            </div>
            <button class="gallery-delete" data-idx="${idx}">[ ✕ ]</button>
          </div>
        `).join('')}
      </div>
      
      <button class="nav-button" onclick="location.hash='#'" style="margin:1.5rem auto;display:flex;">[ НА ГЛАВНУЮ ]</button>
    </div>
  `;
  
  // Добавление
  document.getElementById('galleryAdd').addEventListener('click', () => {
    const url = document.getElementById('galleryUrl').value.trim();
    const title = document.getElementById('galleryTitle').value.trim();
    if (url && title) {
      images.push({ url, title, desc: 'Пользовательское' });
      localStorage.setItem('decoder_gallery', JSON.stringify(images));
      renderGallery();
    }
  });
  
  // Сброс
  document.getElementById('galleryReset').addEventListener('click', () => {
    localStorage.setItem('decoder_gallery', JSON.stringify(defaultImages));
    renderGallery();
  });
  
  // Удаление
  document.querySelectorAll('.gallery-delete').forEach(btn => {
    btn.addEventListener('click', function() {
      const idx = parseInt(this.dataset.idx);
      images.splice(idx, 1);
      localStorage.setItem('decoder_gallery', JSON.stringify(images));
      renderGallery();
    });
  });
}