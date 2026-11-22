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

  /* ---------- 1. Interactive 3D WebGL Hero Mark (B A I) ---------- */
  const heroCanvas = $("#hero-3d");
  if (heroCanvas && window.THREE) {
    const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1.5, 0.1, 50);
    camera.position.set(0, 0.1, 6.2);

    const resizeHero = () => {
      const w = heroCanvas.clientWidth || 600;
      const h = heroCanvas.clientHeight || 390;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resizeHero();
    window.addEventListener("resize", resizeHero);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 1.4));
    const k1 = new THREE.DirectionalLight(0xffffff, 2.0); k1.position.set(4, 5, 5); scene.add(k1);
    const k2 = new THREE.DirectionalLight(0x5ac8fa, 1.4); k2.position.set(-4, -2, 3); scene.add(k2);
    const k3 = new THREE.DirectionalLight(0xff4fd8, 1.2); k3.position.set(2, -4, 4); scene.add(k3);

    const group = new THREE.Group();
    scene.add(group);

    // Pixel rainbow texture for "B"
    const pxTex = (() => {
      const c = document.createElement("canvas");
      c.width = 256; c.height = 256;
      const g = c.getContext("2d");
      const cols = ["#FFE169", "#A8E063", "#5AC8FA", "#7A5BFF", "#FF4FD8", "#FF9500", "#0A84FF"];
      for (let y = 0; y < 256; y += 32) {
        for (let x = 0; x < 256; x += 32) {
          g.fillStyle = cols[((x / 32 + y / 32) % cols.length) | 0];
          g.fillRect(x + 1, y + 1, 30, 30);
        }
      }
      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
      return tex;
    })();

    const bMat = new THREE.MeshPhysicalMaterial({ map: pxTex, roughness: 0.2, metalness: 0.15, clearcoat: 0.9 });
    const aMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.15, metalness: 0.08, clearcoat: 0.9 });
    const iMat = new THREE.MeshStandardMaterial({ color: 0xe6ebf5, metalness: 0.92, roughness: 0.14 });

    // Extruded 3D "B"
    const bShape = new THREE.Shape();
    bShape.moveTo(-0.7, -0.75); bShape.lineTo(0.25, -0.75);
    bShape.quadraticCurveTo(0.75, -0.75, 0.75, -0.32);
    bShape.quadraticCurveTo(0.75, 0, 0.45, 0.05);
    bShape.quadraticCurveTo(0.7, 0.12, 0.7, 0.44);
    bShape.quadraticCurveTo(0.7, 0.78, 0.2, 0.78);
    bShape.lineTo(-0.7, 0.78); bShape.closePath();
    const bMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(bShape, { depth: 0.36, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 4 }), bMat);
    bMesh.geometry.center();
    bMesh.position.set(-1.1, 0.68, 0);
    group.add(bMesh);

    // Extruded 3D "A" with electric-blue wireframe edge
    const aShape = new THREE.Shape();
    aShape.moveTo(-0.78, -0.75); aShape.lineTo(-0.22, 0.78); aShape.lineTo(0.22, 0.78);
    aShape.lineTo(0.78, -0.75); aShape.lineTo(0.32, -0.75); aShape.lineTo(0.2, -0.35);
    aShape.lineTo(-0.2, -0.35); aShape.lineTo(-0.32, -0.75); aShape.closePath();
    const aHole = new THREE.Path();
    aHole.moveTo(-0.14, -0.08); aHole.lineTo(0, 0.38); aHole.lineTo(0.14, -0.08); aHole.closePath();
    aShape.holes.push(aHole);
    const aGeo = new THREE.ExtrudeGeometry(aShape, { depth: 0.36, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 4 });
    aGeo.center();
    const aMesh = new THREE.Mesh(aGeo, aMat);
    aMesh.position.set(1.1, 0.68, 0);
    const aWire = new THREE.LineSegments(new THREE.EdgesGeometry(aGeo, 28), new THREE.LineBasicMaterial({ color: 0x0a84ff }));
    aMesh.add(aWire);
    group.add(aMesh);

    // Liquid Chrome 3D "I" slab
    const iShape = new THREE.Shape();
    iShape.moveTo(-1.85, -0.42); iShape.lineTo(1.85, -0.42); iShape.lineTo(1.85, -0.14);
    iShape.lineTo(0.42, -0.14); iShape.lineTo(0.42, 0.14); iShape.lineTo(1.85, 0.14);
    iShape.lineTo(1.85, 0.42); iShape.lineTo(-1.85, 0.42); iShape.lineTo(-1.85, 0.14);
    iShape.lineTo(-0.42, 0.14); iShape.lineTo(-0.42, -0.14); iShape.lineTo(-1.85, -0.14); iShape.closePath();
    const iGeo = new THREE.ExtrudeGeometry(iShape, { depth: 0.45, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 5 });
    iGeo.center();
    const iMesh = new THREE.Mesh(iGeo, iMat);
    iMesh.position.set(0, -0.78, 0.1);
    group.add(iMesh);

    let tRY = -0.16, tRX = 0.08, cRY = -0.16, cRX = 0.08, drag = false, lx = 0, ly = 0;
    heroCanvas.addEventListener("pointerdown", (e) => { drag = true; lx = e.clientX; ly = e.clientY; heroCanvas.setPointerCapture(e.pointerId); });
    heroCanvas.addEventListener("pointermove", (e) => {
      if (drag) {
        tRY += (e.clientX - lx) * 0.012;
        tRX = Math.max(-0.5, Math.min(0.5, tRX + (e.clientY - ly) * 0.01));
        lx = e.clientX; ly = e.clientY;
      } else {
        const r = heroCanvas.getBoundingClientRect();
        tRY = (((e.clientX - r.left) / r.width) - 0.5) * 0.45;
        tRX = (((e.clientY - r.top) / r.height) - 0.5) * 0.25;
      }
    });
    heroCanvas.addEventListener("pointerup", () => { drag = false; });

    let ht = 0;
    const renderHero = () => {
      ht += 0.018;
      cRY += (tRY - cRY) * 0.09;
      cRX += (tRX - cRX) * 0.09;
      group.rotation.y = cRY + Math.sin(ht * 0.6) * 0.05;
      group.rotation.x = cRX + Math.cos(ht * 0.5) * 0.03;
      bMesh.position.y = 0.68 + Math.sin(ht) * 0.06;
      aMesh.position.y = 0.68 + Math.cos(ht * 0.9) * 0.06;
      iMesh.position.y = -0.78 + Math.sin(ht * 0.8 + 1) * 0.05;
      renderer.render(scene, camera);
      if (!reduceMotion) requestAnimationFrame(renderHero);
    };
    renderHero();
  }

  /* ---------- 2. Interactive Story Bounding Box + Wow Word ---------- */
  const fBox = $("#frame-box");
  const fHandle = $("#frame-resize");
  const fDims = $("#frame-dims");
  if (fBox && fHandle && fDims) {
    let resizing = false, sx = 0, sy = 0, padX = 12, padY = 4;
    fHandle.addEventListener("pointerdown", (e) => {
      e.stopPropagation();
      resizing = true; sx = e.clientX; sy = e.clientY;
      fBox.classList.add("is-resizing");
      fHandle.setPointerCapture(e.pointerId);
    });
    fHandle.addEventListener("pointermove", (e) => {
      if (!resizing) return;
      padX = Math.max(8, Math.min(72, 12 + (e.clientX - sx) * 0.5));
      padY = Math.max(2, Math.min(28, 4 + (e.clientY - sy) * 0.35));
      fBox.style.padding = `0 ${padX.toFixed(0)}px ${padY.toFixed(0)}px 12px`;
      const r = fBox.getBoundingClientRect();
      fDims.textContent = `${Math.round(r.width)} × ${Math.round(r.height)}`;
    });
    fHandle.addEventListener("pointerup", () => { resizing = false; fBox.classList.remove("is-resizing"); });
  }
  const wowWord = $("#wow-word");
  if (wowWord) {
    const grads = [
      "linear-gradient(90deg, #5AC8FA, #007AFF, #5856D6, #FF2D55, #FF9500, #FFCC00, #4CD964)",
      "linear-gradient(90deg, #FF4FD8, #7A5BFF, #2FB6FF, #FFB84F)",
      "linear-gradient(90deg, #FFFFFF, #8E8E93, #FFFFFF)",
    ];
    let gi = 0;
    wowWord.addEventListener("click", () => {
      gi = (gi + 1) % grads.length;
      wowWord.style.backgroundImage = grads[gi];
    });
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

  /* ---------- 3. macOS Segmented Tabs + 3D Tilt + Interactive Controls ---------- */
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
  $$(".mac-win").forEach((win) => {
    if (!reduceMotion) {
      win.addEventListener("pointermove", (e) => {
        const r = win.getBoundingClientRect();
        const rx = (((e.clientY - r.top) / r.height) - 0.5) * -4.5;
        const ry = (((e.clientX - r.left) / r.width) - 0.5) * 4.5;
        win.style.transform = `perspective(1400px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      });
      win.addEventListener("pointerleave", () => (win.style.transform = ""));
    }
    const yellow = win.querySelector(".traffic i:nth-child(2)");
    const green = win.querySelector(".traffic i:nth-child(3)");
    if (yellow) yellow.addEventListener("click", () => win.classList.toggle("is-min"));
    if (green) green.addEventListener("click", () => win.classList.remove("is-min"));
  });
  $$(".spec-checks li").forEach((li) => {
    li.addEventListener("click", () => {
      const checked = li.classList.toggle("is-checked");
      li.classList.toggle("dim", !checked);
      li.textContent = (checked ? "✓ " : "○ ") + li.textContent.slice(2);
    });
  });
  $$(".bp-svg rect").forEach((rect) => {
    rect.addEventListener("click", () => {
      const on = rect.getAttribute("stroke") === "#0A84FF";
      rect.setAttribute("stroke", on ? "#d1d1d6" : "#0A84FF");
      rect.setAttribute("fill", on ? "#fff" : "rgba(10,132,255,.08)");
    });
  });

  const rwBubble = $("#rw-bubble");
  if (rwBubble && !reduceMotion) {
    rwBubble.addEventListener("pointermove", (e) => {
      const r = rwBubble.getBoundingClientRect();
      const rx = (((e.clientY - r.top) / r.height) - 0.5) * -6;
      const ry = (((e.clientX - r.left) / r.width) - 0.5) * 6;
      rwBubble.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    });
    rwBubble.addEventListener("pointerleave", () => (rwBubble.style.transform = ""));
  }

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

    const shakeBtn = $("#pile-shake");
    if (shakeBtn) {
      shakeBtn.addEventListener("click", () => {
        bodies.forEach((b) => {
          b.vy = -(7 + Math.random() * 6);
          b.vx = (Math.random() - 0.5) * 14;
          b.rot = (Math.random() - 0.5) * 28;
        });
      });
    }

    const step = () => {
      const pw = pile.clientWidth;
      const ph = pile.clientHeight;
      bodies.forEach((b) => {
        if (!b.drag) {
          b.vy += 0.38;
          b.x += b.vx; b.y += b.vy;
          b.vx *= 0.985;
          b.vy *= 0.99;
        }
      });
      // Multi-pass separation + wall clamping so pills spread naturally and never clip
      for (let pass = 0; pass < 3; pass++) {
        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < bodies.length; j++) {
            const a = bodies[i], b = bodies[j];
            const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) + 8;
            const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) + 8;
            if (ox > 0 && oy > 0) {
              if (ox < oy) {
                const s = (a.x + a.w * 0.5) < (b.x + b.w * 0.5) ? -ox * 0.5 : ox * 0.5;
                if (!a.drag) { a.x += s; a.vx += s * 0.12; }
                if (!b.drag) { b.x -= s; b.vx -= s * 0.12; }
              } else {
                const s = (a.y + a.h * 0.5) < (b.y + b.h * 0.5) ? -oy * 0.5 : oy * 0.5;
                if (!a.drag) a.y += s;
                if (!b.drag) b.y -= s;
                // nudge horizontally so stacked pills slide off each other
                const dir = (a.x + a.w * 0.5) < (b.x + b.w * 0.5) ? -1 : 1;
                if (!a.drag) a.vx += dir * 0.25;
                if (!b.drag) b.vx -= dir * 0.25;
              }
            }
          }
        }
        bodies.forEach((b) => {
          if (b.x < 12) { b.x = 12; b.vx = Math.abs(b.vx) * 0.55; }
          if (b.x > pw - b.w - 12) { b.x = pw - b.w - 12; b.vx = -Math.abs(b.vx) * 0.55; }
          if (b.y > ph - b.h - 12) { b.y = ph - b.h - 12; b.vy = -Math.abs(b.vy) * 0.35; b.vx *= 0.92; }
          if (b.y < 12) { b.y = 12; b.vy = Math.abs(b.vy) * 0.4; }
        });
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

  /* ---------- 7. Interactive 3D WebGL Rainbow Rings + Swappable Looks ---------- */
  const rg = $("#rg");
  const rgc = $("#rg-canvas");
  if (rg && rgc && window.THREE) {
    const rRenderer = new THREE.WebGLRenderer({ canvas: rgc, antialias: true, alpha: true });
    rRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const rScene = new THREE.Scene();
    const rCam = new THREE.PerspectiveCamera(45, 1.8, 0.1, 100);
    rCam.position.set(0, 0, 9);

    const resizeRg = () => {
      const w = rg.clientWidth || 1200, h = rg.clientHeight || 700;
      rRenderer.setSize(w, h, false);
      rCam.aspect = w / h;
      rCam.updateProjectionMatrix();
    };
    resizeRg();
    window.addEventListener("resize", resizeRg);

    const rGroup = new THREE.Group();
    rScene.add(rGroup);
    const cols = [0x5ac8fa, 0x0a84ff, 0x5856d6, 0xff2d55, 0xff9500, 0xffcc00, 0x30d158];
    const rings = cols.map((c, i) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(2.2 + i * 0.72, 0.025, 12, 72),
        new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.38 })
      );
      m.rotation.x = i * 0.25;
      m.rotation.y = i * 0.18;
      rGroup.add(m);
      return m;
    });

    let mx = 0, my = 0;
    rg.addEventListener("pointermove", (e) => {
      const r = rg.getBoundingClientRect();
      mx = (((e.clientX - r.left) / r.width) - 0.5) * 0.6;
      my = (((e.clientY - r.top) / r.height) - 0.5) * 0.6;
    });

    const drawRg = () => {
      rings.forEach((m, i) => {
        m.rotation.x += 0.003 + i * 0.0005;
        m.rotation.y += 0.004 - i * 0.0004;
      });
      rGroup.rotation.y += (mx - rGroup.rotation.y) * 0.06;
      rGroup.rotation.x += (my - rGroup.rotation.x) * 0.06;
      rRenderer.render(rScene, rCam);
      if (!reduceMotion) requestAnimationFrame(drawRg);
    };
    drawRg();
  }

  /* ---------- 9. Spinnable Footer Seal ---------- */
  const seal = $("#ft-seal");
  if (seal) {
    let ang = 0, vel = 0.25;
    seal.addEventListener("click", () => { vel += 14; });
    const spinSeal = () => {
      ang = (ang + vel) % 360;
      vel = Math.max(0.25, vel * 0.96);
      seal.style.transform = `rotate(${ang.toFixed(1)}deg)`;
      if (!reduceMotion) requestAnimationFrame(spinSeal);
    };
    spinSeal();
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
