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

  /* ---------- Interactive 3D WebGL Mailbox (Three.js) ---------- */
  const mbCanvas = $("#mailbox-3d");
  let triggerMailboxSend = () => {};
  if (mbCanvas && window.THREE) {
    const renderer = new THREE.WebGLRenderer({ canvas: mbCanvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
    camera.position.set(0, 0.2, 6.45);

    const resizeMb = () => {
      const w = mbCanvas.clientWidth || 420;
      const h = mbCanvas.clientHeight || 420;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resizeMb();
    window.addEventListener("resize", resizeMb);

    // Studio 3-point lighting
    scene.add(new THREE.HemisphereLight(0xffffff, 0xc9d2e3, 1.35));
    const key = new THREE.DirectionalLight(0xffffff, 1.7);
    key.position.set(3.5, 5, 4.5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xdbe8ff, 0.9);
    fill.position.set(-4, 2, 3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 0.8);
    rim.position.set(0, 3, -5);
    scene.add(rim);

    const root = new THREE.Group();
    root.position.y = -0.25;
    scene.add(root);

    // Helper: arch shape
    const makeArch = (w, h) => {
      const s = new THREE.Shape();
      const hw = w / 2;
      const r = hw;
      const baseH = h - r;
      s.moveTo(-hw, 0);
      s.lineTo(hw, 0);
      s.lineTo(hw, baseH);
      s.absarc(0, baseH, r, 0, Math.PI, false);
      s.lineTo(-hw, 0);
      return s;
    };

    // Procedural diamond quilt bump map for the front door
    const quiltTex = (() => {
      const c = document.createElement("canvas");
      c.width = 128; c.height = 128;
      const g = c.getContext("2d");
      g.fillStyle = "#808080";
      g.fillRect(0, 0, 128, 128);
      for (let y = 0; y < 128; y += 16) {
        for (let x = 0; x < 128; x += 16) {
          const gr = g.createRadialGradient(x + 8, y + 8, 1, x + 8, y + 8, 9);
          gr.addColorStop(0, "#ffffff");
          gr.addColorStop(1, "#505050");
          g.fillStyle = gr;
          g.beginPath();
          g.moveTo(x + 8, y); g.lineTo(x + 16, y + 8); g.lineTo(x + 8, y + 16); g.lineTo(x, y + 8);
          g.closePath();
          g.fill();
        }
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(4, 4);
      return tex;
    })();

    const whiteMat = new THREE.MeshPhysicalMaterial({ color: 0xf7f9fc, roughness: 0.16, metalness: 0.04, clearcoat: 0.9, clearcoatRoughness: 0.1 });
    const doorMat = new THREE.MeshPhysicalMaterial({ color: 0xf0f3f8, roughness: 0.24, metalness: 0.05, clearcoat: 0.7, bumpMap: quiltTex, bumpScale: 0.035 });
    const blueMat = new THREE.MeshPhysicalMaterial({ color: 0x1656ea, roughness: 0.2, metalness: 0.08, clearcoat: 0.95, clearcoatRoughness: 0.08 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd8dee8, metalness: 0.85, roughness: 0.2 });
    const redMat = new THREE.MeshPhysicalMaterial({ color: 0xff282e, roughness: 0.22, metalness: 0.05, clearcoat: 0.85 });

    // Main barrel body
    const bodyGeo = new THREE.ExtrudeGeometry(makeArch(1.56, 1.48), { depth: 2.2, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 6, curveSegments: 28 });
    bodyGeo.center();
    const body = new THREE.Mesh(bodyGeo, whiteMat);
    body.position.set(0, 0.72, 0);
    root.add(body);

    // Quilted front door
    const doorGeo = new THREE.ExtrudeGeometry(makeArch(1.34, 1.28), { depth: 0.08, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 4, curveSegments: 24 });
    doorGeo.center();
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 0.7, 1.18);
    root.add(door);

    // Dark mail slot + 2 embossed pill bars
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.11, 0.08), new THREE.MeshStandardMaterial({ color: 0x15161a, roughness: 0.5 }));
    slot.position.set(0, 0.78, 1.24);
    root.add(slot);
    [-0.18, -0.34].forEach((dy) => {
      const bar = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.72, 6, 12), whiteMat);
      bar.rotation.z = Math.PI / 2;
      bar.position.set(0, 0.7 + dy, 1.25);
      root.add(bar);
    });

    // Wrap-around cobalt blue base rim
    const rimGeo = new THREE.BoxGeometry(1.78, 0.26, 2.42);
    const blueBase = new THREE.Mesh(rimGeo, blueMat);
    blueBase.position.set(0, -0.02, 0);
    root.add(blueBase);

    // Chrome post & round pedestal base
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.22, 28), chromeMat);
    post.position.set(0, -0.74, 0);
    root.add(post);
    const pedTop = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.62, 0.1, 36), chromeMat);
    pedTop.position.set(0, -1.36, 0);
    root.add(pedTop);
    const pedRing = new THREE.Mesh(new THREE.TorusGeometry(0.59, 0.045, 14, 36), chromeMat);
    pedRing.rotation.x = Math.PI / 2;
    pedRing.position.set(0, -1.36, 0);
    root.add(pedRing);

    // Side iridescent Build AI sticker
    const stickerTex = (() => {
      const c = document.createElement("canvas");
      c.width = 256; c.height = 192;
      const g = c.getContext("2d");
      g.fillStyle = "rgba(255,255,255,0)";
      g.fillRect(0, 0, 256, 192);
      const gr = g.createLinearGradient(20, 20, 236, 172);
      gr.addColorStop(0, "#0894ff"); gr.addColorStop(0.4, "#c959dd"); gr.addColorStop(0.75, "#ff2e54"); gr.addColorStop(1, "#ff9500");
      g.fillStyle = gr;
      g.beginPath(); g.roundRect(18, 28, 220, 136, 36); g.fill();
      g.strokeStyle = "#ffffff"; g.lineWidth = 10; g.stroke();
      g.fillStyle = "#ffffff"; g.font = "800 44px Inter, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText("BUILD AI", 128, 98);
      return new THREE.CanvasTexture(c);
    })();
    const sticker = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.82), new THREE.MeshBasicMaterial({ map: stickerTex, transparent: true }));
    sticker.rotation.y = Math.PI / 2;
    sticker.position.set(0.87, 0.56, -0.35);
    root.add(sticker);

    // Red flag + machined chrome pivot bolt
    const flagPivot = new THREE.Group();
    flagPivot.position.set(0.9, 0.52, 0.42);
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.1, 24), chromeMat);
    bolt.rotation.z = Math.PI / 2;
    flagPivot.add(bolt);
    const flagArm = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.96, 0.11), redMat);
    flagArm.position.set(0.06, 0.46, 0);
    flagPivot.add(flagArm);
    const flagTab = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.28, 0.34), redMat);
    flagTab.position.set(0.06, 0.8, 0.16);
    flagPivot.add(flagTab);
    root.add(flagPivot);

    // Soft contact shadow on floor
    const shCanvas = document.createElement("canvas");
    shCanvas.width = 128; shCanvas.height = 128;
    const sg = shCanvas.getContext("2d");
    const sgr = sg.createRadialGradient(64, 64, 6, 64, 64, 62);
    sgr.addColorStop(0, "rgba(0,0,0,0.2)"); sgr.addColorStop(1, "rgba(0,0,0,0)");
    sg.fillStyle = sgr; sg.fillRect(0, 0, 128, 128);
    const shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.6), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shCanvas), transparent: true }));
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.42;
    root.add(shadowPlane);

    // Drag-to-orbit + flag animation
    let targetRY = -0.62, targetRX = 0.12, curRY = -0.62, curRX = 0.12;
    let dragging = false, lx = 0, ly = 0, flagTarget = 0.12, flagCur = 0.12;

    mbCanvas.addEventListener("pointerdown", (e) => { dragging = true; lx = e.clientX; ly = e.clientY; mbCanvas.setPointerCapture(e.pointerId); });
    mbCanvas.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      targetRY += (e.clientX - lx) * 0.01;
      targetRX = Math.max(-0.35, Math.min(0.45, targetRX + (e.clientY - ly) * 0.008));
      lx = e.clientX; ly = e.clientY;
    });
    mbCanvas.addEventListener("pointerup", () => { dragging = false; });

    triggerMailboxSend = () => {
      flagTarget = -0.55;
      targetRY += 0.35;
      setTimeout(() => { flagTarget = 0.12; }, 3800);
    };

    let t = 0;
    const renderMb = () => {
      t += 0.02;
      if (!dragging) targetRY += Math.sin(t * 0.4) * 0.0008;
      curRY += (targetRY - curRY) * 0.1;
      curRX += (targetRX - curRX) * 0.1;
      flagCur += (flagTarget - flagCur) * 0.12;
      root.rotation.y = curRY;
      root.rotation.x = curRX;
      root.position.y = 0.08 + Math.sin(t) * 0.04;
      flagPivot.rotation.x = flagCur;
      renderer.render(scene, camera);
      if (!reduceMotion) requestAnimationFrame(renderMb);
    };
    renderMb();
  }

  /* ---------- Brief Form + Animated 3D Mailbox ---------- */
  const bForm = $("#brief-form");
  const bMsg = $("#bf-msg");
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
    triggerMailboxSend();
    bMsg.className = "bf-msg ok";
    bMsg.textContent = "✓ Mission brief folded and sent. Flag is up!";
    bForm.reset();
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
