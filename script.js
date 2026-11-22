/* Build AI — Wowww Studio Interactive Engine */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Global cursor dot + floating visit pill ---------- */
  const dot = $("#cursor-dot");
  const vpill = $("#visit-pill");
  if (dot && vpill && !reduceMotion) {
    let overCard = false;
    window.addEventListener("pointermove", (e) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      dot.classList.toggle("on", !overCard);
      if (overCard) {
        vpill.style.left = `${e.clientX}px`;
        vpill.style.top = `${e.clientY}px`;
      }
    });
    $$("[data-visit]").forEach((card) => {
      card.addEventListener("pointerenter", () => {
        overCard = true;
        vpill.textContent = card.dataset.visit;
        vpill.classList.add("on");
        dot.classList.remove("on");
      });
      card.addEventListener("pointerleave", () => {
        overCard = false;
        vpill.classList.remove("on");
      });
    });
  }

  /* ---------- Dynamic Island Notch + Live Clock ---------- */
  const notch = $("#notch");
  const nToggle = $("#notch-toggle");
  const setClock = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const t = `${hh}:${mm}`;
    $("#nt-time").textContent = t;
    $("#ft-time").textContent = `San Francisco · ${t}`;
  };
  setClock();
  setInterval(setClock, 15000);

  nToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = notch.classList.toggle("open");
    nToggle.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (e) => {
    if (!notch.contains(e.target)) {
      notch.classList.remove("open");
      nToggle.setAttribute("aria-expanded", "false");
    }
  });
  $$("#notch a").forEach((a) => a.addEventListener("click", () => {
    notch.classList.remove("open");
    nToggle.setAttribute("aria-expanded", "false");
  }));

  $("#copy-cli-btn").addEventListener("click", async () => {
    const cmd = "curl -fsSL https://get.buildai.dev/cli | sh";
    try { await navigator.clipboard.writeText(cmd); } catch {}
    const lbl = $("#copy-cli-lbl");
    lbl.textContent = "Copied CLI ✓";
    setTimeout(() => (lbl.textContent = "Copy CLI"), 1800);
  });

  /* ---------- Hero 3D Parallax Mark ---------- */
  const hero = $("#hero");
  const hMark = $("#hero-mark");
  if (hero && hMark && !reduceMotion) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const rx = (((e.clientY - r.top) / r.height) - 0.5) * -10;
      const ry = (((e.clientX - r.left) / r.width) - 0.5) * 12;
      hMark.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    });
    hero.addEventListener("pointerleave", () => (hMark.style.transform = ""));
  }

  /* ---------- Quadtree Iridescent Mosaic Wipe (#000 -> #fff) ---------- */
  const wipe = $("#mosaic-wipe");
  if (wipe) {
    const palette = ["#000000", "#0A84FF", "#5856D6", "#FF2D55", "#FF9500", "#FFCC00", "#5AC8FA", "#FFFFFF"];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 16; col++) {
        const cell = document.createElement("i");
        const p = row === 0 ? (Math.random() < 0.65 ? "#000000" : palette[(Math.random() * 6 + 1) | 0])
          : row === 1 ? palette[(Math.random() * palette.length) | 0]
          : (Math.random() < 0.65 ? "#FFFFFF" : palette[(Math.random() * 6 + 1) | 0]);
        cell.style.background = p;
        wipe.appendChild(cell);
      }
    }
  }

  /* ---------- macOS Segmented Tabs ---------- */
  $$("[data-tabs]").forEach((bar) => {
    const group = bar.dataset.tabs;
    const panels = $$(`[data-panels="${group}"] .mac-panel`);
    const btns = $$(".seg", bar);
    btns.forEach((b) => {
      b.addEventListener("click", () => {
        const idx = Number(b.dataset.tab);
        btns.forEach((x, i) => x.classList.toggle("is-active", i === idx));
        panels.forEach((p, i) => p.classList.toggle("is-active", i === idx));
      });
    });
  });

  /* ---------- Client Reviews Wheel ---------- */
  const reviews = [
    { q: "“Our claims engine is 9 million lines of COBOL. With Build AI, every rule is now in English and traced to its source. 11 weeks instead of 4 years.”", c: "Priya Sundaram — CIO, Meridian Health" },
    { q: "“My team sets intent at 6pm. The agents finish the work overnight, and by morning there's a reviewed PR with evidence attached.”", c: "Daniel Kowalski — VP Engineering, Orbital" },
    { q: "“The audit trail sold our regulators. They can follow any production change back to the requirement and the person who approved it.”", c: "Amara Okafor — Chief Risk Officer, Quanta Bank" },
    { q: "“We swapped model providers in an afternoon. Nothing else in our stack had to change.”", c: "Lena Hoffmann — Head of Platform, Kestrel" },
    { q: "“We gave Build AI our ERP and it gave our agents an MCP layer. Six weeks, zero migration.”", c: "Rafael Torres — CTO, Alder & Co" },
  ];
  const avs = $$(".rw-av");
  const showReview = (i) => {
    avs.forEach((a, k) => a.classList.toggle("is-active", k === i));
    $("#rw-quote").textContent = reviews[i].q;
    $("#rw-cite").textContent = reviews[i].c;
  };
  avs.forEach((a) => {
    const i = Number(a.dataset.i);
    a.addEventListener("mouseenter", () => showReview(i));
    a.addEventListener("click", () => showReview(i));
  });

  /* ---------- Interactive Physics Toybox (.sv-pile) ---------- */
  const pile = $("#sv-pile");
  if (pile) {
    const items = [
      { t: "REQ-1042", bg: "#0A84FF" }, { t: "BP-07", bg: "#5856D6" },
      { t: "PR #4821", bg: "#1D1D1F" }, { t: "SLSA L3", bg: "#30D158" },
      { t: "MCP · 9", bg: "#FF6B2C" }, { t: "COBOL → Rules", bg: "#FF2D55" },
      { t: "Claude", bg: "#D97757" }, { t: "Gemini", bg: "#1B78FC" },
      { t: "GPT", bg: "#1D1D1F" }, { t: "Shadow-Diff", bg: "#AF52DE" },
      { t: "VPC Ready", bg: "#007AFF" }, { t: "SOC 2", bg: "#34C759" },
    ];
    const bodies = items.map((it, i) => {
      const el = document.createElement("div");
      el.className = "sv-piece";
      el.textContent = it.t;
      el.style.background = it.bg;
      pile.appendChild(el);
      const w = el.offsetWidth || 100;
      const h = el.offsetHeight || 40;
      return {
        el, w, h,
        x: 40 + (i % 6) * 145 + Math.random() * 30,
        y: 30 + Math.floor(i / 6) * 70,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 2,
        rot: (Math.random() - 0.5) * 14,
        drag: false,
      };
    });

    let active = null, ox = 0, oy = 0, lx = 0, ly = 0;
    bodies.forEach((b) => {
      b.el.addEventListener("pointerdown", (e) => {
        active = b; b.drag = true;
        b.el.setPointerCapture(e.pointerId);
        const r = pile.getBoundingClientRect();
        ox = e.clientX - r.left - b.x;
        oy = e.clientY - r.top - b.y;
        lx = e.clientX; ly = e.clientY;
      });
      b.el.addEventListener("pointermove", (e) => {
        if (active !== b) return;
        const r = pile.getBoundingClientRect();
        b.vx = (e.clientX - lx) * 0.6;
        b.vy = (e.clientY - ly) * 0.6;
        lx = e.clientX; ly = e.clientY;
        b.x = Math.max(0, Math.min(r.width - b.w, e.clientX - r.left - ox));
        b.y = Math.max(0, Math.min(r.height - b.h, e.clientY - r.top - oy));
      });
      b.el.addEventListener("pointerup", () => { if (active === b) { b.drag = false; active = null; } });
    });

    const step = () => {
      const pw = pile.clientWidth;
      const ph = pile.clientHeight;
      bodies.forEach((b) => {
        if (!b.drag) {
          b.vy += 0.35;
          b.x += b.vx; b.y += b.vy;
          b.vx *= 0.99;
          if (b.x < 8) { b.x = 8; b.vx *= -0.6; }
          if (b.x > pw - b.w - 8) { b.x = pw - b.w - 8; b.vx *= -0.6; }
          if (b.y > ph - b.h - 10) { b.y = ph - b.h - 10; b.vy *= -0.45; b.vx *= 0.92; }
          if (b.y < 8) { b.y = 8; b.vy *= -0.5; }
        }
      });
      // Soft AABB separation so pills rest side-by-side without overlapping
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i], b = bodies[j];
          const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) + 6;
          const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) + 6;
          if (ox > 0 && oy > 0) {
            if (ox < oy) {
              const s = a.x < b.x ? -ox * 0.5 : ox * 0.5;
              if (!a.drag) a.x += s;
              if (!b.drag) b.x -= s;
            } else {
              const s = a.y < b.y ? -oy * 0.5 : oy * 0.5;
              if (!a.drag) a.y += s;
              if (!b.drag) b.y -= s;
            }
          }
        }
      }
      bodies.forEach((b) => {
        b.el.style.transform = `translate(${b.x.toFixed(1)}px, ${b.y.toFixed(1)}px) rotate(${b.rot.toFixed(1)}deg)`;
      });
      if (!reduceMotion) requestAnimationFrame(step);
    };
    step();
  }

  /* ---------- Brief Form + Animated Mailbox ---------- */
  const bForm = $("#brief-form");
  const bMsg = $("#bf-msg");
  const mbox = $("#mailbox");
  bForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    $$("input[required]", bForm).forEach((inp) => {
      const valid = inp.value.trim() && inp.checkValidity();
      inp.classList.toggle("invalid", !valid);
      if (!valid) ok = false;
    });
    if (!ok) {
      bMsg.className = "bf-msg err";
      bMsg.textContent = "Please fill in your name and a valid work email.";
      return;
    }
    mbox.classList.add("sent");
    bMsg.className = "bf-msg ok";
    bMsg.textContent = "✓ Mission brief folded and sent. Flag is up!";
    bForm.reset();
    setTimeout(() => mbox.classList.remove("sent"), 4000);
  });

  /* ---------- Rainbow Grid Canvas + Swappable 6 Looks ---------- */
  const rg = $("#rg");
  const rgc = $("#rg-canvas");
  if (rg && rgc) {
    const ctx = rgc.getContext("2d");
    let t = 0;
    const drawRg = () => {
      const w = rg.clientWidth, h = rg.clientHeight;
      if (rgc.width !== w || rgc.height !== h) { rgc.width = w; rgc.height = h; }
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2, cy = h / 2;
      const cols = ["#5AC8FA", "#0A84FF", "#5856D6", "#FF2D55", "#FF9500", "#FFCC00", "#30D158"];
      for (let i = 0; i < 9; i++) {
        const rad = ((i * 95 + t * 22) % 850) + 60;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.strokeStyle = cols[i % cols.length];
        ctx.globalAlpha = Math.max(0, 0.24 - rad / 3600);
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      t += 0.016;
      if (!reduceMotion) requestAnimationFrame(drawRg);
    };
    drawRg();
  }

  const rgWow = $("#rg-wow");
  const cycleLook = () => {
    const next = (Number(rgWow.dataset.look) % 6) + 1;
    rgWow.dataset.look = String(next);
  };
  rgWow.addEventListener("click", cycleLook);
  $("#cycle-look-btn").addEventListener("click", cycleLook);

  /* ---------- Footer Copy Email ---------- */
  $("#copy-email").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("hello@buildai.dev"); } catch {}
    const b = $("#copied-badge");
    b.classList.add("show");
    setTimeout(() => b.classList.remove("show"), 1800);
  });
})();
