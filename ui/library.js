const cipherLibrary = {
  caesar: {
    name: 'ЦЕЗАРЬ',
    icon: 'caesar',
    history: `
      <p>Шифр Цезаря — один из самых древних и простых методов шифрования. Назван в честь римского императора Гая Юлия Цезаря, который использовал его для секретной переписки со своими генералами (100–44 гг. до н.э.).</p>
      <p>Светоний описывает, что Цезарь шифровал послания, заменяя каждую букву на ту, что находится в алфавите тремя позициями далее. Это делало текст нечитаемым для вражеских шпионов, перехватывающих гонцов.</p>
    `,
    principle: `
      <p><strong>Принцип работы:</strong> Каждая буква открытого текста заменяется буквой, смещённой на фиксированное число позиций в алфавите. Ключом является число сдвига (от 1 до 32 для русского алфавита из 33 букв).</p>
      <p><strong>Формула шифрования:</strong> E(x) = (x + k) mod 33</p>
      <p><strong>Формула расшифровки:</strong> D(x) = (x - k) mod 33</p>
      <p>Где x — позиция буквы в алфавите (А=0, Б=1, ..., Я=32), k — сдвиг.</p>
    `,
    example: `
      <div class="example-block">
        <div class="example-step">
          <span class="example-label">Открытый текст:</span>
          <span class="example-value">ПРИВЕТ</span>
        </div>
        <div class="example-step">
          <span class="example-label">Сдвиг (ключ):</span>
          <span class="example-value">3</span>
        </div>
        <div class="example-step">
          <span class="example-label">Процесс:</span>
          <span class="example-value" style="font-size:0.8rem;">П→Т, Р→У, И→Л, В→Ё, Е→З, Т→Х</span>
        </div>
        <div class="example-step">
          <span class="example-label">Шифротекст:</span>
          <span class="example-value highlight">ТУЛЁХЗ</span>
        </div>
      </div>
    `,
    weakness: `
      <p>Шифр крайне уязвим для частотного анализа и полного перебора (брутфорса). В русском алфавите всего 32 возможных ключа (сдвиг 0 не считается) — перебор занимает секунды даже вручную. Самые частые буквы русского языка: О, Е, А, И, Н, Т.</p>
    `
  },
  
  atbash: {
    name: 'АТБАШ',
    icon: 'atbash',
    history: `
      <p>Шифр Атбаш — древний еврейский метод шифрования, упоминаемый в Книге Иеремии (Ветхий Завет). Название происходит от принципа замены: первая буква алфавита (Алеф) заменяется на последнюю (Тав), вторая (Бет) — на предпоследнюю (Шин), отсюда АТ-БАШ.</p>
      <p>Изначально применялся для сокрытия религиозных текстов, а позже использовался каббалистами для мистических интерпретаций Торы.</p>
    `,
    principle: `
      <p><strong>Принцип работы:</strong> Алфавит «отражается зеркально» — первая буква заменяется на последнюю, вторая на предпоследнюю и так далее. Является частным случаем шифра замены.</p>
      <p><strong>Правило:</strong> А ↔ Я, Б ↔ Ю, В ↔ Э, Г ↔ Ь, Д ↔ Ы, Е ↔ Ъ, Ё ↔ Щ, Ж ↔ Ш, З ↔ Ч, И ↔ Ц, Й ↔ Х, К ↔ Ф, Л ↔ У, М ↔ Т, Н ↔ С, О ↔ Р, П ↔ П</p>
      <p>Интересен тем, что функция шифрования и расшифровки совпадают — применив Атбаш дважды, получим исходный текст.</p>
    `,
    example: `
      <div class="example-block">
        <div class="example-step">
          <span class="example-label">Открытый текст:</span>
          <span class="example-value">ПРИВЕТ</span>
        </div>
        <div class="example-step">
          <span class="example-label">Процесс:</span>
          <span class="example-value" style="font-size:0.8rem;">П→П, Р→О, И→Ц, В→Э, Е→Ъ, Т→М</span>
        </div>
        <div class="example-step">
          <span class="example-label">Шифротекст:</span>
          <span class="example-value highlight">ПОЦЪЭМ</span>
        </div>
      </div>
    `,
    weakness: `
      <p>Нет ключа — метод фиксирован. Если противник знает, что используется Атбаш, расшифровка мгновенна. Подходит только для сокрытия от случайного взгляда. Не обеспечивает криптографической стойкости.</p>
    `
  },
  
  polybius: {
    name: 'ПОЛИБИЙ',
    icon: 'polybius',
    history: `
      <p>Квадрат Полибия изобретён древнегреческим историком Полибием (II век до н.э.). Изначально использовался для передачи сообщений с помощью факелов в ночное время: количество факелов в двух группах указывало строку и столбец.</p>
      <p>Позже метод стал основой для многих шифров. В нашем варианте используется квадрат 5×5 для русского алфавита, где некоторые буквы объединены (Е/Ё, И/Й, Ь/Ъ/Ы, У/Ю, А/Я, Э→Е).</p>
    `,
    principle: `
      <p><strong>Принцип работы:</strong> Буквы размещаются в квадрате 5×5. Каждая буква кодируется парой чисел — номером строки и столбца (от 11 до 55).</p>
      <p>Буквы объединены для помещения в 25 ячеек: Е и Ё, И и Й, Ь/Ъ/Ы, У и Ю, А и Я, Э заменяется на Е.</p>
      <p>При расшифровке нужно определить исходную букву по контексту слова.</p>
    `,
    example: `
      <div class="example-block">
        <div class="example-step">
          <span class="example-label">Сетка 5×5:</span>
          <div class="mini-grid">
            <div class="mini-grid-row">А(11) Б(12) В(13) Г(14) Д(15)</div>
            <div class="mini-grid-row">Е(21) Ж(22) З(23) И(24) К(25)</div>
            <div class="mini-grid-row">Л(31) М(32) Н(33) О(34) П(35)</div>
            <div class="mini-grid-row">Р(41) С(42) Т(43) У(44) Ф(45)</div>
            <div class="mini-grid-row">Х(51) Ц(52) Ч(53) Ш(54) Щ(55)</div>
          </div>
        </div>
        <div class="example-step">
          <span class="example-label">Открытый текст:</span>
          <span class="example-value">ШИФР</span>
        </div>
        <div class="example-step">
          <span class="example-label">Координаты:</span>
          <span class="example-value">54 24 45 41</span>
        </div>
      </div>
    `,
    weakness: `
      <p>Фактически это простая замена — уязвим для частотного анализа. Количество информации удваивается (одна буква → две цифры). Объединение букв создаёт неоднозначность при расшифровке, но контекст обычно помогает.</p>
    `
  },
  
  vigenere: {
    name: 'ВИЖЕНЕР',
    icon: 'vigenere',
    history: `
      <p>Шифр Виженера впервые описан Джованом Баттистой Беллазо в 1553 году, но ошибочно приписывается Блезу де Виженеру (1586). Долгое время назывался «le chiffre indéchiffrable» — нерасшифровываемый шифр.</p>
      <p>Только в 1863 году Фридрих Касиски разработал метод его взлома. В нашем варианте используется русский алфавит из 33 букв.</p>
    `,
    principle: `
      <p><strong>Принцип работы:</strong> Полиалфавитный шифр — каждая буква сдвигается на разное количество позиций в зависимости от ключевого слова. Используется таблица Виженера (tabula recta) размером 33×33 для русского алфавита.</p>
      <p><strong>Расшифровка:</strong> Ключ → столбец таблицы → в этом столбце найти букву шифротекста → строка этой ячейки = буква открытого текста.</p>
      <p><strong>Формула:</strong> O[i] = (Ш[i] - К[i mod len] + 33) mod 33</p>
    `,
    example: `
      <div class="example-block">
        <div class="example-step">
          <span class="example-label">Открытый текст:</span>
          <span class="example-value">ПРИВЕТ</span>
        </div>
        <div class="example-step">
          <span class="example-label">Ключ:</span>
          <span class="example-value">КЛЮЧ</span>
        </div>
        <div class="example-step">
          <span class="example-label">Процесс:</span>
          <span class="example-value" style="font-size:0.8rem;">П+К=Ы, Р+Л=Ь, И+Ю=Х, В+Ч=Ю, Е+К=О, Т+Л=Э</span>
        </div>
        <div class="example-step">
          <span class="example-label">Шифротекст:</span>
          <span class="example-value highlight">ЫЬХЮОЭ</span>
        </div>
      </div>
    `,
    weakness: `
      <p>Уязвим для метода Касиски (поиск повторяющихся фрагментов шифротекста для определения длины ключа). Короткий ключ легко взламывается. При длине ключа равной длине текста становится абсолютно стойким (шифр Вернама).</p>
    `
  },
  
  morse: {
    name: 'МОРЗЕ',
    icon: 'morse',
    history: `
      <p>Азбука Морзе разработана Сэмюэлем Морзе и Альфредом Вейлем в 1838 году для телеграфной связи. Первое сообщение «What hath God wrought» отправлено 24 мая 1844 года.</p>
      <p>Стала международным стандартом связи. Сигнал SOS (... --- ...) принят в 1906 году. В России используется русская версия азбуки Морзе.</p>
    `,
    principle: `
      <p><strong>Принцип работы:</strong> Каждая буква русского алфавита кодируется уникальной последовательностью коротких (точка) и длинных (тире) сигналов. Длительность тире в 3 раза больше точки.</p>
      <p>Это не шифрование, а кодирование — таблица общеизвестна. Однако при отсутствии таблицы у перехватчика служит базовой защитой.</p>
    `,
    example: `
      <div class="example-block">
        <div class="example-step">
          <span class="example-label">Текст:</span>
          <span class="example-value">СОС</span>
        </div>
        <div class="example-step">
          <span class="example-label">Код Морзе:</span>
          <span class="example-value highlight">... --- ...</span>
        </div>
        <div class="example-step">
          <span class="example-label">Примеры букв:</span>
          <span class="example-value" style="font-size:0.8rem;">А = .- , Б = -... , В = .-- , Г = --. , Д = -..</span>
        </div>
      </div>
    `,
    weakness: `
      <p>Полностью открытый стандарт — таблица кодирования общеизвестна. Не обеспечивает секретности, только преобразует формат для передачи по телеграфу или радиосвязи.</p>
    `
  },
  
  playfair: {
    name: 'ПЛЕЙФЕР',
    icon: 'playfair',
    history: `
      <p>Шифр Плейфера изобретён Чарльзом Уитстоном в 1854 году, но назван в честь лорда Лайона Плейфера. Применялся британскими войсками во Второй англо-бурской войне и Первой мировой войне.</p>
      <p>В нашей версии используется матрица 6×6 для русского алфавита (33 буквы + знаки . , !). Буквы шифруются попарно (биграммами).</p>
    `,
    principle: `
      <p><strong>Принцип работы:</strong> Биграммный шифр — шифрует пары букв одновременно на основе матрицы 6×6, заполненной ключевым словом и алфавитом.</p>
      <p><strong>Правила расшифровки пары:</strong></p>
      <p>• <b>Одна строка</b> → берём букву <b>слева</b> от каждой (сдвиг -1)</p>
      <p>• <b>Один столбец</b> → берём букву <b>сверху</b> от каждой (сдвиг -1)</p>
      <p>• <b>Прямоугольник</b> → буквы на <b>противоположных углах</b></p>
      <p>⚠ Если в конце шифротекста нечётное количество букв, при шифровании добавляется <b>Х</b>.</p>
    `,
    example: `
      <div class="example-block">
        <div class="example-step">
          <span class="example-label">Ключ:</span>
          <span class="example-value">ШИФР</span>
        </div>
        <div class="example-step">
          <span class="example-label">Открытый текст:</span>
          <span class="example-value">ПРИВЕТ</span>
        </div>
        <div class="example-step">
          <span class="example-label">Пары:</span>
          <span class="example-value">ПР ИВ ЕТ</span>
        </div>
      </div>
    `,
    weakness: `
      <p>Уязвим для частотного анализа биграмм. Размер матрицы фиксирован (6×6). Буква Х в конце может выдать длину исходного текста. Современными методами взламывается быстро.</p>
    `
  }
};

export function renderLibrary() {
  const app = document.getElementById('app');
  
  app.innerHTML = `
    <div class="library-container">
      <header class="library-header">
        <div class="header-line">
          <span class="prompt-symbol">></span>
        </div>
        <h1 class="main-title" style="font-size: 2.5rem;">
          <span class="glitch-text" data-text="БИБЛИОТЕКА">БИБЛИОТЕКА</span>
        </h1>
        <div class="subtitle-container">
          <span class="line-decoration"></span>
          <p class="subtitle">Классические шифры</p>
          <span class="line-decoration"></span>
        </div>
        <p style="text-align: center; opacity: 0.7; margin-bottom: 2rem;">
          Изучите историю и принципы работы каждого шифра перед практическим взломом
        </p>
      </header>

      <div class="library-grid">
        ${Object.entries(cipherLibrary).map(([id, cipher]) => `
          <div class="library-card" onclick="showCipherDetail('${id}')">
            <div class="library-card-header">
              <span class="card-number">[${cipher.name}]</span>
              <span class="card-arrow">→</span>
            </div>
            <h3 class="library-card-title">${cipher.name}</h3>
            <div class="library-card-preview">
              ${cipher.history.replace(/<[^>]*>/g, '').substring(0, 150)}...
            </div>
            <div class="library-card-footer">
              <span class="card-action">[ ПОДРОБНЕЕ ]</span>
            </div>
          </div>
        `).join('')}
      </div>

      <button class="nav-button" onclick="location.hash='#'" style="margin: 2rem auto; display: flex;">
        ← [ НА ГЛАВНУЮ ]
      </button>
    </div>

    <div id="cipherDetail" style="display: none;"></div>
  `;

  window.showCipherDetail = function(cipherId) {
    const cipher = cipherLibrary[cipherId];
    if (!cipher) return;
    
    const detailContainer = document.getElementById('cipherDetail');
    detailContainer.innerHTML = `
      <div class="detail-overlay" onclick="hideCipherDetail()">
        <div class="detail-content" onclick="event.stopPropagation()">
          <div class="detail-header">
            <span class="prompt-symbol">></span>
            <h2>${cipher.name}</h2>
            <button class="detail-close" onclick="hideCipherDetail()">[X]</button>
          </div>
          
          <div class="detail-body">
            <section class="detail-section">
              <h3 class="detail-section-title">
                <span class="section-icon">📜</span>
                ИСТОРИЧЕСКАЯ СПРАВКА
              </h3>
              <div class="detail-text">${cipher.history}</div>
            </section>
            
            <section class="detail-section">
              <h3 class="detail-section-title">
                <span class="section-icon">⚙</span>
                ПРИНЦИП РАБОТЫ
              </h3>
              <div class="detail-text">${cipher.principle}</div>
            </section>
            
            <section class="detail-section">
              <h3 class="detail-section-title">
                <span class="section-icon">💡</span>
                ПРИМЕР ШИФРОВАНИЯ
              </h3>
              <div class="detail-text">${cipher.example}</div>
            </section>
            
            <section class="detail-section">
              <h3 class="detail-section-title">
                <span class="section-icon">⚠</span>
                УЯЗВИМОСТИ
              </h3>
              <div class="detail-text">${cipher.weakness}</div>
            </section>
          </div>
          
          <div class="detail-footer">
            <button class="nav-button" onclick="location.hash='#game?cipher=${cipherId}'; hideCipherDetail();">
              [ ПОПРОБОВАТЬ ВЗЛОМАТЬ ]
            </button>
            <button class="nav-button" onclick="hideCipherDetail()">
              [ НАЗАД К БИБЛИОТЕКЕ ]
            </button>
          </div>
        </div>
      </div>
    `;
    
    detailContainer.style.display = 'block';
    document.body.style.overflow = 'hidden';
  };

  window.hideCipherDetail = function() {
    const detailContainer = document.getElementById('cipherDetail');
    detailContainer.style.display = 'none';
    document.body.style.overflow = '';
  };
}