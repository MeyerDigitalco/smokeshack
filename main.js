const SITE = {
  whatsapp: "27605375032",
  deliveryFee: 35,
  address: "14 Swartbos Avenue, Protea Park, Rustenburg",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=14+Swartbos+Avenue%2C+Protea+Park%2C+Rustenburg",
  hours: []
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const track = (name, data) => { try { if (window.umami) window.umami.track(name, data); } catch {} };
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

(() => {
  const root = document.documentElement, box = $("#launch");
  if (!root.classList.contains("prelaunch") || !box) return;
  const at = Date.parse(root.dataset.launch);
  const els = { d: $("[data-cd=d]"), h: $("[data-cd=h]"), m: $("[data-cd=m]"), s: $("[data-cd=s]") };
  const pad = n => String(n).padStart(2, "0");
  $("main").setAttribute("aria-hidden", "true");
  let timer;
  const open = () => {
    clearInterval(timer);
    box.classList.add("is-out");
    setTimeout(() => {
      root.classList.remove("prelaunch");
      $("main").removeAttribute("aria-hidden");
      box.remove();
      dispatchEvent(new Event("scroll"));
    }, 950);
  };
  const tick = () => {
    const left = at - Date.now();
    if (left <= 0) return open();
    const t = Math.floor(left / 1000);
    const v = { d: Math.floor(t / 86400), h: Math.floor(t / 3600) % 24, m: Math.floor(t / 60) % 60, s: t % 60 };
    for (const k in v) {
      const txt = pad(v[k]);
      if (els[k].textContent !== txt) {
        els[k].textContent = txt;
        if (!reduced) { els[k].classList.remove("tick"); void els[k].offsetWidth; els[k].classList.add("tick"); }
      }
    }
  };
  tick();
  timer = setInterval(tick, 250);
})();

(() => {
  if (SITE.address) $("[data-address]").textContent = SITE.address;
  if (SITE.mapUrl) { const m = $("[data-map]"); m.href = SITE.mapUrl; m.hidden = false; }
  if (SITE.hours.length) {
    $("[data-hours]").innerHTML = SITE.hours.map(([d, t]) => `<li><span>${d}</span><b>${t}</b></li>`).join("");
  }
  $$("[data-year]").forEach(e => (e.textContent = new Date().getFullYear()));
})();

(() => {
  const nav = $("#nav"), fab = $(".fab"), hero = $(".hero");
  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle("is-solid", y > 40);
    fab.classList.toggle("show", y > hero.offsetHeight * 0.7);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

(() => {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  const tabs = $$(".tab"), cats = $$(".cat"), bar = $(".menu__tabs");
  const setActive = id => tabs.forEach(t => {
    const on = t.getAttribute("href") === "#" + id;
    t.classList.toggle("is-active", on);
    on ? t.setAttribute("aria-current", "true") : t.removeAttribute("aria-current");
    if (on && bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: t.offsetLeft - bar.clientWidth / 2 + t.offsetWidth / 2, behavior: "smooth" });
  });
  let lock = 0, current = "";
  const spy = () => {
    if (Date.now() < lock) return;
    const line = bar.getBoundingClientRect().bottom + 40;
    let id = cats[0].id, last = -Infinity;
    for (const c of cats) {
      const t = c.getBoundingClientRect().top;
      if (t <= line && t > last + 10) { id = c.id; last = t; }
    }
    if (id !== current) { current = id; setActive(id); }
  };
  tabs.forEach(t => t.addEventListener("click", e => {
    e.preventDefault();
    const id = t.getAttribute("href").slice(1), el = document.getElementById(id);
    current = id; setActive(id); lock = Date.now() + 900;
    const y = el.getBoundingClientRect().top + scrollY - bar.getBoundingClientRect().height - 100;
    scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
  }));
  addEventListener("scroll", spy, { passive: true });
  spy();
})();

$$("[data-smoke]").forEach(c => {
  if (reduced) return;
  const ctx = c.getContext("2d");
  let w, h, dpr, puffs = [], embers = [], running = true;

  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = c.clientWidth; h = c.clientHeight;
    c.width = w * dpr; c.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const puff = (init) => ({
    x: Math.random() * w,
    y: init ? Math.random() * h : h + 80,
    r: 80 + Math.random() * 180,
    vy: 0.25 + Math.random() * 0.45,
    vx: (Math.random() - 0.5) * 0.25,
    a: 0,
    max: 0.05 + Math.random() * 0.07,
    life: 0,
    span: 600 + Math.random() * 700,
    wob: Math.random() * Math.PI * 2
  });

  const ember = () => ({
    x: w * (0.2 + Math.random() * 0.6),
    y: h + 10,
    vy: 0.8 + Math.random() * 1.6,
    vx: (Math.random() - 0.5) * 0.6,
    s: 0.8 + Math.random() * 1.8,
    life: 0,
    span: 200 + Math.random() * 240,
    wob: Math.random() * 10
  });

  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 256;
  const sg = sprite.getContext("2d");
  const grad = sg.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, "rgba(220,210,195,1)");
  grad.addColorStop(0.45, "rgba(200,190,175,.45)");
  grad.addColorStop(1, "rgba(200,190,175,0)");
  sg.fillStyle = grad; sg.fillRect(0, 0, 256, 256);

  size();
  const count = w < 700 ? 16 : 30;
  for (let i = 0; i < count; i++) puffs.push(puff(true));
  addEventListener("resize", size);

  new IntersectionObserver(([e]) => {
    running = e.isIntersecting;
    if (running) requestAnimationFrame(tick);
  }).observe(c);

  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    for (const p of puffs) {
      p.life++;
      p.wob += 0.008;
      p.x += p.vx + Math.sin(p.wob) * 0.3;
      p.y -= p.vy;
      p.r += 0.12;
      const t = p.life / p.span;
      p.a = t < 0.2 ? (t / 0.2) * p.max : Math.max(0, p.max * (1 - (t - 0.2) / 0.8));
      ctx.globalAlpha = p.a;
      ctx.drawImage(sprite, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      if (p.life > p.span || p.y < -p.r) Object.assign(p, puff(false));
    }
    if (Math.random() < 0.35) embers.push(ember());
    ctx.globalCompositeOperation = "lighter";
    embers = embers.filter(e => {
      e.life++;
      e.wob += 0.05;
      e.x += e.vx + Math.sin(e.wob) * 0.4;
      e.y -= e.vy;
      const t = e.life / e.span;
      ctx.globalAlpha = Math.max(0, 1 - t) * 0.9;
      ctx.fillStyle = t < 0.4 ? "#ffb35a" : "#e2572b";
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.s * (1 - t * 0.6), 0, Math.PI * 2);
      ctx.fill();
      return e.life < e.span;
    });
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
});

(() => {
  const KEY = "smokeshack-order";
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch { cart = []; }

  const drawer = $("#drawer"), lines = $("[data-lines]"), empty = $("[data-empty]");
  const feeRow = $("[data-fee]");
  $("[data-fee-amt]").textContent = "R" + SITE.deliveryFee;
  const totalEl = $("[data-total]"), send = $("[data-send]"), form = $("[data-form]"), toast = $("[data-toast]");
  const rand = n => "R" + n.toLocaleString("en-ZA");
  let toastT;

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch {} };
  const count = () => cart.reduce((n, i) => n + i.q, 0);
  const subtotal = () => cart.reduce((n, i) => n + i.q * i.p, 0);
  const delivering = () => form.elements.mode.value === "deliver";
  const fee = () => (delivering() && cart.length ? SITE.deliveryFee : 0);
  const total = () => subtotal() + fee();

  const render = () => {
    const n = count();
    $$("[data-cart-count]").forEach(b => {
      if (b.textContent !== String(n)) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); }
      b.textContent = n;
    });
    empty.hidden = n > 0;
    form.classList.toggle("is-hidden", n === 0);
    send.disabled = n === 0;
    totalEl.textContent = rand(total());
    feeRow.hidden = !fee();
    lines.innerHTML = cart.map((i, k) => `
      <li class="line">
        <span class="line__name">${i.n}</span>
        <b class="line__sum">${rand(i.q * i.p)}</b>
        <span class="qty"><button type="button" data-dec="${k}" aria-label="One less">−</button><b>${i.q}</b><button type="button" data-inc="${k}" aria-label="One more">+</button></span>
        <button class="line__rm" type="button" data-rm="${k}">Remove</button>
      </li>`).join("");
  };

  const say = (html) => {
    toast.innerHTML = html;
    toast.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("show"), 1800);
  };

  const add = (n, p) => {
    const f = cart.find(i => i.n === n);
    f ? f.q++ : cart.push({ n, p, q: 1 });
    save(); render();
    say(`Added <b>${n}</b>`);
    track("add_to_order", { item: n, price: p });
  };

  const open = () => { track("open_order", { items: count(), total: total() }); drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; setTimeout(() => $(".drawer__x").focus(), 50); };
  const close = () => { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; };

  document.addEventListener("click", e => {
    const a = e.target.closest("[data-add]");
    if (a) {
      add(a.dataset.add, +a.dataset.price);
      a.classList.add("added");
      setTimeout(() => a.classList.remove("added"), 600);
      return;
    }
    if (e.target.closest("[data-open-cart]")) return open();
    if (e.target.closest("[data-close-cart]")) return close();
    const inc = e.target.closest("[data-inc]"), dec = e.target.closest("[data-dec]"), rm = e.target.closest("[data-rm]");
    if (inc) cart[+inc.dataset.inc].q++;
    else if (dec) { const k = +dec.dataset.dec; if (--cart[k].q < 1) cart.splice(k, 1); }
    else if (rm) cart.splice(+rm.dataset.rm, 1);
    else return;
    save(); render();
  });

  addEventListener("keydown", e => { if (e.key === "Escape" && drawer.classList.contains("open")) close(); });

  send.addEventListener("click", () => {
    if (!form.reportValidity()) return;
    const d = new FormData(form);
    const msg = [
      "Howdy Smoke Shack! New order:",
      "",
      ...cart.map(i => `${i.q} x ${i.n} (${rand(i.p * i.q)})`),
      "",
      ...(fee() ? [`Delivery fee: ${rand(fee())}`] : []),
      `Total: ${rand(total())}`,
      `Name: ${d.get("name")}`,
      ...(d.get("mode") === "deliver"
        ? ["DELIVERY", `Address: ${d.get("address").trim()}${d.get("suburb") ? ", " + d.get("suburb") : ""}, Rustenburg`, `Delivery time: ${d.get("time") || "ASAP"}`]
        : ["COLLECTION", `Collection time: ${d.get("time") || "ASAP"}`]),
      d.get("notes") ? `Notes: ${d.get("notes")}` : ""
    ].filter((l, i, a) => l !== "" || a[i - 1] !== "").join("\n").trim();
    track("order_sent", { mode: d.get("mode"), items: count(), total: total() });
    window.open(`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  });

  const deliver = $("[data-deliver]"), timeLabel = $("[data-time-label]");
  const syncMode = () => {
    const d = form.elements.mode.value === "deliver";
    deliver.hidden = !d;
    form.elements.address.required = d;
    timeLabel.textContent = d ? "Delivery time" : "Collection time";
  };
  form.addEventListener("change", e => { if (e.target.name === "mode") { syncMode(); render(); } });
  syncMode();

  render();
})();
