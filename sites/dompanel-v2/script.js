/**
 * dompanel-v2: нижний блок «Готовы обсудить серию?» показывается попапом
 * после паузы без действий пользователя. Остальная логика страницы — скрипты Tilda.
 */
(function () {
  var CTA_RECORD_ID = "rec1173237931";
  var IDLE_MS = 12000;
  var SESSION_KEY = "dompanel-cta-popup-shown";

  var cta = null;
  var overlay = null;
  var holder = null;
  var idleTimer = null;
  var shown = false;

  function alreadyShown() {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch (error) {
      return false;
    }
  }

  function rememberShown() {
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch (error) {
      /* приватный режим — просто не запоминаем */
    }
  }

  function buildOverlay() {
    overlay = document.createElement("div");
    overlay.className = "dp-cta-popup";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Получить расчёт проекта");

    var dialog = document.createElement("div");
    dialog.className = "dp-cta-popup__dialog";

    var close = document.createElement("button");
    close.type = "button";
    close.className = "dp-cta-popup__close";
    close.setAttribute("aria-label", "Закрыть");
    close.innerHTML = "&times;";

    holder = document.createElement("div");
    holder.className = "dp-cta-popup__body";

    dialog.appendChild(close);
    dialog.appendChild(holder);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    close.addEventListener("click", closePopup);
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) closePopup();
    });
  }

  /** Tilda подставляет картинки из data-original только для видимых блоков. */
  function loadLazyImages(root) {
    var nodes = root.querySelectorAll("[data-original]");
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      var src = node.getAttribute("data-original");
      if (!src) continue;
      if (node.tagName === "IMG") {
        if (node.getAttribute("src") !== src) node.setAttribute("src", src);
      } else if (!node.style.backgroundImage) {
        node.style.backgroundImage = 'url("' + src + '")';
      }
      node.classList.add("loaded", "t-bgimg");
    }
  }

  function openPopup() {
    if (shown || !cta) return;
    shown = true;
    rememberShown();
    if (!overlay) buildOverlay();

    holder.appendChild(cta);
    cta.classList.add("dp-cta-popup__record");
    document.body.classList.add("dp-cta-popup-open");
    overlay.classList.add("is-visible");
    loadLazyImages(cta);
    window.dispatchEvent(new Event("resize"));
  }

  function closePopup() {
    if (!overlay) return;
    overlay.classList.remove("is-visible");
    document.body.classList.remove("dp-cta-popup-open");
  }

  function restartIdleTimer() {
    if (shown) return;
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(openPopup, IDLE_MS);
  }

  function init() {
    cta = document.getElementById(CTA_RECORD_ID);
    if (!cta || alreadyShown()) return;

    cta.classList.add("dp-cta-hidden");

    var events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "wheel"];
    for (var i = 0; i < events.length; i++) {
      window.addEventListener(events[i], restartIdleTimer, { passive: true });
    }
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closePopup();
    });
    restartIdleTimer();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
