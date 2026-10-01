/**
 * dompanel-v2: Tilda-блок попапа «Получите расчёт проекта и домокомплекта»
 * (rec1173237956) показывается после паузы без действий пользователя.
 * Остальная логика страницы — штатные скрипты Tilda.
 */
(function () {
  var POPUP_RECORD_ID = "rec1173237956";
  var IDLE_MS = 12000;
  var SESSION_KEY = "dompanel-cta-popup-shown";

  var record = null;
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
    overlay.setAttribute("aria-label", "Получите расчёт проекта и домокомплекта");

    holder = document.createElement("div");
    holder.className = "dp-cta-popup__dialog";

    overlay.appendChild(holder);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closePopup();
        return;
      }
      var link = event.target.closest ? event.target.closest('a[href*="closepopup"]') : null;
      if (link) {
        event.preventDefault();
        closePopup();
      }
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
    if (shown || !record) return;
    shown = true;
    rememberShown();
    if (!overlay) buildOverlay();

    holder.appendChild(record);
    record.classList.add("dp-cta-popup__record");
    // Нейтрализуем ссылки-закрывашки: picker.js игнорирует href="javascript:…",
    // поэтому крестик больше не будет вызывать перезагрузку превью.
    var closeLinks = record.querySelectorAll('a[href*="closepopup"], a[href*="closeallpopup"]');
    for (var ci = 0; ci < closeLinks.length; ci++) {
      closeLinks[ci].setAttribute("href", "javascript:void(0)");
    }
    document.body.classList.add("dp-cta-popup-open");
    overlay.classList.add("is-visible");
    loadLazyImages(record);
    window.dispatchEvent(new Event("resize"));
  }

  function closePopup() {
    if (!overlay) return;
    overlay.classList.remove("is-visible");
    document.body.classList.remove("dp-cta-popup-open");
    rememberShown();
  }

  function restartIdleTimer() {
    if (shown) return;
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(openPopup, IDLE_MS);
  }

  function init() {
    record = document.getElementById(POPUP_RECORD_ID);
    if (!record) return;

    record.classList.add("dp-cta-hidden");
    if (alreadyShown()) return;

    var events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart", "wheel"];
    for (var i = 0; i < events.length; i++) {
      window.addEventListener(events[i], restartIdleTimer, { passive: true });
    }
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closePopup();
    });
    document.addEventListener("click", function (event) {
      var link = event.target.closest
        ? event.target.closest('a[href*="closepopup"], a[href*="closeallpopup"]')
        : null;
      if (link) {
        event.preventDefault();
        closePopup();
      }
    });
    restartIdleTimer();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
