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
