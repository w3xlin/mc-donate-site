/* =========================================================================
   ДАННЫЕ МАГАЗИНА
   -------------------------------------------------------------------------
   Товары, топ игроков и лента покупок. Всё демонстрационное — замените
   на свои реальные данные.
   ========================================================================= */

/* --- Товары ---------------------------------------------------------------
   mode      — id режима из config.js
   category  — id категории внутри режима
   tag       — "Хит" / "Новинка" / "" (пусто = без плашки)
   ------------------------------------------------------------------------- */
window.SHOP_PRODUCTS = [
  /* --- Классика --- */
  { id: "c-vip",     mode: "classic", category: "ranks", name: "VIP",        desc: "Цветной ник, /fly в лобби, 2 дома",  price: 199,  oldPrice: 299,  stock: 999, icon: "⭐", tag: "Хит" },
  { id: "c-premium", mode: "classic", category: "ranks", name: "PREMIUM",    desc: "Все привилегии VIP + /heal, 5 домов", price: 499,  oldPrice: 699,  stock: 500, icon: "👑", tag: "Хит" },
  { id: "c-deluxe",  mode: "classic", category: "ranks", name: "DELUXE",     desc: "Максимум возможностей и команд",     price: 999,  oldPrice: 1499, stock: 200, icon: "💠", tag: "" },
  { id: "c-case-a",  mode: "classic", category: "cases", name: "Кейс «Ресурсы»", desc: "Ресурсы, еда и инструменты",      price: 99,   oldPrice: 149,  stock: 999, icon: "🎁", tag: "" },
  { id: "c-case-b",  mode: "classic", category: "cases", name: "Кейс «Алмаз»",   desc: "Алмазы, незерит и зачарования",   price: 249,  oldPrice: 349,  stock: 999, icon: "💎", tag: "Хит" },
  { id: "c-coins-s", mode: "classic", category: "coins", name: "1 000 монет",  desc: "Внутриигровая валюта сервера",    price: 149,  oldPrice: 0,    stock: 999, icon: "🪙", tag: "" },
  { id: "c-coins-l", mode: "classic", category: "coins", name: "10 000 монет", desc: "Выгодный пакет валюты",           price: 1199, oldPrice: 1490, stock: 999, icon: "💰", tag: "" },

  /* --- Анархия --- */
  { id: "a-vip",     mode: "anarchy", category: "ranks", name: "Бунтарь",      desc: "Кит раз в день, /tpa, 3 дома",       price: 249,  oldPrice: 349,  stock: 999, icon: "🔥", tag: "Хит" },
  { id: "a-premium", mode: "anarchy", category: "ranks", name: "Легенда",      desc: "Усиленный кит, /near, 6 домов",      price: 599,  oldPrice: 799,  stock: 500, icon: "⚔️", tag: "Хит" },
  { id: "a-case-a",  mode: "anarchy", category: "cases", name: "Кейс «Рейд»",  desc: "Зачарования и талисманы",            price: 199,  oldPrice: 299,  stock: 999, icon: "🧨", tag: "" },
  { id: "a-case-b",  mode: "anarchy", category: "cases", name: "Кейс «Ядро»",  desc: "Редкие артефакты анархии",           price: 399,  oldPrice: 549,  stock: 999, icon: "☠️", tag: "" },
  { id: "a-coins-s", mode: "anarchy", category: "coins", name: "1 000 монет",  desc: "Валюта для аукциона",                price: 149,  oldPrice: 0,    stock: 999, icon: "🪙", tag: "" },
  { id: "a-coins-l", mode: "anarchy", category: "coins", name: "10 000 монет", desc: "Крупный пакет валюты",               price: 1199, oldPrice: 1490, stock: 999, icon: "💰", tag: "" },

  /* --- SkyBlock --- */
  { id: "s-vip",     mode: "skyblock", category: "ranks", name: "Островитянин", desc: "Больше островов и /is fly",         price: 299,  oldPrice: 399,  stock: 999, icon: "🏝️", tag: "Хит" },
  { id: "s-premium", mode: "skyblock", category: "ranks", name: "Магнат",       desc: "Максимум построек и команд",         price: 699,  oldPrice: 899,  stock: 500, icon: "🏰", tag: "Хит" },
  { id: "s-case-a",  mode: "skyblock", category: "cases", name: "Кейс «Урожай»", desc: "Семена, ресурсы, спавнеры",         price: 149,  oldPrice: 219,  stock: 999, icon: "🌾", tag: "" },
  { id: "s-case-b",  mode: "skyblock", category: "cases", name: "Кейс «Спавнер»", desc: "Спавнеры мобов и валюта",          price: 349,  oldPrice: 469,  stock: 999, icon: "🕸️", tag: "" },
  { id: "s-coins-s", mode: "skyblock", category: "coins", name: "1 000 монет",  desc: "Валюта для рынка",                   price: 149,  oldPrice: 0,    stock: 999, icon: "🪙", tag: "" },
  { id: "s-coins-l", mode: "skyblock", category: "coins", name: "10 000 монет", desc: "Выгодный пакет валюты",              price: 1199, oldPrice: 1490, stock: 999, icon: "💰", tag: "" },

  /* --- PvP --- */
  { id: "p-vip",     mode: "pvp", category: "ranks", name: "Боец",      desc: "Кит арены, /spawn, 2 дома",             price: 199,  oldPrice: 279,  stock: 999, icon: "🗡️", tag: "Хит" },
  { id: "p-premium", mode: "pvp", category: "ranks", name: "Гладиатор", desc: "Усиленные наборы и статистика",         price: 499,  oldPrice: 649,  stock: 500, icon: "🛡️", tag: "Хит" },
  { id: "p-case-a",  mode: "pvp", category: "cases", name: "Кейс «Арена»", desc: "Сеты брони и оружие",                price: 179,  oldPrice: 259,  stock: 999, icon: "🏹", tag: "" },
  { id: "p-case-b",  mode: "pvp", category: "cases", name: "Кейс «Титан»", desc: "Топовое снаряжение",                 price: 379,  oldPrice: 499,  stock: 999, icon: "🥊", tag: "" },
  { id: "p-coins-s", mode: "pvp", category: "coins", name: "1 000 монет",  desc: "Валюта для арены",                   price: 149,  oldPrice: 0,    stock: 999, icon: "🪙", tag: "" },
  { id: "p-coins-l", mode: "pvp", category: "coins", name: "10 000 монет", desc: "Крупный пакет валюты",               price: 1199, oldPrice: 1490, stock: 999, icon: "💰", tag: "" }
];

/* --- Топ игроков (демо) ------------------------------------------------- */
window.TOP_PLAYERS = [
  { nick: "Notch",        amount: 48750 },
  { nick: "Herobrine",    amount: 41200 },
  { nick: "Steve",        amount: 38740 },
  { nick: "Alex",         amount: 33110 },
  { nick: "Dinnerbone",   amount: 29480 },
  { nick: "CreeperKing",  amount: 24770 },
  { nick: "EnderWoman",   amount: 21030 },
  { nick: "SkyRider",     amount: 18990 },
  { nick: "RedstonePro",  amount: 16240 },
  { nick: "DiamondMine",  amount: 14120 }
];

/* --- Лента «Недавние покупки» (демо) ------------------------------------ */
window.RECENT_PURCHASES = [
  { nick: "Miner_92",  item: "VIP",            amount: 199  },
  { nick: "SkyWalker", item: "Кейс «Алмаз»",   amount: 249  },
  { nick: "NovaCat",   item: "PREMIUM",        amount: 499  },
  { nick: "ZeroCool",  item: "10 000 монет",   amount: 1199 },
  { nick: "BeeQueen",  item: "Кейс «Урожай»",  amount: 149  },
  { nick: "LuckyPvP",  item: "Гладиатор",      amount: 499  },
  { nick: "GhostRider",item: "DELUXE",         amount: 999  }
];
