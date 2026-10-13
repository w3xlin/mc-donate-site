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
    cart: [],
    promo: { code: "", pct: 0 },
    pay: (C.payments && C.payments[0] ? C.payments[0].id : "card")
  };
  var detail = { id: null, durId: null, qty: 1 };

  /* --- Иконки ----------------------------------------------------------- */
  var ICON = {
    cart: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/></svg>',
    copy: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    check: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    zap: '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z"/></svg>',
    discord: '<svg viewBox="0 0 24 24"><path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.3.5a14.6 14.6 0 0 1 4.3 2.2 13.9 13.9 0 0 0-12.8 0A14.6 14.6 0 0 1 10.9 3.5L10.6 3a19.8 19.8 0 0 0-4.9 1.4C2.4 9.2 1.7 14 2 18.7a19.9 19.9 0 0 0 6 3l.8-1.3c-1-.4-2-.9-2.8-1.6l.7-.5a14.2 14.2 0 0 0 12.6 0l.7.5c-.9.7-1.8 1.2-2.8 1.6l.8 1.3a19.9 19.9 0 0 0 6-3c.4-5.4-.5-10.2-3.2-14.3ZM8.7 15.6c-1.2 0-2.2-1.1-2.2-2.4S7.5 10.8 8.7 10.8s2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Zm6.6 0c-1.2 0-2.2-1.1-2.2-2.4s1-2.4 2.2-2.4 2.2 1.1 2.2 2.4-1 2.4-2.2 2.4Z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24"><path d="M21.9 4.3 18.6 20c-.2 1-.9 1.3-1.8.8l-4.9-3.6-2.4 2.3c-.3.3-.5.5-1 .5l.3-4.9 9-8.1c.4-.3-.1-.5-.6-.2L6 13.4l-4.8-1.5c-1-.3-1-1 .2-1.5l18.8-7.2c.9-.3 1.6.2 1.3 1.1Z"/></svg>'
  };

  /* --- Утилиты ---------------------------------------------------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(id) { return document.getElementById(id); }
  function rub(n) { return Math.round(n).toLocaleString("ru-RU") + " " + C.shop.currency; }
  function num(n) { return Math.round(n).toLocaleString("ru-RU"); }
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
  function modeLabelById(id) {
    for (var i = 0; i < C.modes.length; i++) if (C.modes[i].id === id) return C.modes[i].label;
    return "";
  }
  function paymentById(id) {
    for (var i = 0; i < (C.payments || []).length; i++) if (C.payments[i].id === id) return C.payments[i];
    return (C.payments || [])[0] || { id: "card", name: "Оплата", feePct: 0, min: 0 };
  }

  function toast(msg) {
    var box = el("toasts"); if (!box) return;
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = msg;
    box.appendChild(t);
    setTimeout(function () { t.style.opacity = "0"; t.style.transition = ".3s"; }, 1900);
    setTimeout(function () { t.remove(); }, 2300);
  }

  function copyText(text, msg) {
    function done() { toast(msg || "Скопировано: " + text); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
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
    $all("[data-icon]").forEach(function (n) {
      var name = n.getAttribute("data-icon");
      if (ICON[name]) n.innerHTML = ICON[name];
    });
  }

  function renderNav() {
    var here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    var nav = el("nav"), mob = el("mobile-nav");
    if (!nav || !mob) return;
    nav.innerHTML = C.pages.map(function (p) {
      var active = (p.href.split("#")[0].toLowerCase() === here) ? " class=\"active-link\"" : "";
      return "<a" + active + ' href="' + esc(p.href) + '">' + esc(p.label) + "</a>";
    }).join("") + '<a href="#shop">В магазин</a>';
    mob.innerHTML = C.pages.map(function (p) {
      return '<a href="' + esc(p.href) + '">' + esc(p.label) + "</a>";
    }).join("") +
      '<a href="#shop">В магазин</a>' +
      '<a href="' + esc(C.supportUrl) + '" target="_blank" rel="noopener">Поддержка ↗</a>';
  }

  function setText(id, v) { var n = el(id); if (n) n.textContent = v; }

  function renderHero() {
    var b = el("hero-badge"); if (b) b.innerHTML = '<span class="dot"></span>' + esc(C.hero.badge);
    setText("hero-title", C.hero.title);
    setText("hero-subtitle", C.hero.subtitle);
    setText("hero-primary", C.hero.primaryCta);
    var sec = el("hero-secondary"); if (sec) sec.innerHTML = ICON.copy + esc(C.hero.secondaryCta);
    setText("hero-avatar", initials(C.serverShort));
    var box = el("hero-stats");
    if (box) box.innerHTML = C.heroStats.map(function (s) {
      var val = s.decimals ? Number(s.value).toFixed(s.decimals) : Math.round(s.value);
      return '<div class="stat"><b><span data-count="' + esc(val) + '">0</span>' +
        esc(s.suffix || "") + "</b><span>" + esc(s.label) + "</span></div>";
    }).join("");
    setText("hero-ip", C.serverIp);
  }

  function renderOnline() {
    setText("online-title", C.online.title);
    setText("online-subtitle", C.online.subtitle);
    setText("online-ip", C.serverIp);
    setText("online-current", num(C.online.current));
    setText("online-avg", num(C.online.avg));
    setText("online-max", num(C.online.max));
    var bars = el("bars");
    if (bars) {
      var out = "";
      for (var i = 0; i < 28; i++) {
        var pct = 20 + Math.round(60 * Math.abs(Math.sin(i / 3.3)) + (i / 28) * 18);
        if (pct > 100) pct = 100;
        out += '<div class="bar" style="height:' + pct + '%" title="' + pct + '%"></div>';
      }
      bars.innerHTML = out;
    }
  }

  function renderFeed() {
    var box = el("feed"); if (!box) return;
    box.innerHTML = RECENT.map(function (r) {
      return '<div class="feed-item"><div class="ava">' + esc(initials(r.nick)) + "</div>" +
        '<div><div class="nick">' + esc(r.nick) + '</div><div class="item">' + esc(r.item) + "</div></div>" +
        '<div class="amount">' + esc(rub(r.amount)) + "</div></div>";
    }).join("");
  }

  function renderSale() {
    var sale = C.sale, node = el("sale");
    if (!node) return;
    if (!sale.enabled) { node.style.display = "none"; return; }
    setText("sale-title", sale.title + " — скидки до " + sale.discountPct + "%");
    var ends = Date.now() + sale.durationHours * 3600 * 1000;
    function tick() {
      var left = Math.max(0, ends - Date.now());
      setText("t-h", String(Math.floor(left / 3600000)).padStart(2, "0"));
      setText("t-m", String(Math.floor((left % 3600000) / 60000)).padStart(2, "0"));
      setText("t-s", String(Math.floor((left % 60000) / 1000)).padStart(2, "0"));
    }
    tick(); setInterval(tick, 1000);
  }

  /* --- Цены и срок действия --------------------------------------------- */
  function isDuratable(p) { return p.category === "ranks"; }
  function durationById(id) {
    var list = C.durations || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0] || { id: "30", label: "30 дней", mult: 1 };
  }
  function basePrice(p) { return p.price; }
  function unitPrice(p, durId) {
    var base = basePrice(p);
    if (!isDuratable(p)) return base;
    return Math.round(base * (durationById(durId) || {}).mult);
  }
  function unitOldPrice(p, durId) {
    var base = (p.oldPrice && p.oldPrice > p.price) ? p.oldPrice : p.price;
    if (!isDuratable(p)) return base;
    return Math.round(base * (durationById(durId) || {}).mult);
  }
  function discountPct(p) {
    return (p.oldPrice && p.oldPrice > p.price) ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  }

  function renderModeTabs() {
    var box = el("mode-tabs"); if (!box) return;
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

  function renderCats() {
    var box = el("cats"); if (!box) return;
    var m = currentMode();
    var cats = [{ id: "all", label: "Все товары" }].concat(m ? m.categories : []);
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
    var grid = el("products"); if (!grid) return;
    var list = PRODUCTS.filter(function (p) {
      return p.mode === state.mode && (state.category === "all" || p.category === state.category);
    });
    if (!list.length) { grid.innerHTML = '<div class="empty" style="grid-column:1/-1">' + esc(C.shop.emptyText) + "</div>"; return; }

    grid.innerHTML = list.map(function (p) {
      var d = discountPct(p), durId = isDuratable(p) ? (C.durations[0] || {}).id : null;
      var price = unitPrice(p, durId), old = unitOldPrice(p, durId);
      var tagHtml = p.tag ? '<span class="tag' + (p.tag === "Новинка" ? " new" : "") + '">' + esc(p.tag) + "</span>" : "";
      var discHtml = d > 0 ? '<span class="disc">−' + d + "%</span>" : "";
      var oldHtml = old > price ? '<span class="old">' + esc(rub(old)) + "</span>" : "";
      var from = isDuratable(p) ? '<span class="muted" style="font-size:13px">от </span>' : "";
      return '<article class="card" data-detail="' + esc(p.id) + '">' + tagHtml +
        '<div class="picon">' + esc(p.icon) + "</div>" +
        "<h4>" + esc(p.name) + "</h4>" +
        '<p class="desc">' + esc(p.desc) + "</p>" +
        '<div class="stock">Осталось ' + esc(p.stock) + " шт</div>" +
        '<div class="prices">' + discHtml + from + '<span class="price">' + esc(rub(price)) + "</span>" + oldHtml + "</div>" +
        '<button class="btn btn-primary btn-block" data-detail-btn="' + esc(p.id) + '">' + ICON.cart + "В корзину</button>" +
        "</article>";
    }).join("");

    $all("[data-detail-btn]", grid).forEach(function (b) {
      b.addEventListener("click", function (e) { e.stopPropagation(); openDetail(b.getAttribute("data-detail-btn")); });
    });
    $all(".card", grid).forEach(function (c) {
      c.addEventListener("click", function () { openDetail(c.getAttribute("data-detail")); });
    });
  }

  /* --- Карточка товара (модальное окно) --------------------------------- */
  function openDetail(id) {
    var p = findProduct(id); if (!p || !el("detail")) return;
    detail.id = id;
    detail.durId = isDuratable(p) ? (C.durations[0] || {}).id : null;
    detail.qty = 1;
    renderDetail();
    el("detail").classList.add("open");
  }
  function closeDetail() { if (el("detail")) el("detail").classList.remove("open"); }

  function renderDetail() {
    var p = findProduct(detail.id); if (!p) return;
    var durId = detail.durId;
    var price = unitPrice(p, durId), old = unitOldPrice(p, durId);
    var d = discountPct(p);

    var durHtml = "";
    if (isDuratable(p)) {
      durHtml = '<div class="field" style="margin-top:18px"><label>Выбери срок действия</label>' +
        '<div class="dur-list">' + (C.durations || []).map(function (x) {
          var active = x.id === durId ? " active" : "";
          return '<button class="dur' + active + '" data-dur="' + esc(x.id) + '">' +
            '<span class="dt">' + esc(x.tag) + '</span>' +
            '<span class="dl">' + esc(x.label) + "</span>" +
            '<span class="dp">' + esc(rub(Math.round(basePrice(p) * x.mult))) + "</span></button>";
        }).join("") + "</div></div>";
    }

    el("detail-box").innerHTML =
      '<div class="detail-head"><div class="picon" style="width:64px;height:64px;font-size:32px">' + esc(p.icon) + "</div>" +
      "<div><h3 style='margin:0'>" + esc(p.name) + "</h3>" +
      '<div class="muted" style="font-size:14px">' + esc(p.desc) + "</div></div></div>" +
      (p.tag ? '<span class="tag">' + esc(p.tag) + "</span>" : "") +
      '<div class="muted" style="font-size:13px;margin-top:6px">Осталось ' + esc(p.stock) + " шт · ограниченный тираж</div>" +
      durHtml +
      '<div class="detail-notes"><div>' + ICON.zap + "Выдаётся мгновенно после оплаты</div><div>∞ Остаётся навсегда — вайпы не влияют</div></div>" +
      '<a class="btn btn-block" data-support target="_blank" rel="noopener" style="margin-top:6px">Тех. поддержка в Telegram</a>' +
      '<div class="detail-foot">' +
        "<div><div class='price'>" + esc(rub(price * detail.qty)) + "</div>" +
        (old > price ? '<div class="muted" style="font-size:13px">' + esc(rub(old * detail.qty)) + " · выгода " + esc(rub((old - price) * detail.qty)) + "</div>" : "") +
        (d > 0 ? '<div class="muted" style="font-size:13px">−' + d + "% от обычной цены</div>" : "") +
        "</div>" +
        '<div class="qty qty-lg"><button data-dq="-1">−</button><span>' + detail.qty + '</span><button data-dq="1">+</button></div>' +
      "</div>" +
      '<button class="btn btn-primary btn-block" id="detail-add" style="margin-top:14px">' + ICON.cart + "В корзину</button>";

    // обработчики
    if (isDuratable(p)) $all("#detail-box [data-dur]").forEach(function (b) {
      b.addEventListener("click", function () { detail.durId = b.getAttribute("data-dur"); renderDetail(); });
    });
    $all("#detail-box [data-dq]").forEach(function (b) {
      b.addEventListener("click", function () {
        detail.qty = Math.max(1, detail.qty + parseInt(b.getAttribute("data-dq"), 10));
        renderDetail();
      });
    });
    var add = el("detail-add");
    if (add) add.addEventListener("click", function () {
      addToCart(p.id, detail.durId, detail.qty);
      closeDetail();
    });
    $all("#detail-box [data-support]").forEach(function (n) { n.href = C.supportUrl; });
  }

  /* --- Топ, правила, партнёрка ------------------------------------------ */
  function renderTopPlayers() {
    var box = el("leaderboard"); if (!box) return;
    var podium = TOP.slice(0, 3);
    var order = [podium[1], podium[0], podium[2]];
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
    setText("rules-title", C.rules.title);
    setText("rules-sub", C.rules.subtitle);
    setText("rules-text", C.rules.text);
    setText("rules-note", C.rules.appealNote);
    var box = el("rules-list");
    if (box) box.innerHTML = C.rules.items.map(function (t, i) {
      return '<div><span class="num">' + (i + 1) + "</span>" + esc(t) + "</div>";
    }).join("");
  }

  function renderPartners() {
    setText("partners-title", C.partners.title);
    setText("partners-sub", C.partners.subtitle);
    setText("partners-text", C.partners.text);
    setText("partners-example", C.partners.example);
    var box = el("partners-perks");
    if (box) box.innerHTML = C.partners.perks.map(function (p) {
      return '<div class="perk"><b>' + esc(p.value) + "</b><span>" + esc(p.label) + "</span></div>";
    }).join("");
  }

  function renderCTA() { setText("cta-ip", C.serverIp); }

  function renderFooterLinks() {
    var box = el("footer-links"); if (!box) return;
    box.innerHTML = C.footerLinks.map(function (l) {
      return '<a href="' + esc(l.href) + '">' + esc(l.label) + "</a>";
    }).join("");
  }

  /* --- Корзина ---------------------------------------------------------- */
  function findProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }
  function ckey(id, durId) { return id + "@" + (durId || "x"); }

  function addToCart(id, durId, qty) {
    var p = findProduct(id); if (!p) return;
    qty = Math.max(1, qty || 1);
    var key = ckey(id, durId);
    var found = null;
    for (var i = 0; i < state.cart.length; i++) if (state.cart[i].key === key) found = state.cart[i];
    if (found) found.qty += qty;
    else state.cart.push({
      key: key, id: p.id, name: p.name, icon: p.icon, mode: p.mode,
      durId: durId || null,
      durLabel: isDuratable(p) ? (durationById(durId) || {}).label : "",
      unit: unitPrice(p, durId), unitOld: unitOldPrice(p, durId), qty: qty
    });
    saveState(); renderCart();
    toast("Добавлено: " + p.name + (isDuratable(p) ? " (" + (durationById(durId) || {}).label + ")" : ""));
  }
  function changeQty(key, delta) {
    for (var i = 0; i < state.cart.length; i++) {
      if (state.cart[i].key === key) {
        state.cart[i].qty += delta;
        if (state.cart[i].qty <= 0) state.cart.splice(i, 1);
        break;
      }
    }
    saveState(); renderCart();
  }
  function removeFromCart(key) {
    state.cart = state.cart.filter(function (i) { return i.key !== key; });
    saveState(); renderCart();
  }

  function finance() {
    var subtotal = 0, oldSubtotal = 0;
    state.cart.forEach(function (i) { subtotal += i.unit * i.qty; oldSubtotal += i.unitOld * i.qty; });
    var itemsDiscount = oldSubtotal - subtotal;

    var volumePct = 0;
    (C.volumeDiscounts || []).forEach(function (t) { if (subtotal >= t.min) volumePct = Math.max(volumePct, t.pct); });
    var volumeDiscount = Math.round(subtotal * volumePct / 100);
    var afterVolume = subtotal - volumeDiscount;

    var promoPct = state.promo.pct || 0;
    var promoDiscount = Math.round(afterVolume * promoPct / 100);
    var payable = afterVolume - promoDiscount;

    var pay = paymentById(state.pay);
    var min = Math.max(C.shop.minOrder || 0, pay.min || 0);
    var fee = Math.round(payable * (pay.feePct || 0) / 100);
    var total = payable + fee;
    var tokens = Math.floor(payable * ((C.bonus && C.bonus.perRub) || 0));

    return {
      count: state.cart.reduce(function (a, i) { return a + i.qty; }, 0),
      subtotal: subtotal, oldSubtotal: oldSubtotal, itemsDiscount: itemsDiscount,
      volumePct: volumePct, volumeDiscount: volumeDiscount,
      promoPct: promoPct, promoDiscount: promoDiscount,
      payable: payable, pay: pay, min: min, fee: fee, total: total, tokens: tokens,
      savings: oldSubtotal - payable,
      belowMin: state.cart.length > 0 && payable < min
    };
  }

  function renderCart() {
    var f = finance();
    $all("[data-cart-count]").forEach(function (e) { e.textContent = f.count; });
    $all("[data-cart-total]").forEach(function (e) { e.textContent = rub(f.payable); });

    var body = el("cart-body");
    if (body) {
      if (!state.cart.length) {
        body.innerHTML = '<div class="drawer-empty"><p>Корзина пуста</p><p class="muted">Привилегии, кейсы и валюта выдаются мгновенно после оплаты.</p></div>';
      } else {
        body.innerHTML = state.cart.map(function (i) {
          return '<div class="cart-item"><div class="picon">' + esc(i.icon) + "</div>" +
            '<div class="info"><div class="nm">' + esc(i.name) + "</div>" +
            '<div class="mode">' + esc(modeLabelById(i.mode)) + (i.durLabel ? " · " + esc(i.durLabel) : "") + "</div>" +
            '<div class="qty" style="margin-top:8px"><button data-dec="' + esc(i.key) + '">−</button><span>' + i.qty + '</span><button data-inc="' + esc(i.key) + '">+</button></div></div>' +
            '<div class="line"><span class="p">' + esc(rub(i.unit * i.qty)) + "</span>" +
            '<button class="rm" data-rm="' + esc(i.key) + '">Удалить</button></div></div>';
        }).join("");
      }
      $all("[data-inc]", body).forEach(function (b) { b.addEventListener("click", function () { changeQty(b.getAttribute("data-inc"), 1); }); });
      $all("[data-dec]", body).forEach(function (b) { b.addEventListener("click", function () { changeQty(b.getAttribute("data-dec"), -1); }); });
      $all("[data-rm]", body).forEach(function (b) { b.addEventListener("click", function () { removeFromCart(b.getAttribute("data-rm")); }); });
    }

    setText("sum-old", rub(f.oldSubtotal));
    setText("sum-volume", "−" + rub(f.volumeDiscount));
    setText("sum-save", "−" + rub(f.savings));
    setText("sum-total", rub(f.payable));
    var btn = el("cart-checkout");
    if (btn) btn.disabled = !state.cart.length;
  }

  function saveState() {
    try { localStorage.setItem("shop_state", JSON.stringify({ cart: state.cart, promo: state.promo, pay: state.pay })); } catch (e) {}
  }
  function loadState() {
    try {
      var raw = localStorage.getItem("shop_state");
      if (raw) {
        var s = JSON.parse(raw) || {};
        state.cart = s.cart || [];
        state.promo = s.promo || { code: "", pct: 0 };
        state.pay = s.pay || state.pay;
      }
    } catch (e) {}
  }

  /* --- Оформление заказа ------------------------------------------------ */
  function renderCheckout() {
    var f = finance();
    // товары
    var items = el("checkout-items");
    if (items) items.innerHTML = state.cart.map(function (i) {
      return '<div class="ci-row"><div class="picon">' + esc(i.icon) + "</div>" +
        '<div class="ci-info"><div class="nm">' + esc(i.name) + " × " + i.qty + "</div>" +
        '<div class="muted">' + esc(modeLabelById(i.mode)) + (i.durLabel ? " · " + esc(i.durLabel) : "") + "</div></div>" +
        '<div class="ci-price">' + esc(rub(i.unit * i.qty)) + "</div></div>";
    }).join("");

    // способы оплаты
    var pm = el("pay-methods");
    if (pm) pm.innerHTML = (C.payments || []).map(function (m) {
      var on = m.id === state.pay ? " on" : "";
      var feeChip = m.feePct > 0 ? "+" + m.feePct + "% комиссия" : "без комиссии";
      return '<div class="method' + on + '" data-pay="' + esc(m.id) + '">' +
        "<div><div>" + esc(m.name) + '</div><div class="muted" style="font-size:13px">' + esc(m.hint) + "</div></div>" +
        '<div class="fee">' + esc(feeChip) + "</div></div>";
    }).join("");

    // промокод
    var pi = el("promo-input");
    if (pi) pi.value = state.promo.code || "";

    // итоги
    setText("co-subtotal", rub(f.subtotal));
    toggleRow("co-volume-row", f.volumeDiscount > 0, "Скидка за объём " + f.volumePct + "%", "−" + rub(f.volumeDiscount));
    toggleRow("co-promo-row", f.promoDiscount > 0, "Промокод" + (state.promo.code ? " " + state.promo.code : ""), "−" + rub(f.promoDiscount));
    toggleRow("co-fee-row", f.fee > 0, "Комиссия (" + f.pay.name + ")", "+" + rub(f.fee));
    setText("co-tokens", "+" + num(f.tokens) + " " + ((C.bonus && C.bonus.unit) || ""));
    setText("co-total", rub(f.total));
    setText("co-savings", f.savings > 0 ? "Ваша выгода −" + rub(f.savings) : "");

    var notice = el("min-notice");
    if (notice) {
      if (f.belowMin) {
        notice.style.display = "block";
        notice.textContent = "Минимальная сумма для этого способа оплаты — " + rub(f.min) + ". Добавьте товаров ещё на " + rub(f.min - f.payable) + ".";
      } else notice.style.display = "none";
    }
    var pay = el("submit-order");
    if (pay) { pay.disabled = f.belowMin || !state.cart.length; pay.textContent = "Оплатить " + rub(f.total); }

    // обработчики
    $all("#pay-methods .method").forEach(function (m) {
      m.addEventListener("click", function () { state.pay = m.getAttribute("data-pay"); saveState(); renderCheckout(); });
    });
  }

  function toggleRow(id, show, label, value) {
    var row = el(id); if (!row) return;
    row.style.display = show ? "flex" : "none";
    if (show) { var l = $(".lbl", row), v = $(".val", row); if (l) l.textContent = label; if (v) v.textContent = value; }
  }

  function openCheckout() {
    if (!state.cart.length) return;
    renderCheckout();
    el("checkout").classList.add("open");
    var n = el("in-nick"); if (n) setTimeout(function () { n.focus(); }, 200);
  }
  function closeCheckout() { if (el("checkout")) el("checkout").classList.remove("open"); }

  function submitOrder() {
    var nick = (el("in-nick") || {}).value || "";
    var email = (el("in-email") || {}).value || "";
    nick = nick.trim(); email = email.trim();
    var ok = true;
    el("err-nick").style.display = "none";
    el("err-email").style.display = "none";
    if (nick.length < 3) { el("err-nick").style.display = "block"; ok = false; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { el("err-email").style.display = "block"; ok = false; }
    if (!ok) return;

    // Демо-оплата. Здесь подключается реальная платёжная система.
    var f = finance();
    var order = {
      id: "MC-" + Date.now().toString().slice(-8),
      nick: nick, email: email,
      items: state.cart.map(function (i) {
        return { name: i.name, icon: i.icon, mode: modeLabelById(i.mode), dur: i.durLabel, qty: i.qty, total: i.unit * i.qty };
      }),
      tokens: f.tokens, tokenUnit: (C.bonus && C.bonus.unit) || "",
      fee: f.fee, total: f.total, payable: f.payable, pay: f.pay.name, savings: f.savings,
      date: new Date().toISOString()
    };
    try { localStorage.setItem("last_order", JSON.stringify(order)); } catch (e) {}

    renderSuccess(order);
    state.cart = []; state.promo = { code: "", pct: 0 };
    saveState(); renderCart();
    closeCheckout();
    el("success").classList.add("open");
    if (el("in-nick")) el("in-nick").value = "";
    if (el("in-email")) el("in-email").value = "";
  }

  function renderSuccess(o) {
    var box = el("success-box"); if (!box) return;
    box.innerHTML =
      '<div class="success-ic">' + ICON.check + "</div>" +
      "<h3 style='text-align:center;margin:8px 0 2px'>Оплата прошла</h3>" +
      '<p class="muted center" style="margin:0 0 16px">Покупка выдана на ник <b>' + esc(o.nick) + "</b>. Чек отправлен на " + esc(o.email) + ".</p>" +
      '<div class="order-id">Заказ ' + esc(o.id) + "</div>" +
      '<div class="order-list">' + o.items.map(function (i) {
        return '<div class="ci-row"><div class="picon">' + esc(i.icon) + "</div>" +
          '<div class="ci-info"><div class="nm">' + esc(i.name) + " × " + i.qty + "</div>" +
          '<div class="muted">' + esc(i.mode) + (i.dur ? " · " + esc(i.dur) : "") + "</div></div>" +
          '<div class="ci-price">' + esc(rub(i.total)) + "</div></div>";
      }).join("") + "</div>" +
      '<div class="summary-row"><span>Бонус</span><span style="color:#7ee2a1">+' + esc(num(o.tokens)) + " " + esc(o.tokenUnit) + "</span></div>" +
      (o.fee > 0 ? '<div class="summary-row"><span>Комиссия (' + esc(o.pay) + ")</span><span>+" + esc(rub(o.fee)) + "</span></div>" : "") +
      '<div class="summary-row total"><span>Оплачено</span><span>' + esc(rub(o.total)) + "</span></div>" +
      '<div style="display:flex;gap:10px;margin-top:16px">' +
        '<button class="btn btn-primary btn-block" data-close-success>Вернуться в магазин</button>' +
        '<a class="btn btn-block" href="thanks.html">Страница заказа</a>' +
      "</div>" +
      '<p class="muted center" style="font-size:12px;margin:12px 0 0">Если покупка не появилась — перезайдите на сервер. Номер заказа: ' + esc(o.id) + "</p>";

    $all("[data-close-success]", box).forEach(function (b) {
      b.addEventListener("click", function () { el("success").classList.remove("open"); });
    });
  }

  /* --- Анимация цифр ---------------------------------------------------- */
  function animateCounters() {
    $all("[data-count]").forEach(function (node) {
      var target = parseFloat(node.getAttribute("data-count"));
      var decimals = (String(target).split(".")[1] || "").length;
      function fmt(v) { return decimals ? v.toFixed(decimals) : String(Math.round(v)); }
      var t0 = null, dur = 900;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        node.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      if (window.requestAnimationFrame) requestAnimationFrame(step);
      setTimeout(function () { node.textContent = fmt(target); }, 1100);
    });
  }

  /* --- События интерфейса ---------------------------------------------- */
  function bindUI() {
    $all("[data-copy-ip]").forEach(function (b) {
      b.addEventListener("click", function () { copyText(C.serverIp, "IP скопирован: " + C.serverIp); });
    });

    if (el("burger")) el("burger").addEventListener("click", function () { el("mobile-menu").classList.add("open"); });
    if (el("mobile-close")) el("mobile-close").addEventListener("click", function () { el("mobile-menu").classList.remove("open"); });
    if (el("mobile-menu")) el("mobile-menu").addEventListener("click", function (e) {
      if (e.target === el("mobile-menu")) el("mobile-menu").classList.remove("open");
    });
    $all("#mobile-nav a").forEach(function (a) {
      a.addEventListener("click", function () { if (el("mobile-menu")) el("mobile-menu").classList.remove("open"); });
    });

    $all("[data-open-cart]").forEach(function (b) { b.addEventListener("click", function () { el("cart").classList.add("open"); }); });
    $all("[data-close-cart]").forEach(function (b) { b.addEventListener("click", function () { el("cart").classList.remove("open"); }); });
    if (el("cart")) el("cart").addEventListener("click", function (e) { if (e.target === el("cart")) el("cart").classList.remove("open"); });
    if (el("cart-checkout")) el("cart-checkout").addEventListener("click", openCheckout);

    $all("[data-close-checkout]").forEach(function (b) { b.addEventListener("click", closeCheckout); });
    if (el("checkout")) el("checkout").addEventListener("click", function (e) { if (e.target === el("checkout")) closeCheckout(); });
    if (el("submit-order")) el("submit-order").addEventListener("click", submitOrder);

    // деталь
    $all("[data-close-detail]").forEach(function (b) { b.addEventListener("click", closeDetail); });
    if (el("detail")) el("detail").addEventListener("click", function (e) { if (e.target === el("detail")) closeDetail(); });

    // успех
    if (el("success")) el("success").addEventListener("click", function (e) { if (e.target === el("success")) el("success").classList.remove("open"); });

    // промокод
    if (el("promo-apply")) el("promo-apply").addEventListener("click", function () {
      var code = ((el("promo-input") || {}).value || "").trim().toUpperCase();
      var pct = (C.promoCodes || {})[code] || 0;
      var msg = el("promo-msg");
      if (!code) { state.promo = { code: "", pct: 0 }; if (msg) { msg.textContent = ""; } }
      else if (pct > 0) { state.promo = { code: code, pct: pct }; if (msg) { msg.style.color = "#7ee2a1"; msg.textContent = "Промокод применён: −" + pct + "%"; } toast("Промокод " + code + ": −" + pct + "%"); }
      else { state.promo = { code: "", pct: 0 }; if (msg) { msg.style.color = "#ef4444"; msg.textContent = "Промокод не найден"; } }
      saveState(); renderCheckout(); renderCart();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (el("cart")) el("cart").classList.remove("open");
        if (el("mobile-menu")) el("mobile-menu").classList.remove("open");
        closeCheckout(); closeDetail();
        if (el("success")) el("success").classList.remove("open");
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
    if (C.ui.cursorColor) { ring.style.borderColor = C.ui.cursorColor; dot.style.background = C.ui.cursorColor; }
    document.body.appendChild(ring); document.body.appendChild(dot);
    document.body.classList.add("custom-cursor");

    var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
    var hoverSel = "a, button, input, textarea, select, label, .card, .mode-tab, .cat, .method, .lb-row, .feed-item, .podium .p, .dur, [data-copy-ip], [data-detail]";

    function show() { ring.classList.remove("hide"); dot.classList.remove("hide"); }
    function hide() { ring.classList.add("hide"); dot.classList.add("hide"); }

    document.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
      ring.classList.toggle("text", !!(e.target && e.target.closest && e.target.closest("input, textarea")));
      show();
    });
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);
    document.addEventListener("mouseover", function (e) { if (e.target && e.target.closest && e.target.closest(hoverSel)) ring.classList.add("hover"); });
    document.addEventListener("mouseout", function (e) { if (e.target && e.target.closest && e.target.closest(hoverSel)) ring.classList.remove("hover"); });
    document.addEventListener("mousedown", function () { ring.classList.add("click"); });
    document.addEventListener("mouseup", function () { ring.classList.remove("click"); });

    (function loop() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
  }

  /* --- Появление секций при прокрутке ----------------------------------- */
  function initReveal() {
    if (!C.ui || !C.ui.revealOnScroll) return;
    if (!("IntersectionObserver" in window)) return;
    var targets = $all(".section, .cta-block, .info-card, .podium, .sale, .panel");
    targets.forEach(function (n) { n.classList.add("reveal"); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    targets.forEach(function (n) { io.observe(n); });
    setTimeout(function () {
      targets.forEach(function (n) { if (n.getBoundingClientRect().top < window.innerHeight) n.classList.add("in"); });
    }, 2500);
  }

  /* --- Старт ------------------------------------------------------------ */
  function init() {
    loadState();
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
