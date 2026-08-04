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
  const logoImg = document.getElementById("logo-img");
  const logoGloss = document.getElementById("logo-gloss");
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

  const ASSET_VER = "v7"; // Bump bei Asset-/CSS-Änderungen gegen Browser-Cache
  const ASSET = (p) => `${p}?v=${ASSET_VER}`;

  const RENDER_MODES = {
    farbtreu: { label: "Farbtreu", hint: "Farbtreu: Farbe wird exakt dargestellt." },
    foto: { label: "Foto-Echt", hint: "Foto-Echt: echtes Fotolicht, Farben wirken gedämpfter." },
  };

  const ASSETS = {
    "05": {
      base: ASSET("assets/flasche-05-base.png"),
      foto: ASSET("assets/flasche-05-foto.png"),
      tint: ASSET("assets/flasche-05-tint.png"),
      ratio: 406 / 1486,
    },
    "10": {
      base: ASSET("assets/flasche-10-base.png"),
      foto: ASSET("assets/flasche-10-foto.png"),
      tint: ASSET("assets/flasche-10-tint.png"),
      ratio: 548 / 1822,
    },
  };

  const DEFAULT_LOGO = ASSET("assets/logo-icko-rund-weiss.png");

  // Logo nimmt ca. 80 % der Breite des Flaschenkörpers ein (2× von 40 %).
  // Der Ring des runden ICKO-Logos ist nur ~84 % der PNG-Kantenlänge,
  // deshalb wird das Element entsprechend größer skaliert, damit der
  // sichtbare Kreis wirklich 80 % der Körperbreite misst.
  const LOGO_BODY_FRACTION = 0.80;
  const LOGO_RING_FRACTION = 0.843; // nur für das runde Standard-Logo
  const LOGO_BODY_FALLBACK = 0.94;  // Körperbreite / Bildbreite (Fallback)

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
    const isFoto = state.renderMode === "foto";
    bottleBlend.classList.toggle("mode-foto", isFoto);
    bottleTint.classList.toggle("mode-foto", isFoto);
    applyRenderBase();
  }

  function applyRenderBase() {
    const a = ASSETS[state.size];
    bottleBase.src = state.renderMode === "foto" ? a.foto : a.base;
    bottleTint.style.webkitMaskImage = "url(" + a.tint + ")";
    bottleTint.style.maskImage = "url(" + a.tint + ")";
    bottleBase.alt = "Vorschau der konfigurierten Icko Fan-Flasche (" +
      (state.size === "05" ? "0,5 l" : "1,0 l") + ")";
  }

  /* ---------- Logo-Größe (automatisch, ~40 % der Körperbreite) ---------- */
  const bodyFractionCache = {};

  // Misst die Flaschenkörper-Breite relativ zur Bildbreite aus der
  // geladenen Bottle-Base (breiteste Zeile im Bereich 20 %–95 % Höhe).
  function measureBodyFraction(size, cb) {
    if (bodyFractionCache[size]) {
      cb(bodyFractionCache[size]);
      return;
    }
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
        for (let y = Math.floor(c.height * 0.2); y < c.height * 0.95; y++) {
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
      bodyFractionCache[size] = frac;
      cb(frac);
    };
    img.onerror = () => {
      bodyFractionCache[size] = LOGO_BODY_FALLBACK;
      cb(LOGO_BODY_FALLBACK);
    };
    img.src = ASSETS[size].base;
  }

  function setLogoWidth() {
    measureBodyFraction(state.size, (bodyFrac) => {
      const ringFrac = state.logo ? 1 : LOGO_RING_FRACTION;
      const pct = (LOGO_BODY_FRACTION * bodyFrac / ringFrac) * 100;
      logoOverlay.style.width = pct.toFixed(2) + "%";
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
    logoImg.src = hasCustom ? state.logo : DEFAULT_LOGO;
    logoOverlay.hidden = false;
    setLogoWidth();
    // Glasur folgt der Logo-Silhouette (Spot-Gloss, maskiert auf den Druck)
    const glossSrc = hasCustom ? state.logo : DEFAULT_LOGO;
    logoGloss.style.setProperty("--logo-mask", 'url("' + glossSrc + '")');
    // Skalierung relativ zur Bühne
    const w = bottleStage.clientWidth;
    const scale = state.logoScale / 100;
    const translateX = state.logoX * w * 0.004;   // -30..30 → ±12 % Breite
    const translateY = state.logoY * w * 0.0025;  // -40..40 → ±10 % Breite
    const transform =
      "translate(" + translateX + "px," + translateY + "px) " +
      "rotate(" + state.logoRotate + "deg) " +
      "scale(" + scale + ")";
    logoImg.style.transform = transform;
    logoGloss.style.transform = transform;
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

  /* ---------- Init ---------- */
  setSize(state.size);
  setColor(state.hex, state.pantone);
  pmsInput.value = state.pantone.replace(/^PMS\s*/i, "");
  applyLogo();
  updateSummary();
})();
