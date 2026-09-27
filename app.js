const months = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];
const days = [
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
  "شنبه",
];
const fa = (n) => Number(n).toLocaleString("fa-IR");
const pad = (n) => String(n).padStart(2, "0");
function div(a, b) {
  return Math.floor(a / b);
}
function j2g(jy, jm, jd) {
  jy -= 979;
  jm--;
  jd--;
  let d = 365 * jy + div(jy, 33) * 8 + div((jy % 33) + 3, 4);
  for (let i = 0; i < jm; i++) d += i < 6 ? 31 : 30;
  d += jd;
  let g = d + 79,
    gy = 1600 + 400 * div(g, 146097);
  g %= 146097;
  let leap = true;
  if (g >= 36525) {
    g--;
    gy += 100 * div(g, 36524);
    g %= 36524;
    if (g >= 365) {
      g++;
    } else leap = false;
  }
  gy += 4 * div(g, 1461);
  g %= 1461;
  if (g >= 366) {
    leap = false;
    g--;
    gy += div(g, 365);
    g %= 365;
  }
  let gd = g + 1,
    gm,
    md = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  for (gm = 0; gm < 12 && gd > md[gm]; gm++) gd -= md[gm];
  return new Date(gy, gm, gd);
}
function g2j(gy, gm, gd) {
  let dm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
    gy2 = gy - 1600,
    jy = 979,
    d =
      365 * gy2 +
      div(gy2 + 3, 4) -
      div(gy2 + 99, 100) +
      div(gy2 + 399, 400) -
      80 +
      gd +
      dm[gm];
  if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)) d++;
  jy += 33 * div(d, 12053);
  d %= 12053;
  jy += 4 * div(d, 1461);
  d %= 1461;
  if (d > 365) {
    jy += div(d - 1, 365);
    d = (d - 1) % 365;
  }
  let jm = d < 186 ? 1 + div(d, 31) : 7 + div(d - 186, 30),
    jd = 1 + (d < 186 ? d % 31 : (d - 186) % 30);
  return [jy, jm, jd];
}
function jtext(date) {
  let [y, m, d] = g2j(date.getFullYear(), date.getMonth(), date.getDate());
  return `${fa(d)} ${months[m - 1]} ${fa(y)}`;
}
const events = [
  {
    id: "school",
    title: "شروع مدرسه",
    icon: "🎒",
    type: "school",
    m: 7,
    d: 1,
    desc: "شروع سال تحصیلی",
  },
  {
    id: "end",
    title: "پایان مدرسه",
    icon: "🏫",
    type: "school",
    m: 3,
    d: 31,
    desc: "پایان سال تحصیلی",
  },
  {
    id: "summer",
    title: "شروع تابستان",
    icon: "☀️",
    type: "season",
    m: 4,
    d: 1,
    desc: "اولین روز تابستان",
  },
  {
    id: "spring",
    title: "شروع بهار",
    icon: "🌱",
    type: "season",
    m: 1,
    d: 1,
    desc: "نوروز و آغاز بهار",
  },
  {
    id: "autumn",
    title: "شروع پاییز",
    icon: "🍂",
    type: "season",
    m: 7,
    d: 1,
    desc: "آغاز فصل پاییز",
  },
  {
    id: "winter",
    title: "شروع زمستان",
    icon: "❄️",
    type: "season",
    m: 10,
    d: 1,
    desc: "آغاز فصل زمستان",
  },
  {
    id: "newyear",
    title: "شروع سال میلادی",
    icon: "🎆",
    type: "calendar",
    g: true,
    d: 1,
    desc: "اول ژانویه",
  },
];
function target(e, now) {
  if (e.g) {
    let y = now.getFullYear(),
      t = new Date(y, 0, 1);
    return t <= now ? new Date(y + 1, 0, 1) : t;
  }
  let y = g2j(now.getFullYear(), now.getMonth(), now.getDate())[0],
    t = j2g(y, e.m, e.d);
  return t <= now ? j2g(y + 1, e.m, e.d) : t;
}
function prev(e, t) {
  if (e.g) return new Date(t.getFullYear() - 1, 0, 1);
  let y = g2j(t.getFullYear(), t.getMonth(), t.getDate())[0];
  return j2g(y - 1, e.m, e.d);
}
function duration(ms) {
  let s = Math.max(0, Math.floor(ms / 1000)),
    d = Math.floor(s / 86400);
  s %= 86400;
  let h = Math.floor(s / 3600);
  s %= 3600;
  let m = Math.floor(s / 60),
    sec = s % 60;
  if (d) return `${fa(d)} روز و ${fa(h)} ساعت`;
  if (h) return `${fa(h)} ساعت و ${fa(m)} دقیقه`;
  return `${fa(m)} دقیقه و ${fa(sec)} ثانیه`;
}
document.getElementById("cards").innerHTML = events
  .map(
    (e) => `<article class="card" data-type="${e.type}" data-id="${e.id}">
<div class="head"><div class="name"><div class="icon">${e.icon}</div><div><div class="title">${e.title}</div><div class="date" id="date-${e.id}"></div></div></div><span class="badge" id="badge-${e.id}">در حال شمارش</span></div>
<div class="status" id="status-${e.id}">${e.desc}</div><div class="remaining" id="remaining-${e.id}">—<small> باقی مانده</small></div>
<div class="tank"><div class="liquid" id="liquid-${e.id}"><div class="wave"></div><div class="wave wave2"></div></div><div class="percent3d" id="percent-${e.id}">۰٪</div></div></article>`,
  )
  .join("");
function update() {
  let now = new Date();
  document.getElementById("today").textContent =
    `${days[now.getDay()]} • ${jtext(now)} • ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  events.forEach((e) => {
    let t = target(e, now),
      p = prev(e, t),
      left = t - now,
      total = t - p,
      progress = Math.max(0, Math.min(100, (1 - left / total) * 100)),
      el = document.querySelector(`[data-id="${e.id}"]`),
      li = document.getElementById(`liquid-${e.id}`);
    document.getElementById(`date-${e.id}`).textContent = e.g
      ? t.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : jtext(t);
    document.getElementById(`remaining-${e.id}`).innerHTML =
      left <= 0
        ? "🎉<small> رویداد رسید!</small>"
        : `${duration(left)}<small> باقی مانده</small>`;
    document.getElementById(`percent-${e.id}`).textContent =
      `${fa(Math.round(progress))}٪`;
    li.style.height = `${progress}%`;
    let bg =
      progress < 55
        ? "linear-gradient(180deg,#22d3ee,#2563eb)"
        : progress < 80
          ? "linear-gradient(180deg,#c084fc,#7c3aed)"
          : progress < 95
            ? "linear-gradient(180deg,#fbbf24,#f97316)"
            : "linear-gradient(180deg,#fb7185,#e11d48)";
    if (left <= 0) {
      bg = "linear-gradient(180deg,#6ee7b7,#059669)";
      document.getElementById(`badge-${e.id}`).textContent = "شروع شد";
      document.getElementById(`status-${e.id}`).textContent =
        `${e.title} رسید!`;
      li.style.height = "100%";
    } else if (left <= 7 * 86400000) {
      document.getElementById(`badge-${e.id}`).textContent = "خیلی نزدیک";
      document.getElementById(`status-${e.id}`).textContent =
        `🔥 نزدیک ${e.title}`;
    } else
      document.getElementById(`badge-${e.id}`).textContent = "در حال شمارش";
    li.style.background = bg;
    el.classList.toggle("near", left <= 7 * 86400000);
    el.classList.toggle("done", left <= 0);
  });
}
update();
setInterval(update, 1000);
document.querySelectorAll(".filters button").forEach(
  (b) =>
    (b.onclick = () => {
      document
        .querySelectorAll(".filters button")
        .forEach((x) => x.classList.remove("active"));
      b.classList.add("active");
      let f = b.dataset.filter;
      document
        .querySelectorAll(".card")
        .forEach(
          (c) =>
            (c.style.display =
              f === "all" || c.dataset.type === f ? "block" : "none"),
        );
    }),
);
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("pointermove", (e) => {
    if (matchMedia("(max-width:720px)").matches) return;
    let r = card.getBoundingClientRect(),
      x = (e.clientX - r.left) / r.width - 0.5,
      y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 8}deg) translateZ(4px)`;
  });
  card.addEventListener("pointerleave", () => (card.style.transform = ""));
});
