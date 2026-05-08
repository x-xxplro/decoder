// Данные галереи (сохраняются в localStorage)
let images = JSON.parse(localStorage.getItem('jq_gallery') || 'null') || [
  { url: 'https://udoba.org/sites/default/files/h5p/content/58147/images/file-6381323a7d974.jpeg', title: 'Шифр Цезаря', desc: 'Сдвиг на 3 позиции' },
  { url: 'https://naurok.com.ua/uploads/files/67061/33329/33501_images/5.jpg', title: 'Шифр Атбаш', desc: 'Зеркальная замена букв' },
  { url: 'https://studref.com/htm/img/15/6841/2.png', title: 'Квадрат Полибия', desc: 'Координатная сетка 5×5' },
  { url: 'https://findh.org/wp-content/uploads/2022/02/tablitsa-shifr-vizhenera.png', title: 'Таблица Виженера', desc: 'Полиалфавитный шифр' },
  { url: 'https://kids.azovlib.ru/images/%D0%98%D1%81%D1%82%D0%BE%D1%80%D0%B8%D1%8F%20%D0%B2%D0%B5%D1%89%D0%B5%D0%B9/%D0%90%D0%B7%D0%B1%D1%83%D0%BA%D0%B0%20%D0%BC%D0%BE%D1%80%D0%B7%D0%B5.png', title: 'Азбука Морзе', desc: 'Точки и тире' },
  { url: 'https://nightquests.ru/wp-content/uploads/2017/04/shifr_playfair.png', title: 'Шифр Плейфера', desc: 'Биграммный шифр' }
];

let currentIndex = 0;

// Инициализация
$(function() {
  renderThumbnails();
  showImage(0);

  // Клик по миниатюре
  $('#thumbnails').on('click', 'img', function() {
    currentIndex = $(this).data('index');
    showImage(currentIndex);
  });

  // Навигация
  $('#prevBtn').click(function() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  });

  $('#nextBtn').click(function() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  });

  // Открытие лайтбокса по клику на главное изображение
  $('#mainImage').click(function() {
    $('#lightboxImg').attr('src', images[currentIndex].url);
    $('#lightboxCaption').text(images[currentIndex].desc);
    $('#lightbox').fadeIn(300);
  });

  // Закрытие лайтбокса
  $('#closeLightbox, #lightbox').click(function(e) {
    if (e.target === this) $('#lightbox').fadeOut(300);
  });

  // Добавление изображения
  $('#addBtn').click(function() {
    const url = $('#addUrl').val().trim();
    const title = $('#addTitle').val().trim();
    if (url && title) {
      images.push({ url, title, desc: title });
      localStorage.setItem('jq_gallery', JSON.stringify(images));
      renderThumbnails();
      $('#addUrl').val('');
      $('#addTitle').val('');
    }
  });

  // Клавиши стрелок
  $(document).keydown(function(e) {
    if (e.key === 'ArrowLeft') $('#prevBtn').click();
    if (e.key === 'ArrowRight') $('#nextBtn').click();
    if (e.key === 'Escape') $('#lightbox').fadeOut(300);
  });
});

function showImage(index) {
  currentIndex = index;
  $('#mainImage').fadeOut(200, function() {
    $(this).attr('src', images[index].url).fadeIn(200);
  });
  $('#imageCaption').text(images[index].desc);
  // Подсветка активной миниатюры
  $('#thumbnails img').css('border-color', '#333');
  $('#thumbnails img[data-index="' + index + '"]').css('border-color', '#00FF41');
}

function renderThumbnails() {
  let html = '';
  images.forEach(function(img, i) {
    html += '<img src="' + img.url + '" data-index="' + i + '" alt="' + img.title + '" onerror="this.style.display=\'none\'">';
  });
  $('#thumbnails').html(html);
}