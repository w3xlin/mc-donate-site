/* =========================================================================
   ОБЩИЙ СКРИПТ ВНУТРЕННИХ СТРАНИЦ
   Шапка, подвал, курсор и содержимое страниц (top/rules/partners/legal/thanks)
   ========================================================================= */
(function () {
  "use strict";

  var C = window.SITE_CONFIG;
  var TOP = window.TOP_PLAYERS || [];

  var ICON = {
    cart: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>',
    check: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    discord: '<svg viewBox="0 0 24 24"><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.3.5a14.6 14.6 0 0 1 4.3 2.2 13.9 13.9 0 0 0-12.8 0A14.6 14.6 0 0 1 10.9 3.5L10.6 3a19.8 19.8 0 0 0-4.9 1.4C2.4 9.2 1.7 14 2 18.7a19.9 19.9 0 0 0 6 3l.8-1.3c-1-.4-2-.9-2.8-1.6l.7-.5a14.2 14.2 0 0 0 12.6 0l.7.5c-.9.7-1.8 1.2-2.8 1.6l.8 1.3a19.9 19.9 0 0 0 6-3c.4-5.4-.5-10.2-3.2-14.3ZM8.7 15.6c-1.2 0-2.2-1.1-2.2-2.4S7.5 10.8 8.7 10.8s2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm6.6 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24"><path d="M21.9 4.3 18.6 20c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-4.9 9-8.1c.4-.3-.1-.5-.6-.2L6 13.4l-4.8-1.5c-1-.3-1-1 .2-1.5l18.8-7.2c.9-.3 1.6.2 1.3 1.1Z"/></svg>'
  };

  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (m) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]; }); }
  function rub(n) { return Math.round(n).toLocaleString("ru-RU") + " " + C.shop.currency; }
  function initials(n) { return (n || "?").slice(0, 2).toUpperCase(); }

  function toast(msg) {
    var box = el("toasts"); if (!box) return;
    var t = document.createElement("div"); t.className = "toast"; t.textContent = msg;
    box.appendChild(t);
    setTimeout(function () { t.style.opacity = "0"; t.style.transition = ".3s"; }, 1900);
    setTimeout(function () { t.remove(); }, 2300);
  }

  /* --- Шапка ------------------------------------------------------------ */
  function headerHTML() {
    var here = (location.pathname.split("/").pop() || "").toLowerCase();
    var nav = C.pages.map(function (p) {
      var active = (p.href.split("#")[0].toLowerCase() === here) ? " active-link" : "";
      return '<a class="' + active.replace(" ", "") + '" href="' + esc(p.href) + '">' + esc(p.label) + "</a>";
    }).join("") + '<a href="index.html#shop">В магазин</a>';
    var mob = C.pages.map(function (p) {
      return '<a href="' + esc(p.href) + '">' + esc(p.label) + "</a>";
    }).join("") + '<a href="index.html#shop">В магазин</a>' +
      '<a href="' + esc(C.supportUrl) + '" target="_blank" rel="noopener">Поддержка ↗</a>';

    return '' +
      '<header class="topbar">' +
        '<div class="container topbar-inner">' +
          '<a class="brand" href="index.html"><span class="logo">⛏</span><span data-brand></span></a>' +
          '<nav class="nav" id="nav">' + nav + "</nav>" +
          '<div class="topbar-right">' +
            '<a class="social only-desktop" href="' + esc(C.discordUrl) + '" target="_blank" rel="noopener" title="Discord">' + ICON.discord + "</a>" +
            '<a class="social only-desktop" href="' + esc(C.telegramUrl) + '" target="_blank" rel="noopener" title="Telegram">' + ICON.telegram + "</a>" +
            '<a class="cart-btn" href="index.html#shop">' + ICON.cart +
              '<span class="cart-count" data-cart-count>0</span><span class="cart-total" data-cart-total>0 ₽</span></a>' +
            '<button class="burger" id="burger" aria-label="Меню"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
          "</div>" +
        "</div>" +
      "</header>" +
      '<div class="mobile-menu" id="mobile-menu"><div class="mobile-menu-panel">' +
        '<button class="burger close" id="mobile-close" aria-label="Закрыть"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
        '<div id="mobile-nav" style="display:grid;gap:6px">' + mob + "</div>" +
      "</div></div>";
  }

  /* --- Подвал ----------------------------------------------------------- */
  function footerHTML() {
    var links = (C.footerLinks || []).map(function (l) {
      return '<a href="' + esc(l.href) + '">' + esc(l.label) + "</a>";
    }).join("");
    return '' +
      '<footer class="footer"><div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-col"><div class="brand" style="margin-bottom:12px"><span class="logo">⛏</span><span data-brand></span></div>' +
            '<p class="muted" style="font-size:14px;max-width:280px">Игровое сообщество и донат-магазин. Все покупки выдаются мгновенно и остаются после вайпов.</p></div>' +
          '<div class="footer-col"><h4>Навигация</h4>' + links + "</div>" +
          '<div class="footer-col"><h4>Контакты</h4>' +
            '<a href="' + esc(C.supportUrl) + '" target="_blank" rel="noopener">Тех. поддержка</a>' +
            '<a href="' + esc(C.telegramUrl) + '" target="_blank" rel="noopener">Telegram</a>' +
            '<a href="' + esc(C.discordUrl) + '" target="_blank" rel="noopener">Discord</a></div>' +
        "</div>" +
        '<div class="footer-bottom">' +
          "<div>© " + new Date().getFullYear() + " " + esc(C.serverShort) + ". " + esc(C.footer.copyright) + "<br>" + esc(C.footer.note) + "</div>" +
          '<div class="pay-icons"><span>МИР</span><span>Visa</span><span>Mastercard</span><span>СБП</span></div>' +
        "</div>" +
      "</div></footer>";
  }

  /* --- Содержимое страниц ---------------------------------------------- */
  function crumb(title) {
    return '<div class="breadcrumb"><a href="index.html">Главная</a> / ' + esc(title) + "</div>";
  }

  function leaderboardHTML(list) {
    if (!list.length) return '<div class="empty">Никого не найдено</div>';
    return '<div class="leaderboard">' + list.map(function (p, i) {
      return '<div class="lb-row"><div class="place">#' + (i + 1) + "</div>" +
        '<div class="ava">' + esc(initials(p.nick)) + "</div>" +
        '<div class="nick">' + esc(p.nick) + "</div>" +
        '<div class="sum">' + esc(rub(p.amount)) + "</div></div>";
    }).join("") + "</div>";
  }

  var PAGES = {
    top: function (root) {
      root.innerHTML = crumb("Богатейшие") +
        '<h1 class="page-title">Богатейшие игроки</h1>' +
        '<p class="page-sub">Топ по сумме покупок за всё время. Найдите себя или друга по нику.</p>' +
        '<div class="search-box"><input id="top-search" type="text" placeholder="Введите ник…" autocomplete="off">' +
        '<button class="btn" id="top-clear">Сбросить</button></div>' +
        '<div id="top-board"></div>';
      function draw(q) {
        q = (q || "").trim().toLowerCase();
        var list = TOP.filter(function (p) { return !q || p.nick.toLowerCase().indexOf(q) !== -1; });
        el("top-board").innerHTML = leaderboardHTML(list);
      }
      draw("");
      el("top-search").addEventListener("input", function () { draw(this.value); });
      el("top-clear").addEventListener("click", function () { el("top-search").value = ""; draw(""); });
    },

    rules: function (root) {
      var list = C.rulesFull || [];
      root.innerHTML = crumb("Правила") +
        '<h1 class="page-title">Правила сервера</h1>' +
        '<p class="page-sub">Честная игра держится на правилах. Читай перед покупкой.</p>' +
        '<div class="rules-full">' + list.map(function (r, i) {
          return '<div class="rule-item"><h4><span class="num">' + (i + 1) + "</span>" + esc(r.title) + "</h4><p>" + esc(r.text) + "</p></div>";
        }).join("") + "</div>" +
        '<div class="legal-block" style="margin-top:20px"><h3>Апелляция на бан</h3><p>' + esc(C.rules.appealNote) +
        ' Напишите в поддержку: <a data-support target="_blank" rel="noopener" style="color:#7ee2a1">' + esc(C.supportUrl) + "</a></p></div>";
    },

    partners: function (root) {
      var p = C.partners;
      root.innerHTML = crumb("Партнёрка") +
        '<h1 class="page-title">Партнёрская программа</h1>' +
        '<p class="page-sub">' + esc(p.subtitle) + "</p>" +
        '<div class="info-card"><h3>' + esc(p.title) + "</h3>" +
        '<p style="margin-top:12px">' + esc(p.text) + "</p>" +
        '<div class="domain-example">' + esc(p.example) + "</div>" +
        '<div class="perks">' + p.perks.map(function (x) {
          return '<div class="perk"><b>' + esc(x.value) + "</b><span>" + esc(x.label) + "</span></div>";
        }).join("") + "</div>" +
        '<a class="btn btn-primary" data-support target="_blank" rel="noopener">Занять свой домен</a></div>';
    },

    legal: function (root) {
      root.innerHTML = crumb("Документы") +
        '<h1 class="page-title">Документы</h1>' +
        '<p class="page-sub">Пользовательское соглашение и политика конфиденциальности.</p>' +
        '<div class="legal-block" id="agreement"><h3>Пользовательское соглашение</h3><p>' + esc(C.legal.agreement) + "</p></div>" +
        '<div class="legal-block" id="privacy"><h3>Политика конфиденциальности</h3><p>' + esc(C.legal.privacy) + "</p></div>";
    },

    thanks: function (root) {
      var o = null;
      try { o = JSON.parse(localStorage.getItem("last_order") || "null"); } catch (e) {}
      if (!o) {
        root.innerHTML = crumb("Заказ") +
          '<h1 class="page-title">Заказ не найден</h1>' +
          '<p class="page-sub">Похоже, вы ещё ничего не заказывали на этом устройстве.</p>' +
          '<a class="btn btn-primary" href="index.html#shop">Перейти в магазин</a>';
        return;
      }
      root.innerHTML = crumb("Заказ") +
        '<h1 class="page-title">Заказ ' + esc(o.id) + "</h1>" +
        '<p class="page-sub">Покупка выдана на ник <b>' + esc(o.nick) + "</b>. Чек отправлен на " + esc(o.email) + ".</p>" +
        '<div class="order-list">' + (o.items || []).map(function (i) {
          return '<div class="ci-row"><div class="picon">' + esc(i.icon) + "</div>" +
            '<div class="ci-info"><div class="nm">' + esc(i.name) + " × " + i.qty + "</div>" +
            '<div class="muted">' + esc(i.mode) + (i.dur ? " · " + esc(i.dur) : "") + "</div></div>" +
            '<div class="ci-price">' + esc(rub(i.total)) + "</div></div>";
        }).join("") + "</div>" +
        '<div class="totals"><div class="summary-row"><span>Бонус</span><span style="color:#7ee2a1">+' + esc(o.tokens) + " " + esc(o.tokenUnit) + "</span></div>" +
        (o.fee > 0 ? '<div class="summary-row"><span>Комиссия (' + esc(o.pay) + ")</span><span>+" + esc(rub(o.fee)) + "</span></div>" : "") +
        '<div class="summary-row total"><span>Оплачено</span><span>' + esc(rub(o.total)) + "</span></div></div>" +
        '<div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap">' +
          '<a class="btn btn-primary" href="index.html#shop">Вернуться в магазин</a>' +
          '<a class="btn" data-support target="_blank" rel="noopener">Нужна помощь</a>' +
        "</div>" +
        '<p class="muted" style="font-size:13px;margin-top:14px">Если покупка не появилась — перезайдите на сервер. Не помогло? Напишите в поддержку, номер заказа ' + esc(o.id) + ".</p>";
    }
  };

  /* --- Кнопка корзины в шапке ------------------------------------------ */
  function cartBadge() {
    var n = 0, sum = 0;
    try {
      var s = JSON.parse(localStorage.getItem("shop_state") || "{}");
      (s.cart || []).forEach(function (i) { n += i.qty; sum += (i.unit || 0) * i.qty; });
    } catch (e) {}
    $all("[data-cart-count]").forEach(function (e) { e.textContent = n; });
    $all("[data-cart-total]").forEach(function (e) { e.textContent = rub(sum); });
  }

  /* --- Курсор ----------------------------------------------------------- */
  function initCursor() {
    if (!C.ui || !C.ui.customCursor) return;
    var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    var ring = document.createElement("div"); ring.className = "cursor-ring";
    var dot = document.createElement("div"); dot.className = "cursor-dot";
    if (C.ui.cursorColor) { ring.style.borderColor = C.ui.cursorColor; dot.style.background = C.ui.cursorColor; }
    document.body.appendChild(ring); document.body.appendChild(dot);
    document.body.classList.add("custom-cursor");
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    var sel = "a, button, input, .lb-row, .rule-item, .legal-block";
    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
      ring.classList.toggle("text", !!(e.target && e.target.closest && e.target.closest("input")));
      ring.classList.remove("hide"); dot.classList.remove("hide");
    });
    document.addEventListener("mouseleave", function () { ring.classList.add("hide"); dot.classList.add("hide"); });
    document.addEventListener("mouseover", function (e) { if (e.target.closest && e.target.closest(sel)) ring.classList.add("hover"); });
    document.addEventListener("mouseout", function (e) { if (e.target.closest && e.target.closest(sel)) ring.classList.remove("hover"); });
    document.addEventListener("mousedown", function () { ring.classList.add("click"); });
    document.addEventListener("mouseup", function () { ring.classList.remove("click"); });
    (function loop() { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)"; requestAnimationFrame(loop); })();
  }

  function init() {
    if (el("site-header")) el("site-header").innerHTML = headerHTML();
    if (el("site-footer")) el("site-footer").innerHTML = footerHTML();

    // бренд и ссылки
    $all("[data-brand]").forEach(function (n) { n.textContent = C.serverName; });
    $all("[data-support]").forEach(function (n) { n.href = C.supportUrl; });

    var page = document.body.getAttribute("data-page");
    if (PAGES[page] && el("page-content")) PAGES[page](el("page-content"));
    if (page && page !== "thanks" && page !== "legal") document.title = $(".page-title") ? $(".page-title").textContent + " — " + C.serverName : C.serverName;

    // мобильное меню
    if (el("burger")) el("burger").addEventListener("click", function () { el("mobile-menu").classList.add("open"); });
    if (el("mobile-close")) el("mobile-close").addEventListener("click", function () { el("mobile-menu").classList.remove("open"); });
    if (el("mobile-menu")) el("mobile-menu").addEventListener("click", function (e) { if (e.target === el("mobile-menu")) el("mobile-menu").classList.remove("open"); });

    cartBadge();
    initCursor();

    // якорь на legal (#agreement / #privacy)
    if (location.hash) { var t = $(location.hash); if (t) t.scrollIntoView(); }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
