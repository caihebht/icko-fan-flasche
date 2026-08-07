/* =========================================================
   Icko Fan-Flasche – Konfigurator-Logik
   ========================================================= */

(function () {
  "use strict";

  const bottleStage = document.getElementById("bottle-stage");
  const bottleBlend = document.getElementById("bottle-blend");
  const bottleBase = document.getElementById("bottle-base");
  const bottleTint = document.getElementById("bottle-tint");
  const logoOverlay = document.getElementById("logo-overlay");
  const logoCanvas = document.getElementById("logo-canvas");
  const swatchesEl = document.getElementById("swatches");
  const colorInput = document.getElementById("color-input");
  const pmsInput = document.getElementById("pms-input");
  const colorNameEl = document.getElementById("color-name");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("file-input");
  const logoControls = document.getElementById("logo-controls");
  const logoRemove = document.getElementById("logo-remove");
  const qtyBonus = document.getElementById("qty-bonus");
  const offerLink = document.getElementById("offer-link");

  const ASSET_VER = "v14"; // Bump bei Asset-/CSS-Änderungen gegen Browser-Cache
  const ASSET = (p) => `${p}?v=${ASSET_VER}`;

  const RENDER_MODES = {
    farbtreu: { label: "Farbtreu", hint: "Farbtreu: Farbe wird exakt dargestellt." },
    foto: { label: "Foto-Echt", hint: "Foto-Echt: echtes Fotolicht, Farben wirken gedämpfter." },
    klassisch: { label: "Klassisch", hint: "Klassisch: photorealistisches Produktfoto (Stand 02.08.)." },
  };

  const ASSETS = {
    "05": {
      farbtreu: ASSET("assets/flasche-05-base.png"),
      foto: ASSET("assets/flasche-05-foto.png"),
      klassisch: ASSET("assets/flasche-05-klassisch.png"),
      tint: ASSET("assets/flasche-05-tint.png"),
      klassischTint: ASSET("assets/flasche-05-klassisch-tint.png"),
    },
    "10": {
      farbtreu: ASSET("assets/flasche-10-base.png"),
      foto: ASSET("assets/flasche-10-foto.png"),
      klassisch: ASSET("assets/flasche-10-klassisch.png"),
      tint: ASSET("assets/flasche-10-tint.png"),
      klassischTint: ASSET("assets/flasche-10-klassisch-tint.png"),
    },
  };

  const DEFAULT_LOGO = ASSET("assets/logo-icko-rund-weiss.png");

  // Logo-Inhalt nimmt ca. 80 % der Breite des Flaschenkörpers ein.
  // Der Ring des runden ICKO-Logos ist nur ~84 % der PNG-Kantenlänge;
  // damit der sichtbare Kreis wirklich 80 % der Körperbreite misst, wird
  // das Element größer skaliert (Overlay = Inhalt / LOGO_RING_FRACTION).
  // Der gleiche Faktor gilt für eigene Logos, damit Overlay-Größe und
  // Wickel-Geometrie (Krümmung beim Drehen) identisch zum Standard-Logo sind.
  const LOGO_BODY_FRACTION = 0.80;
  const LOGO_RING_FRACTION = 0.843; // Inhalt-Breite relativ zur Overlay-Breite
  const LOGO_BODY_FALLBACK = 0.94;  // Körperbreite / Bildbreite (Fallback)
  // Zylinder-Krümmung des Logos: 1 = volle Krümmung (Ränder stark gestaucht),
  // kleiner = flacher. Im Ruhezustand ist die Krümmung reduziert, damit das
  // komplette Logo von vorn sichtbar ist (wie vor der Zylinder-Umstellung).
  // Beim Drehen oder Vergrößern steigt sie sanft auf den vollen Wert.
  const ZYLINDER_CURVE_MIN = 0.75;
  const ZYLINDER_CURVE_MAX = 1.0;

  const state = {
    size: "05",
    qty: "120",
    hex: "#DA291C",
    pantone: "PMS 485 C",
    renderMode: "farbtreu",
    logo: null,
    logoX: 0,
    logoY: 0,
    logoScale: 100,
    logoRotate: 0,
    logoAngle: 0,
    zylinderCurve: ZYLINDER_CURVE_MIN,
  };

  /* ---------- Swatches ---------- */
  PANTONE_SWATCHES.forEach((c) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "swatch";
    b.title = c.name + " · " + c.hex;
    b.style.background = c.hex;
    b.dataset.hex = c.hex;
    b.dataset.name = c.name;
    b.addEventListener("click", () => {
      setColor(c.hex, c.name);
      colorInput.value = c.hex;
      pmsInput.value = c.name.replace(/^PMS\s*/i, "");
    });
    swatchesEl.appendChild(b);
  });

  /* ---------- Größe ---------- */
  document.querySelectorAll("#size-group .btn-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      setSize(btn.dataset.size);
    });
  });

  function setSize(size) {
    state.size = size;
    document.querySelectorAll("#size-group .btn-toggle").forEach((b) =>
      b.classList.toggle("active", b.dataset.size === size)
    );
    applyRenderBase();
    setLogoWidth();
    updateSummary();
  }

  /* ---------- Darstellung (Farbtreu / Foto-Echt) ---------- */
  document.querySelectorAll("#render-group .btn-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      setRenderMode(btn.dataset.mode);
    });
  });

  function setRenderMode(mode) {
    state.renderMode = RENDER_MODES[mode] ? mode : "farbtreu";
    document.querySelectorAll("#render-group .btn-toggle").forEach((b) =>
      b.classList.toggle("active", b.dataset.mode === state.renderMode)
    );
    const hint = document.getElementById("render-hint");
    if (hint) hint.textContent = RENDER_MODES[state.renderMode].hint;
    bottleBlend.classList.toggle("mode-foto", state.renderMode === "foto");
    bottleTint.classList.toggle("mode-foto", state.renderMode === "foto");
    bottleTint.classList.toggle("mode-klassisch", state.renderMode === "klassisch");
    applyRenderBase();
    setLogoWidth();
  }

  function applyRenderBase() {
    const a = ASSETS[state.size];
    bottleBase.src = a[state.renderMode];
    bottleTint.style.webkitMaskImage = "url(" + (state.renderMode === "klassisch" ? a.klassischTint : a.tint) + ")";
    bottleTint.style.maskImage = "url(" + (state.renderMode === "klassisch" ? a.klassischTint : a.tint) + ")";
    bottleBase.alt = "Vorschau der konfigurierten Icko Fan-Flasche (" +
      (state.size === "05" ? "0,5 l" : "1,0 l") + ")";
  }

  /* ---------- Logo-Größe (automatisch, ~40 % der Körperbreite) ---------- */
  const bodyFractionCache = {};

  // Misst die Flaschenkörper-Breite relativ zur Bildbreite aus der
  // Tint-Maske (deckt nur den Körper ab, Kappe ausgenommen) – damit
  // sich das Logo immer in den Befärbungsbereich einfügt und nicht
  // über den Flaschenkörper hinausragt.
  function measureBodyFraction(size, mode, cb) {
    const key = size + ":" + mode;
    if (bodyFractionCache[key]) {
      cb(bodyFractionCache[key]);
      return;
    }
    const a = ASSETS[size];
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0);
      let frac = LOGO_BODY_FALLBACK;
      try {
        const d = ctx.getImageData(0, 0, c.width, c.height).data;
        let maxW = 0;
        for (let y = 0; y < c.height; y++) {
          let minX = c.width, maxX = 0;
          const row = y * c.width;
          for (let x = 0; x < c.width; x++) {
            if (d[(row + x) * 4 + 3] > 0) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
            }
          }
          if (maxX > minX && maxX - minX + 1 > maxW) maxW = maxX - minX + 1;
        }
        if (maxW > 0) frac = maxW / c.width;
      } catch (e) { /* Canvas ggf. nicht lesbar -> Fallback */ }
      bodyFractionCache[key] = frac;
      cb(frac);
    };
    img.onerror = () => {
      bodyFractionCache[key] = LOGO_BODY_FALLBACK;
      cb(LOGO_BODY_FALLBACK);
    };
    img.src = mode === "klassisch" ? a.klassischTint : a.tint;
  }

  function setLogoWidth() {
    measureBodyFraction(state.size, state.renderMode, (bodyFrac) => {
      const ringFrac = LOGO_RING_FRACTION;
      const pct = (LOGO_BODY_FRACTION * bodyFrac / ringFrac) * 100;
      logoOverlay.style.width = pct.toFixed(2) + "%";
      renderLogo();
    });
  }

  /* ---------- Farbe ---------- */
  colorInput.addEventListener("input", (e) => {
    setColor(e.target.value, null);
  });

  pmsInput.addEventListener("input", () => {
    const code = pmsInput.value.trim();
    if (!code) return;
    const key = normalizePms(code);
    const match = PANTONE_LOOKUP[key];
    if (match) {
      setColor(match.hex, match.name);
      colorInput.value = match.hex;
    } else {
      setColor(PMS_FALLBACK_HEX, null);
      colorNameEl.textContent = "PMS " + key + " (nicht in Vorschau, Farbabstimmung nötig)";
      state.pantone = "PMS " + key;
      updateSummary();
    }
  });

  function setColor(hex, name) {
    state.hex = hex;
    state.pantone = name;
    bottleTint.style.backgroundColor = hex;
    if (name) {
      colorNameEl.textContent = name;
    } else {
      const match = PANTONE_SWATCHES.find((c) => c.hex.toLowerCase() === hex.toLowerCase());
      colorNameEl.textContent = match ? match.name : hex.toUpperCase();
      state.pantone = match ? match.name : hex.toUpperCase();
    }
    document.querySelectorAll(".swatch").forEach((s) => {
      s.classList.toggle("active", s.dataset.hex.toLowerCase() === hex.toLowerCase());
    });
    updateSummary();
  }

  /* ---------- Logo (Upload) ---------- */
  dropzone.addEventListener("click", () => fileInput.click());

  ["dragenter", "dragover"].forEach((ev) =>
    dropzone.addEventListener(ev, (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    })
  );
  ["dragleave", "drop"].forEach((ev) =>
    dropzone.addEventListener(ev, (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
    })
  );

  dropzone.addEventListener("drop", (e) => {
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file) loadLogo(file);
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) loadLogo(fileInput.files[0]);
    fileInput.value = "";
  });

  function loadLogo(file) {
    if (!file.type.match(/image\/(png|jpeg|svg\+xml|webp)/)) {
      alert("Bitte ein Bild im Format PNG, JPG, SVG oder WebP wählen.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        state.logo = toWhiteLogo(img);
        applyLogo();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function toWhiteLogo(img) {
    const max = 300;
    const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(img.naturalWidth * scale));
    c.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, c.width, c.height);
    const d = ctx.getImageData(0, 0, c.width, c.height);
    const px = d.data;
    for (let i = 0; i < px.length; i += 4) {
      if (px[i + 3] === 0) continue;
      if (Math.min(px[i], px[i + 1], px[i + 2]) >= 180) {
        px[i + 3] = 0;
      } else {
        px[i] = px[i + 1] = px[i + 2] = 255;
      }
    }
    ctx.putImageData(d, 0, 0);
    return c.toDataURL("image/png");
  }

  /* ---------- Logo (Bearbeiten) ---------- */
  ["logo-x", "logo-y", "logo-scale", "logo-rotate"].forEach((id) => {
    const el = document.getElementById(id);
    const key = "logo" + id.replace("logo-", "").replace(/^./, (c) => c.toUpperCase());
    el.addEventListener("input", () => {
      state[key] = parseInt(el.value, 10);
      if (id === "logo-x") state.logoAngle = state.logoX * 6; // Umdrehung um die Flasche
      applyLogo();
    });
  });

  logoRemove.addEventListener("click", () => {
    state.logo = null;
    state.logoX = state.logoY = 0;
    state.logoScale = 100;
    state.logoRotate = 0;
    ["logo-x", "logo-y", "logo-scale", "logo-rotate"].forEach((id) => {
      document.getElementById(id).value = id === "logo-scale" ? 100 : 0;
    });
    applyLogo();
  });
  function applyLogo() {
    const hasCustom = !!state.logo;
    logoOverlay.hidden = false;
    setLogoWidth();
    loadLogoSource();
    dropzone.hidden = hasCustom;
    logoControls.hidden = false;
    updateSummary();
  }

  /* ---------- Stückzahl ---------- */
  document.querySelectorAll("#qty-group .btn-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.qty = btn.dataset.qty;
      document.querySelectorAll("#qty-group .btn-toggle").forEach((b) =>
        b.classList.toggle("active", b.dataset.qty === btn.dataset.qty)
      );
      qtyBonus.textContent = QUANTITY_BONUS[state.qty] || "";
      updateSummary();
    });
  });

  /* ---------- Zusammenfassung & Angebot ---------- */
  function updateSummary() {
    const sizeLabel = state.size === "05" ? "0,5 l" : "1,0 l";
    const price = PRICES[state.size][state.qty];
    const total = price * parseInt(state.qty, 10);

    document.getElementById("sum-size").textContent = sizeLabel;
    document.getElementById("sum-color").textContent =
      state.pantone + " (" + state.hex + ")";
    document.getElementById("sum-logo").textContent = state.logo ? "ja (eigenes)" : "ja (ICKO)";
    document.getElementById("sum-qty").textContent = state.qty;
    document.getElementById("sum-price").textContent = price.toFixed(2).replace(".", ",") + " €";
    document.getElementById("sum-total").textContent =
      total.toLocaleString("de-DE", { style: "currency", currency: "EUR" });

    const subject = encodeURIComponent("Angebotsanfrage Icko Fan-Flasche");
    const body = encodeURIComponent(
      "Ich interessiere mich für ein Angebot:\n\n" +
      "Größe: " + sizeLabel + "\n" +
      "Farbe: " + state.pantone + " (" + state.hex + ")\n" +
      "Logo: " + (state.logo ? "ja (eigenes Logo hochgeladen)" : "ja (ICKO-Standardlogo)") + "\n" +
      "Stückzahl: " + state.qty + "\n" +
      "Stückpreis: " + price.toFixed(2) + " €\n" +
      "Gesamt: " + total.toLocaleString("de-DE") + " €\n" +
      (QUANTITY_BONUS[state.qty] ? "Bonus: " + QUANTITY_BONUS[state.qty] + "\n" : "") +
      "\nBitte kontaktieren Sie mich für weitere Details."
    );
    offerLink.href = "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
  }

  /* ---------- Logo-Zylinder: Wickeln + Drehen + Metall-Glanz ----------
     Das Logo ist um die Flasche (Zylinder) gewickelt. Pixelspalte für
     Pixelspalte wird der sichtbare Ausschnitt mit asin-Projektion
     berechnet – dadurch schrumpft das Logo zu den Rändern hin (Perspektive)
     und ragt nie über den Flaschenkörper hinaus. Mit der Maus am Körper
     ziehen dreht die Flasche; der Metall-Glanz (Heißfolie) reflektiert
     das Licht, das der Maus folgt. */
  const cctx = logoCanvas.getContext("2d");
  const wrapTmp = document.createElement("canvas");
  const wctx = wrapTmp.getContext("2d");
  let logoSource = null;    // {img, x0, y0, w, h} – Original-Logo + Inhalt-BBox
  let logoPrepared = null;  // {canvas, x0, y0, w, h} – um logoRotate gedreht
  let logoSourceKey = "";
  let lightX = 0.28, lightY = 0.18;
  let drag = null;

  function loadLogoSource() {
    const src = state.logo || DEFAULT_LOGO;
    if (logoSource && logoSourceKey === src) {
      prepareLogoSource();
      return;
    }
    logoSourceKey = src;
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext("2d").drawImage(img, 0, 0);
      logoSource = measureBBox(c);
      prepareLogoSource();
    };
    img.onerror = () => {
      logoSource = null;
      logoPrepared = null;
      renderLogo();
    };
    img.src = src;
  }

  // Bounding-Box des sichtbaren Inhalts (nicht-transparente Pixel)
  function measureBBox(c) {
    let d;
    try {
      d = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    } catch (e) { d = null; }
    let minX = c.width, minY = c.height, maxX = 0, maxY = 0;
    if (d) {
      for (let y = 0; y < c.height; y++) {
        const row = y * c.width;
        for (let x = 0; x < c.width; x++) {
          if (d[(row + x) * 4 + 3] > 16) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
    } else {
      minX = 0; minY = 0; maxX = c.width - 1; maxY = c.height - 1;
    }
    return { canvas: c, x0: minX, y0: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
  }

  // Logo um logoRotate gedreht (ohne transparenten Rand) vorbereiten
  function prepareLogoSource() {
    if (!logoSource) return;
    const { canvas, x0, y0, w, h } = logoSource;
    const rad = state.logoRotate * Math.PI / 180;
    const diag = Math.ceil(Math.hypot(w, h) + 4);
    const c = document.createElement("canvas");
    c.width = diag;
    c.height = diag;
    const cx = c.getContext("2d");
    cx.translate(diag / 2, diag / 2);
    cx.rotate(rad);
    cx.drawImage(canvas, x0, y0, w, h, -w / 2, -h / 2, w, h);
    logoPrepared = measureBBox(c);
    renderLogo();
  }

  function renderLogo() {
    if (!logoPrepared || !logoOverlay.clientWidth) return;
    const boxW = logoOverlay.clientWidth;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = Math.max(2, Math.round(boxW * dpr));
    if (logoCanvas.width !== W) {
      logoCanvas.width = W;
      logoCanvas.height = W;
    }
    const R = W / 2;
    const scale = state.logoScale / 100;
    // Logo-Größe relativ zur Overlay-Breite (nicht in Quell-Pixeln):
    // Inhalte beider Logo-Typen füllen denselben Anteil des Overlays
    // (Standard-Rundlogo und eigene Logos), sodass die Wickel-Geometrie
    // beim Drehen identisch ist – das komplette Logo bleibt von vorn sichtbar.
    const contentW = W * LOGO_RING_FRACTION * scale;
    const contentH = contentW * logoPrepared.h / logoPrepared.w;
    // Adaptive Krümmung: flach im Ruhezustand, volle Krümmung beim Drehen
    // (180° = ganze Umdrehung) oder Vergrößern (ab 100 %).
    const bend = Math.abs(state.logoAngle) / 180 +
                 Math.max(0, (state.logoScale - 100) / 100);
    const target = Math.min(ZYLINDER_CURVE_MAX,
                            ZYLINDER_CURVE_MIN + (ZYLINDER_CURVE_MAX - ZYLINDER_CURVE_MIN) * bend);
    state.zylinderCurve += (target - state.zylinderCurve) * 0.2;
    if (Math.abs(target - state.zylinderCurve) > 0.001) scheduleRender();
    const c = state.zylinderCurve;
    const Rz = R / c;               // effektiver Radius: größer = flacher
    const phi = contentW / Rz;      // Winkelspanne des Logos (rad)
    const ang = state.logoAngle * Math.PI / 180;
    const cy = R + state.logoY * W * 0.004; // vertikale Mitte (Y-Schieberegler)

    // 1) Weißes Logo zylindrisch auf den Flaschenkörper wickeln
    wrapTmp.width = W;
    wrapTmp.height = W;
    wctx.clearRect(0, 0, W, W);
    for (let x = 0; x < W; x++) {
      const t = (x + 0.5) / W;
      const theta = Math.asin(c * (2 * t - 1)); // -asin(c)..asin(c)
      const p = (theta - ang + phi / 2) / phi;
      if (p < 0 || p > 1) continue;         // Logoteil liegt auf der Rückseite
      const sx = logoPrepared.x0 + p * logoPrepared.w;
      wctx.drawImage(logoPrepared.canvas, sx, logoPrepared.y0, 1, logoPrepared.h,
                     x, cy - contentH / 2, 1, contentH);
    }

    // 2) Metall-Folie: silberner Verlauf + Lichtreflex (wie zuvor im CSS)
    cctx.clearRect(0, 0, W, W);
    const gx = lightX * W, gy = lightY * W;
    const grad = cctx.createLinearGradient(gx, 0, gx + 0.35 * W, 0.9 * W);
    grad.addColorStop(0.00, "#b6bac2");
    grad.addColorStop(0.06, "#ffffff");
    grad.addColorStop(0.12, "#b0b4bc");
    grad.addColorStop(0.25, "#d8dbe0");
    grad.addColorStop(1.00, "#a6aab2");
    cctx.fillStyle = grad;
    cctx.fillRect(0, 0, W, W);
    const rg = cctx.createRadialGradient(gx, gy, 0, gx, gy, W * 0.55);
    rg.addColorStop(0.00, "rgba(255,255,255,0.9)");
    rg.addColorStop(0.25, "rgba(255,255,255,0.2)");
    rg.addColorStop(1.00, "rgba(255,255,255,0)");
    cctx.globalCompositeOperation = "lighter";
    cctx.fillStyle = rg;
    cctx.fillRect(0, 0, W, W);
    cctx.globalCompositeOperation = "destination-in";
    cctx.drawImage(wrapTmp, 0, 0);
    cctx.globalCompositeOperation = "source-over";
  }

  let renderQueued = false;
  function scheduleRender() {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => {
      renderQueued = false;
      renderLogo();
    });
  }

  function updateLight(e) {
    const r = logoOverlay.getBoundingClientRect();
    if (!r.width || !r.height) return;
    lightX = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    lightY = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
  }

  bottleStage.addEventListener("pointerdown", (e) => {
    drag = { x: e.clientX, angle: state.logoAngle, id: e.pointerId };
    bottleStage.classList.add("dragging");
    bottleStage.setPointerCapture(e.pointerId);
    updateLight(e);
    scheduleRender();
  });
  bottleStage.addEventListener("pointermove", (e) => {
    updateLight(e);
    if (drag) {
      const sr = bottleStage.getBoundingClientRect();
      state.logoAngle = drag.angle + ((e.clientX - drag.x) / sr.width) * 180;
      const slider = document.getElementById("logo-x");
      if (slider) slider.value = Math.max(-30, Math.min(30, Math.round(state.logoAngle / 6)));
    }
    scheduleRender();
  });
  function endDrag(e) {
    if (drag && e.pointerId !== drag.id) return;
    drag = null;
    bottleStage.classList.remove("dragging");
  }
  bottleStage.addEventListener("pointerup", endDrag);
  bottleStage.addEventListener("pointercancel", endDrag);
  bottleStage.addEventListener("pointerleave", () => {
    if (drag) return;
    lightX = 0.28;
    lightY = 0.18;
    scheduleRender();
  });

  /* ---------- Init ---------- */
  setSize(state.size);
  setColor(state.hex, state.pantone);
  pmsInput.value = state.pantone.replace(/^PMS\s*/i, "");
  applyLogo();
  updateSummary();
})();
