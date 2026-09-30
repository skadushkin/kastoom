(function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const siteMenu = document.getElementById('site-menu');

  if (menuToggle && siteMenu) {
    menuToggle.addEventListener('click', function () {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      siteMenu.classList.toggle('is-open', !expanded);
      document.body.classList.toggle('menu-open', !expanded);
    });

    siteMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menuToggle.setAttribute('aria-expanded', 'false');
        siteMenu.classList.remove('is-open');
        document.body.classList.remove('menu-open');
      });
    });
  }

  document.querySelectorAll('.faq-item__question').forEach(function (button) {
    button.addEventListener('click', function () {
      const item = button.closest('.faq-item');
      const expanded = button.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-item').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('is-open');
          const q = other.querySelector('.faq-item__question');
          if (q) {
            q.setAttribute('aria-expanded', 'false');
          }
        }
      });
      item.classList.toggle('is-open', !expanded);
      button.setAttribute('aria-expanded', String(!expanded));
    });
  });

  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (form && formStatus) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      formStatus.textContent = 'Спасибо! Менеджер свяжется с вами и подготовит расчёт домокомплекта.';
      form.reset();
    });
  }

  document.querySelectorAll('[data-video-modal]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      const src = trigger.getAttribute('data-video-modal');
      const modal = document.getElementById('video-modal');
      const iframe = document.getElementById('video-modal-iframe');
      if (!modal || !iframe || !src) {
        return;
      }
      iframe.src = src;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
    });
  });

  const videoModal = document.getElementById('video-modal');
  if (videoModal) {
    videoModal.querySelectorAll('[data-close-modal]').forEach(function (el) {
      el.addEventListener('click', function () {
        const iframe = document.getElementById('video-modal-iframe');
        videoModal.classList.remove('is-open');
        videoModal.setAttribute('aria-hidden', 'true');
        if (iframe) {
          iframe.src = '';
        }
      });
    });
  }
})();
