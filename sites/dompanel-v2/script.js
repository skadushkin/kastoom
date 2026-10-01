(function () {
  function initCertGallery() {
    var track = document.querySelector("[data-dp-cert-track]");
    if (!track) {
      return;
    }
    document.querySelectorAll("[data-dp-cert-scroll]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var dir = Number(btn.getAttribute("data-dp-cert-scroll")) || 0;
        track.scrollBy({ left: dir * 280, behavior: "smooth" });
      });
    });
  }

  function initForms() {
    document.querySelectorAll(".dp-form").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var status = form.querySelector("[data-dp-form-status]");
        if (status) {
          status.hidden = false;
          status.textContent =
            "Заявка принята. Менеджер свяжется с вами для уточнения деталей и расчёта.";
        }
        form.reset();
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initCertGallery();
      initForms();
    });
  } else {
    initCertGallery();
    initForms();
  }
})();
