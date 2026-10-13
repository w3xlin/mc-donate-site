/* =========================================================================
   ЛОГИКА САЙТА
   ========================================================================= */
(function () {
  "use strict";

  var C = window.SITE_CONFIG;
  var PRODUCTS = window.SHOP_PRODUCTS || [];
  var TOP = window.TOP_PLAYERS || [];
  var RECENT = window.RECENT_PURCHASES || [];

  var state = {
    mode: (C.modes[0] && C.modes[0].id) || "",
    category: "all",
    cart: []
  };

  /* --- Иконки ----------------------------------------------------------- */
  var ICON = {
    cart: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>',
    copy: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    check: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    discord: '<svg viewBox="0 0 24 24"><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.3.5a14.6 14.6 0 0 1 4.3 2.2 13.9 13.9 0 0 0-12.8 0A14.6 14.6 0 0 1 10.9 3.5L10.6 3a19.8 19.8 0 0 0-4.9 1.4C2.4 9.2 1.7 14 2 18.7a19.9 19.9 0 0 0 6 3l.8-1.3c-1-.4-2-.9-2.8-1.6l.7-.5a14.2 14.2 0 0 0 12.6 0l.7.5c-.9.7-1.8 1.2-2.8 1.6l.8 1.3a19.9 19.9 0 0 0 6-3c.4-5.4-.5-10.2-3.2-14.3ZM8.7 15.6c-1.2 0-2.2-1.1-2.2-2.4S7.5 10.8 8.7 10.8s2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm6.6 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24"><path d="M21.9 4.3 18.6 20c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-4.9 9-8.1c.4-.3-.1-.5-.6-.2L6 13.4l-4.8-1.5c-1-.3-1-1 .2-1.5l18.8-7.2c.9-.3 1.6.2 1.3 1.1Z"/></svg>'
  };

  /* --- Утилиты ---------------------------------------------------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(id) { return document.getElementById(id); }
  function rub(n) { return Math.round(n).toLocaleString("ru-RU") + " " + C.shop.currency; }
  function initials(nick) { return (nick || "?").slice(0, 2).toUpperCase(); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }
  function currentMode() {
    for (var i = 0; i < C.modes.length; i++) if (C.modes[i].id === state.mode) return C.modes[i];
    return C.modes[0];
  }
  function currentModeLabel() { return currentMode() ? currentMode().label : ""; }

  function toast(msg) {
    var box = el("toasts");
    var t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(function () { t.style.opacity = "0"; t.style.transition = ".3s"; }, 1900);
    setTimeout(function () { t.remove(); }, 2300);
  }

  function copyText(text, msg) {
    function done() { toast(msg || "Скопировано: " + text); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    } else { fallback(); }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { toast(text); }
      ta.remove();
    }
  }

  /* --- Отрисовка статики из конфига ------------------------------------- */
  function renderBrand() {
    $all("[data-brand]").forEach(function (n) { n.textContent = C.serverName; });
    $all("[data-brand-short]").forEach(function (n) { n.textContent = C.serverShort; });
    document.title = C.serverName + " — игровой сервер Minecraft";
    $all("[data-support]").forEach(function (n) { n.href = C.supportUrl; });
    $all("[data-discord]").forEach(function (n) { n.href = C.discordUrl; });
    $all("[data-telegram]").forEach(function (n) { n.href = C.telegramUrl; });
    $all("[data-donate]").forEach(function (n) { n.href = C.donateUrl; });
    $all("[data-footer-note]").forEach(function (n) { n.textContent = C.footer.note; });
    $all("#foot-copy").forEach(function (n) { n.textContent = C.footer.copyright; });

    // SVG-иконки соцсетей в <span data-icon="...">
    $all("[data-icon]").forEach(function (n) {
      var name = n.getAttribute("data-icon");
      if (ICON[name]) n.innerHTML = ICON[name];
    });
  }

  function renderNav() {
    var items = [
      { label: "Главная", href: "#top" },
      { label: "Топ игроков", href: "#top-players" },
      { label: "Правила", href: "#rules" },
      { label: "Партнёрам", href: "#partners" }
    ];
    var nav = el("nav"), mob = el("mobile-nav");
    nav.innerHTML = items.map(function (i) { return '<a href="' + i.href + '">' + esc(i.label) + "</a>"; }).join("");
    mob.innerHTML = items.map(function (i) { return '<a href="' + i.href + '">' + esc(i.label) + "</a>"; }).join("") +
      '<a href="' + esc(C.supportUrl) + '" target="_blank" rel="noopener">Поддержка ↗</a>';
  }

  function renderHero() {
    el("hero-badge").innerHTML = '<span class="dot"></span>' + esc(C.hero.badge);
    el("hero-title").textContent = C.hero.title;
    el("hero-subtitle").textContent = C.hero.subtitle;
    el("hero-primary").textContent = C.hero.primaryCta;
    el("hero-secondary").innerHTML = ICON.copy + esc(C.hero.secondaryCta);
    el("hero-avatar").textContent = initials(C.serverShort);

    var box = el("hero-stats");
    box.innerHTML = C.heroStats.map(function (s) {
      var val = s.decimals ? Number(s.value).toFixed(s.decimals) : Math.round(s.value);
      return '<div class="stat"><b><span data-count="' + esc(val) + '">0</span>' +
        esc(s.suffix || "") + "</b><span>" + esc(s.label) + "</span></div>";
    }).join("");

    el("hero-ip").textContent = C.serverIp;
  }

  function renderOnline() {
    el("online-title").textContent = C.online.title;
    el("online-subtitle").textContent = C.online.subtitle;
    el("online-ip").textContent = C.serverIp;

    var cur = el("online-current"), avg = el("online-avg"), max = el("online-max");
    cur.textContent = C.online.current.toLocaleString("ru-RU");
    avg.textContent = C.online.avg.toLocaleString("ru-RU");
    max.textContent = C.online.max.toLocaleString("ru-RU");

    // Демонстрационный график онлайна за сутки
    var bars = el("bars");
    var N = 28;
    var out = "";
    for (var i = 0; i < N; i++) {
      var pct = 20 + Math.round(60 * Math.abs(Math.sin(i / 3.3)) + (i / N) * 18);
      if (pct > 100) pct = 100;
      out += '<div class="bar" style="height:' + pct + '%" title="' + pct + '%"></div>';
    }
    bars.innerHTML = out;
  }

  function renderFeed() {
    var box = el("feed");
    box.innerHTML = RECENT.map(function (r) {
      return '<div class="feed-item"><div class="ava">' + esc(initials(r.nick)) + "</div>" +
        '<div><div class="nick">' + esc(r.nick) + '</div><div class="item">' + esc(r.item) + "</div></div>" +
        '<div class="amount">' + esc(rub(r.amount)) + "</div></div>";
    }).join("");
  }

  function renderSale() {
    var sale = C.sale;
    if (!sale.enabled) { el("sale").style.display = "none"; return; }
    el("sale-title").textContent = sale.title + " — скидки до " + sale.discountPct + "%";
    var ends = Date.now() + sale.durationHours * 3600 * 1000;
    function tick() {
      var left = Math.max(0, ends - Date.now());
      var h = Math.floor(left / 3600000);
      var m = Math.floor((left % 3600000) / 60000);
      var s = Math.floor((left % 60000) / 1000);
      el("t-h").textContent = String(h).padStart(2, "0");
      el("t-m").textContent = String(m).padStart(2, "0");
      el("t-s").textContent = String(s).padStart(2, "0");
    }
    tick();
    setInterval(tick, 1000);
  }

  /* --- Магазин ---------------------------------------------------------- */
  function productPrice(p) {
    // Цена со скидкой акции (если есть), иначе — цена товара
    if (p.oldPrice && p.oldPrice > p.price) return p.price;
    return p.price;
  }
  function discountPct(p) {
    if (p.oldPrice && p.oldPrice > p.price) return Math.round((1 - p.price / p.oldPrice) * 100);
    return 0;
  }

  function renderModeTabs() {
    var box = el("mode-tabs");
    box.innerHTML = C.modes.map(function (m) {
      return '<button class="mode-tab' + (m.id === state.mode ? " active" : "") + '" data-mode="' + esc(m.id) + '">' + esc(m.label) + "</button>";
    }).join("");
    $all(".mode-tab", box).forEach(function (b) {
      b.addEventListener("click", function () {
        state.mode = b.getAttribute("data-mode");
        state.category = "all";
        renderModeTabs(); renderCats(); renderProducts();
        toast("Режим: " + currentModeLabel());
      });
    });
  }

  function visibleCategories() {
    var m = currentMode();
    return m ? m.categories : [];
  }

  function renderCats() {
    var box = el("cats");
    var cats = [{ id: "all", label: "Все товары" }].concat(visibleCategories());
    box.innerHTML = cats.map(function (c) {
      return '<button class="cat' + (c.id === state.category ? " active" : "") + '" data-cat="' + esc(c.id) + '">' + esc(c.label) + "</button>";
    }).join("");
    $all(".cat", box).forEach(function (b) {
      b.addEventListener("click", function () {
        state.category = b.getAttribute("data-cat");
        renderCats(); renderProducts();
      });
    });
  }

  function renderProducts() {
    var grid = el("products");
    var list = PRODUCTS.filter(function (p) {
      return p.mode === state.mode && (state.category === "all" || p.category === state.category);
    });
    if (!list.length) {
      grid.innerHTML = '<div class="empty" style="grid-column:1/-1">' + esc(C.shop.emptyText) + "</div>";
      return;
    }
    grid.innerHTML = list.map(function (p) {
      var d = discountPct(p);
      var tagHtml = p.tag ? '<span class="tag' + (p.tag === "Новинка" ? " new" : "") + '">' + esc(p.tag) + "</span>" : "";
      var discHtml = d > 0 ? '<span class="disc">−' + d + "%</span>" : "";
      var oldHtml = p.oldPrice && p.oldPrice > p.price ? '<span class="old">' + esc(rub(p.oldPrice)) + "</span>" : "";
      return '<article class="card">' + tagHtml +
        '<div class="picon">' + esc(p.icon) + "</div>" +
        "<h4>" + esc(p.name) + "</h4>" +
        '<p class="desc">' + esc(p.desc) + "</p>" +
        '<div class="stock">Осталось ' + esc(p.stock) + " шт</div>" +
        '<div class="prices">' + discHtml + '<span class="price">' + esc(rub(productPrice(p))) + "</span>" + oldHtml + "</div>" +
        '<button class="btn btn-primary btn-block" data-add="' + esc(p.id) + '">' + ICON.cart + "В корзину</button>" +
        "</article>";
    }).join("");

    $all("[data-add]", grid).forEach(function (b) {
      b.addEventListener("click", function () { addToCart(b.getAttribute("data-add")); });
    });
  }

  function renderTopPlayers() {
    var box = el("leaderboard");
    var podium = TOP.slice(0, 3);
    var order = [podium[1], podium[0], podium[2]]; // 2 место, 1 место, 3 место
    el("podium").innerHTML = order.map(function (p) {
      if (!p) return "";
      var place = TOP.indexOf(p) + 1;
      return '<div class="p ' + (place === 1 ? "gold" : "") + '">' +
        '<div class="place">' + (place === 1 ? "🥇" : place === 2 ? "🥈" : "🥉") + "</div>" +
        '<div class="ava-big">' + esc(initials(p.nick)) + "</div>" +
        '<div class="nick">' + esc(p.nick) + "</div>" +
        '<div class="sum">' + esc(rub(p.amount)) + "</div></div>";
    }).join("");

    box.innerHTML = TOP.map(function (p, i) {
      return '<div class="lb-row"><div class="place">#' + (i + 1) + "</div>" +
        '<div class="ava">' + esc(initials(p.nick)) + "</div>" +
        '<div class="nick">' + esc(p.nick) + "</div>" +
        '<div class="sum">' + esc(rub(p.amount)) + "</div></div>";
    }).join("");
  }

  function renderRules() {
    el("rules-title").textContent = C.rules.title;
    el("rules-sub").textContent = C.rules.subtitle;
    el("rules-text").textContent = C.rules.text;
    el("rules-list").innerHTML = C.rules.items.map(function (t, i) {
      return '<div><span class="num">' + (i + 1) + "</span>" + esc(t) + "</div>";
    }).join("");
    el("rules-note").textContent = C.rules.appealNote;
  }

  function renderPartners() {
    el("partners-title").textContent = C.partners.title;
    el("partners-sub").textContent = C.partners.subtitle;
    el("partners-text").textContent = C.partners.text;
    el("partners-example").textContent = C.partners.example;
    el("partners-perks").innerHTML = C.partners.perks.map(function (p) {
      return '<div class="perk"><b>' + esc(p.value) + "</b><span>" + esc(p.label) + "</span></div>";
    }).join("");
  }

  function renderCTA() {
    el("cta-ip").textContent = C.serverIp;
  }

  function renderFooterLinks() {
    el("footer-links").innerHTML = C.footerLinks.map(function (l) {
      return '<a href="' + esc(l.href) + '">' + esc(l.label) + "</a>";
    }).join("");
  }

  /* --- Корзина ---------------------------------------------------------- */
  function findProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }
  function cartCount() { return state.cart.reduce(function (a, i) { return a + i.qty; }, 0); }
  function cartTotal() { return state.cart.reduce(function (a, i) { return a + i.price * i.qty; }, 0); }
  function cartOldTotal() { return state.cart.reduce(function (a, i) { return a + (i.oldPrice || i.price) * i.qty; }, 0); }

  function addToCart(id) {
    var p = findProduct(id);
    if (!p) return;
    var found = null;
    for (var i = 0; i < state.cart.length; i++) if (state.cart[i].id === id) found = state.cart[i];
    if (found) found.qty += 1;
    else state.cart.push({ id: p.id, name: p.name, icon: p.icon, mode: p.mode, price: productPrice(p), oldPrice: p.oldPrice || productPrice(p), qty: 1 });
    saveCart(); renderCart(); toast("Добавлено: " + p.name);
  }
  function changeQty(id, delta) {
    for (var i = 0; i < state.cart.length; i++) {
      if (state.cart[i].id === id) {
        state.cart[i].qty += delta;
        if (state.cart[i].qty <= 0) state.cart.splice(i, 1);
        break;
      }
    }
    saveCart(); renderCart();
  }
  function removeFromCart(id) {
    state.cart = state.cart.filter(function (i) { return i.id !== id; });
    saveCart(); renderCart();
  }

  function modeLabelById(id) {
    for (var i = 0; i < C.modes.length; i++) if (C.modes[i].id === id) return C.modes[i].label;
    return "";
  }

  function renderCart() {
    var n = cartCount();
    $all("[data-cart-count]").forEach(function (e) { e.textContent = n; });
    $all("[data-cart-total]").forEach(function (e) { e.textContent = rub(cartTotal()); });

    var body = el("cart-body");
    if (!state.cart.length) {
      body.innerHTML = '<div class="drawer-empty"><p>Корзина пуста</p><p class="muted">Привилегии, кейсы и валюта выдаются мгновенно после оплаты.</p></div>';
    } else {
      body.innerHTML = state.cart.map(function (i) {
        return '<div class="cart-item"><div class="picon">' + esc(i.icon) + "</div>" +
          '<div class="info"><div class="nm">' + esc(i.name) + "</div>" +
          '<div class="mode">Режим: ' + esc(modeLabelById(i.mode)) + "</div></div>" +
          '<div><div class="qty"><button data-dec="' + esc(i.id) + '">−</button><span>' + i.qty + "</span><button data-inc=\"" + esc(i.id) + '">+</button></div>' +
          '<div class="line"><span class="p">' + esc(rub(i.price * i.qty)) + "</span></div>" +
          '<button class="rm" data-rm="' + esc(i.id) + '">Удалить</button></div></div>';
      }).join("");
    }

    var oldT = cartOldTotal(), newT = cartTotal();
    el("sum-old").textContent = rub(oldT);
    el("sum-total").textContent = rub(newT);
    el("sum-save").textContent = "−" + rub(oldT - newT);
    el("cart-checkout").disabled = !state.cart.length;

    $all("[data-inc]", body).forEach(function (b) { b.addEventListener("click", function () { changeQty(b.getAttribute("data-inc"), 1); }); });
    $all("[data-dec]", body).forEach(function (b) { b.addEventListener("click", function () { changeQty(b.getAttribute("data-dec"), -1); }); });
    $all("[data-rm]", body).forEach(function (b) { b.addEventListener("click", function () { removeFromCart(b.getAttribute("data-rm")); }); });
  }

  function saveCart() {
    try { localStorage.setItem("shop_cart", JSON.stringify(state.cart)); } catch (e) {}
  }
  function loadCart() {
    try {
      var raw = localStorage.getItem("shop_cart");
      if (raw) state.cart = JSON.parse(raw) || [];
    } catch (e) { state.cart = []; }
  }

  /* --- Оформление заказа (демо) ----------------------------------------- */
  function openCheckout() {
    if (!state.cart.length) return;
    el("checkout-total").textContent = rub(cartTotal());
    el("checkout").classList.add("open");
  }
  function closeCheckout() { el("checkout").classList.remove("open"); }

  function submitOrder() {
    var nick = el("in-nick").value.trim();
    var email = el("in-email").value.trim();
    var ok = true;
    el("err-nick").style.display = "none";
    el("err-email").style.display = "none";
    if (nick.length < 3) { el("err-nick").style.display = "block"; ok = false; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { el("err-email").style.display = "block"; ok = false; }
    if (!ok) return;
    // Здесь позже вызывается реальная платёжная система (ЮKassa и т.п.)
    toast("Демо: заказ для «" + nick + "» оформлен на " + rub(cartTotal()));
    state.cart = []; saveCart(); renderCart(); closeCheckout();
    el("in-nick").value = ""; el("in-email").value = "";
  }

  /* --- Анимация цифр ---------------------------------------------------- */
  function animateCounters() {
    $all("[data-count]").forEach(function (node) {
      var target = parseFloat(node.getAttribute("data-count"));
      var decimals = (String(target).split(".")[1] || "").length;
      function fmt(v) { return decimals ? v.toFixed(decimals) : String(Math.round(v)); }
      var start = 0, dur = 900, t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var val = target * (1 - Math.pow(1 - p, 3));
        node.textContent = fmt(val);
        if (p < 1) requestAnimationFrame(step);
      }
      if (window.requestAnimationFrame) requestAnimationFrame(step);
      // Страховка: если анимация не проиграла (вкладка неактивна и т. п.)
      setTimeout(function () { node.textContent = fmt(target); }, 1100);
    });
  }

  /* --- События интерфейса ---------------------------------------------- */
  function bindUI() {
    // Копирование IP
    $all("[data-copy-ip]").forEach(function (b) {
      b.addEventListener("click", function () { copyText(C.serverIp, "IP скопирован: " + C.serverIp); });
    });

    // Мобильное меню
    el("burger").addEventListener("click", function () { el("mobile-menu").classList.add("open"); });
    el("mobile-close").addEventListener("click", function () { el("mobile-menu").classList.remove("open"); });
    el("mobile-menu").addEventListener("click", function (e) {
      if (e.target === el("mobile-menu")) el("mobile-menu").classList.remove("open");
    });
    $all("#mobile-nav a").forEach(function (a) {
      a.addEventListener("click", function () { el("mobile-menu").classList.remove("open"); });
    });

    // Корзина
    $all("[data-open-cart]").forEach(function (b) { b.addEventListener("click", function () { el("cart").classList.add("open"); }); });
    $all("[data-close-cart]").forEach(function (b) { b.addEventListener("click", function () { el("cart").classList.remove("open"); }); });
    el("cart").addEventListener("click", function (e) { if (e.target === el("cart")) el("cart").classList.remove("open"); });
    el("cart-checkout").addEventListener("click", openCheckout);

    // Оформление
    $all("[data-close-checkout]").forEach(function (b) { b.addEventListener("click", closeCheckout); });
    el("checkout").addEventListener("click", function (e) { if (e.target === el("checkout")) closeCheckout(); });
    el("submit-order").addEventListener("click", submitOrder);
    $all("#checkout .method").forEach(function (m) {
      m.addEventListener("click", function () {
        $all("#checkout .method").forEach(function (x) { x.classList.remove("on"); });
        m.classList.add("on");
      });
    });

    // Esc закрывает окна
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        el("cart").classList.remove("open");
        closeCheckout();
        el("mobile-menu").classList.remove("open");
      }
    });
  }

  /* --- Кастомный курсор -------------------------------------------------- */
  function initCursor() {
    if (!C.ui || !C.ui.customCursor) return;
    var fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    var ring = document.createElement("div"); ring.className = "cursor-ring";
    var dot = document.createElement("div"); dot.className = "cursor-dot";
    if (C.ui.cursorColor) {
      ring.style.borderColor = C.ui.cursorColor;
      dot.style.background = C.ui.cursorColor;
    }
    document.body.appendChild(ring);
    document.body.appendChild(dot);
    document.body.classList.add("custom-cursor");

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;
    var hoverSel = "a, button, input, textarea, select, label, .card, .mode-tab, .cat, .method, .lb-row, .feed-item, .podium .p, [data-copy-ip]";

    function show() { ring.classList.remove("hide"); dot.classList.remove("hide"); }
    function hide() { ring.classList.add("hide"); dot.classList.add("hide"); }

    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
      var overText = e.target && e.target.closest && e.target.closest("input, textarea");
      ring.classList.toggle("text", !!overText);
      show();
    });
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);

    document.addEventListener("mouseover", function (e) {
      if (e.target && e.target.closest && e.target.closest(hoverSel)) ring.classList.add("hover");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target && e.target.closest && e.target.closest(hoverSel)) ring.classList.remove("hover");
    });
    document.addEventListener("mousedown", function () { ring.classList.add("click"); });
    document.addEventListener("mouseup", function () { ring.classList.remove("click"); });

    function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  /* --- Появление секций при прокрутке ----------------------------------- */
  function initReveal() {
    if (!C.ui || !C.ui.revealOnScroll) return;
    if (!("IntersectionObserver" in window)) return;
    var targets = $all(".section, .cta-block, .info-card, .podium, .sale, .panel");
    targets.forEach(function (n) { n.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (n) { io.observe(n); });

    // Страховка: через 2.5 с раскрываем всё, что уже должно быть видно
    setTimeout(function () {
      targets.forEach(function (n) {
        if (n.getBoundingClientRect().top < window.innerHeight) n.classList.add("in");
      });
    }, 2500);
  }

  /* --- Старт ------------------------------------------------------------ */
  function init() {
    loadCart();
    renderBrand();
    renderNav();
    renderHero();
    renderOnline();
    renderFeed();
    renderSale();
    renderModeTabs();
    renderCats();
    renderProducts();
    renderTopPlayers();
    renderRules();
    renderPartners();
    renderCTA();
    renderFooterLinks();
    renderCart();
    bindUI();
    animateCounters();
    initReveal();
    initCursor();
    $all("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
