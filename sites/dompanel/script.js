(function () {
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  if (form && formStatus) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      formStatus.textContent = "Спасибо! Мы свяжемся с вами в ближайшее время.";
      form.reset();
    });
  }
})();
