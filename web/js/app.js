/* =========================================================
   Icko Fan-Flasche – Konfigurator-Logik
   ========================================================= */

(function () {
  "use strict";

  const bottleStage = document.getElementById("bottle-stage");
  const bottleBase = document.getElementById("bottle-base");
  const bottleTint = document.getElementById("bottle-tint");
  const logoOverlay = document.getElementById("logo-overlay");
  const logoImg = document.getElementById("logo-img");
  const swatchesEl = document.getElementById("swatches");
  const colorInput = document.getElementById("color-input");
  const colorNameEl = document.getElementById("color-name");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("file-input");
  const logoControls = document.getElementById("logo-controls");
  const logoRemove = document.getElementById("logo-remove");
  const qtyBonus = document.getElementById("qty-bonus");
  const offerLink = document.getElementById("offer-link");

  const ASSETS = {
    "05": {
      base: "assets/flasche-05-base.png",
      tint: "assets/flasche-05-tint.png",
      ratio: 420 / 1150,
    },
    "10": {
      base: "assets/flasche-10-base.png",
      tint: "assets/flasche-10-tint.png",
      ratio: 480 / 1240,
    },
  };

  const state = {
    size: "05",
    qty: "120",
    hex: "#DA291C",
    pantone: "PMS 485 C",
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
    const a = ASSETS[size];
    bottleBase.src = a.base;
    bottleTint.style.webkitMaskImage = "url(" + a.tint + ")";
    bottleTint.style.maskImage = "url(" + a.tint + ")";
    bottleBase.alt = "Vorschau der konfigurierten Icko Fan-Flasche (" +
      (size === "05" ? "0,5 l" : "1,0 l") + ")";
    updateSummary();
  }

  /* ---------- Farbe ---------- */
  colorInput.addEventListener("input", (e) => {
    setColor(e.target.value, null);
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
      state.logo = e.target.result;
      applyLogo();
    };
    reader.readAsDataURL(file);
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
    const hasLogo = !!state.logo;
    if (hasLogo) {
      logoImg.src = state.logo;
      logoOverlay.hidden = false;
      // Skalierung relativ zur Bühne
      const w = bottleStage.clientWidth;
      const scale = state.logoScale / 100;
      const translateX = state.logoX * w * 0.004;   // -30..30 → ±12 % Breite
      const translateY = state.logoY * w * 0.0025;  // -40..40 → ±10 % Breite
      logoImg.style.transform =
        "translate(" + translateX + "px," + translateY + "px) " +
        "rotate(" + state.logoRotate + "deg) " +
        "scale(" + scale + ")";
    } else {
      logoOverlay.hidden = true;
      logoImg.removeAttribute("src");
      logoImg.removeAttribute("style");
    }
    dropzone.hidden = hasLogo;
    logoControls.hidden = !hasLogo;
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
    document.getElementById("sum-logo").textContent = state.logo ? "ja" : "nein";
    document.getElementById("sum-qty").textContent = state.qty;
    document.getElementById("sum-price").textContent = price.toFixed(2).replace(".", ",") + " €";
    document.getElementById("sum-total").textContent =
      total.toLocaleString("de-DE", { style: "currency", currency: "EUR" });

    const subject = encodeURIComponent("Angebotsanfrage Icko Fan-Flasche");
    const body = encodeURIComponent(
      "Ich interessiere mich für ein Angebot:\n\n" +
      "Größe: " + sizeLabel + "\n" +
      "Farbe: " + state.pantone + " (" + state.hex + ")\n" +
      "Logo: " + (state.logo ? "ja (im Konfigurator hochgeladen)" : "nein") + "\n" +
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
  updateSummary();
})();
