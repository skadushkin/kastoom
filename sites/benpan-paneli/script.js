(function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const siteMenu = document.getElementById('site-menu');

  if (menuToggle && siteMenu) {
    menuToggle.addEventListener('click', function () {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      siteMenu.classList.toggle('is-open', !expanded);
    });

    siteMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.setAttribute('aria-expanded', 'false');
        siteMenu.classList.remove('is-open');
      });
    });
  }

  const stripTrack = document.querySelector('.strip-track');
  const pauseStrip = document.getElementById('pause-strip');

  if (stripTrack && pauseStrip) {
    pauseStrip.addEventListener('click', function () {
      const paused = stripTrack.classList.toggle('paused');
      pauseStrip.setAttribute('aria-pressed', String(paused));
      pauseStrip.textContent = paused ? '▶' : 'Ⅱ';
      pauseStrip.setAttribute('aria-label', paused ? 'Возобновить движение фотографий' : 'Приостановить движение фотографий');
    });
  }

  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (form && formStatus) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      formStatus.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
      form.reset();
    });
  }
})();
