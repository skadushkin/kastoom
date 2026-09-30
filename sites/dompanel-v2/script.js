(function () {
  const menuToggle = document.querySelector(".menu-toggle");
  const siteMenu = document.getElementById("site-menu");

  if (menuToggle && siteMenu) {
    menuToggle.addEventListener("click", function () {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      siteMenu.classList.toggle("is-open", !expanded);
      document.body.classList.toggle("menu-open", !expanded);
    });

    siteMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menuToggle.setAttribute("aria-expanded", "false");
        siteMenu.classList.remove("is-open");
        document.body.classList.remove("menu-open");
      });
    });
  }

  const quizModal = document.getElementById("quiz-modal");
  const videoModal = document.getElementById("video-modal");
  const videoFrame = document.getElementById("video-frame");
  const videoTitle = document.getElementById("video-title");
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const formProject = document.getElementById("form-project");

  function openModal(modal) {
    if (!modal) {
      return;
    }
    modal.hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeModal(modal) {
    if (!modal) {
      return;
    }
    modal.hidden = true;
    if (
      (quizModal === null || quizModal.hidden) &&
      (videoModal === null || videoModal.hidden)
    ) {
      document.body.classList.remove("modal-open");
    }
    if (modal === videoModal && videoFrame) {
      videoFrame.innerHTML = "";
    }
  }

  document.querySelectorAll("[data-close-modal]").forEach(function (el) {
    el.addEventListener("click", function () {
      const modal = el.closest(".modal");
      closeModal(modal);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }
    closeModal(quizModal);
    closeModal(videoModal);
  });

  const quizQuestions = [
    {
      key: "interest",
      title: "Что нужно рассчитать?",
      options: ["Домокомплект", "Гараж", "Дом и гараж", "Индивидуальный проект ателье"],
    },
    {
      key: "area",
      title: "Какая площадь дома или гаража?",
      options: ["До 80 м²", "80–120 м²", "120–180 м²", "Более 180 м² / пока не знаю"],
    },
    {
      key: "floors",
      title: "Сколько этажей рассматриваете?",
      options: ["Один этаж", "Два этажа", "С мансардой", "Только гараж"],
    },
    {
      key: "pack",
      title: "Какая комплектация нужна?",
      options: ["Домокомплект панелей", "Тёплый контур", "Под ключ", "Пока сравниваю варианты"],
    },
    {
      key: "when",
      title: "Когда планируете старт?",
      options: ["Как можно скорее", "В ближайшие 1–3 месяца", "Через 3–6 месяцев", "Пока считаю бюджет"],
    },
  ];

  const quizState = {
    step: 0,
    answers: {},
    preset: "",
  };

  const quizQuestion = document.getElementById("quiz-question");
  const quizOptions = document.getElementById("quiz-options");
  const quizStepLabel = document.getElementById("quiz-step-label");
  const quizContacts = document.getElementById("quiz-contacts");
  const quizDone = document.getElementById("quiz-done");
  const quizTitle = document.getElementById("quiz-title");

  function renderQuiz() {
    if (!quizQuestion || !quizOptions || !quizStepLabel || !quizContacts || !quizDone || !quizTitle) {
      return;
    }

    quizDone.hidden = true;

    if (quizState.step >= quizQuestions.length) {
      quizQuestion.innerHTML = "<p>Оставьте контакты — пришлём расчёт по выбранным параметрам.</p>";
      quizOptions.innerHTML = "";
      quizContacts.hidden = false;
      quizStepLabel.textContent = "Последний шаг";
      quizTitle.textContent = "Куда отправить расчёт?";
      return;
    }

    const current = quizQuestions[quizState.step];
    quizContacts.hidden = true;
    quizStepLabel.textContent = "Вопрос " + String(quizState.step + 1) + " из " + String(quizQuestions.length);
    quizTitle.textContent = "Ответьте на 6 вопросов — подготовим стоимость";
    quizQuestion.innerHTML = "<h3>" + current.title + "</h3>";
    quizOptions.innerHTML = "";

    current.options.forEach(function (option) {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", function () {
        quizState.answers[current.key] = option;
        quizState.step += 1;
        renderQuiz();
      });
      quizOptions.appendChild(button);
    });
  }

  function openQuiz(preset) {
    quizState.step = 0;
    quizState.answers = {};
    quizState.preset = preset || "";
    if (preset && formProject) {
      formProject.value = preset;
    }
    renderQuiz();
    openModal(quizModal);
  }

  document.querySelectorAll("[data-open-quiz]").forEach(function (button) {
    button.addEventListener("click", function () {
      openQuiz(button.getAttribute("data-preset") || "");
    });
  });

  if (quizContacts) {
    quizContacts.addEventListener("submit", function (event) {
      event.preventDefault();
      const nameInput = quizContacts.querySelector('input[name="quiz-name"]');
      const phoneInput = quizContacts.querySelector('input[name="quiz-phone"]');
      const name = nameInput instanceof HTMLInputElement ? nameInput.value : "";
      const phone = phoneInput instanceof HTMLInputElement ? phoneInput.value : "";
      const summary = Object.keys(quizState.answers)
        .map(function (key) {
          return quizState.answers[key];
        })
        .concat(quizState.preset ? ["Проект: " + quizState.preset] : [])
        .join(", ");

      if (form) {
        const nameField = form.querySelector('input[name="name"]');
        const phoneField = form.querySelector('input[name="phone"]');
        const messageField = form.querySelector('textarea[name="message"]');
        if (nameField instanceof HTMLInputElement) {
          nameField.value = name;
        }
        if (phoneField instanceof HTMLInputElement) {
          phoneField.value = phone;
        }
        if (formProject) {
          formProject.value = quizState.preset || quizState.answers.interest || "";
        }
        if (messageField instanceof HTMLTextAreaElement) {
          messageField.value = summary;
        }
      }

      quizContacts.hidden = true;
      quizQuestion.innerHTML = "";
      if (quizDone) {
        quizDone.hidden = false;
      }
      quizContacts.reset();
    });
  }

  document.querySelectorAll("[data-video]").forEach(function (button) {
    button.addEventListener("click", function () {
      const id = button.getAttribute("data-video");
      const title = button.getAttribute("data-title") || "Видео";
      if (!id || !videoFrame) {
        return;
      }
      if (videoTitle) {
        videoTitle.textContent = title;
      }
      videoFrame.innerHTML =
        '<iframe src="https://www.youtube.com/embed/' +
        id +
        '?autoplay=1" title="' +
        title +
        '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
      openModal(videoModal);
    });
  });

  if (form && formStatus) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      formStatus.textContent = "Спасибо! Мы свяжемся с вами в ближайшее время.";
      form.reset();
    });
  }

  const fab = document.querySelector(".fab");
  if (fab) {
    function updateFab() {
      fab.classList.toggle("is-visible", window.scrollY > 420);
    }
    window.addEventListener("scroll", updateFab, { passive: true });
    updateFab();
  }
})();
