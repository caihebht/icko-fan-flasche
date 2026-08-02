/* =========================================================
   Icko Fan-Flasche – Konfigurator-Logik
   ========================================================= */

(function () {
  "use strict";

  const svg = document.getElementById("flasche");
  const bottle05 = document.getElementById("flasche-05");
  const bottle10 = document.getElementById("flasche-10");
  const logoImg05 = document.getElementById("logo-img-05");
  const logoImg10 = document.getElementById("logo-img-10");
  const swatchesEl = document.getElementById("swatches");
  const colorInput = document.getElementById("color-input");
  const colorNameEl = document.getElementById("color-name");
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("file-input");
  const logoControls = document.getElementById("logo-controls");
  const logoRemove = document.getElementById("logo-remove");
  const qtyBonus = document.getElementById("qty-bonus");
  const offerLink = document.getElementById("offer-link");

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
    bottle05.style.display = size === "05" ? "" : "none";
    bottle10.style.display = size === "10" ? "" : "none";
    updateSummary();
  }

  /* ---------- Farbe ---------- */
  colorInput.addEventListener("input", (e) => {
    setColor(e.target.value, null);
  });

  function setColor(hex, name) {
    state.hex = hex;
    state.pantone = name;
    svg.style.setProperty("--bottle-color", hex);
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
    const imgs = [logoImg05, logoImg10];

    imgs.forEach((img) => {
      if (hasLogo) {
        img.setAttribute("href", state.logo);
        img.style.display = "block";
        const scale = state.logoScale / 100;
        const cx = parseFloat(img.getAttribute("x")) + parseFloat(img.getAttribute("width")) / 2;
        const cy = parseFloat(img.getAttribute("y")) + parseFloat(img.getAttribute("height")) / 2;
        img.setAttribute("transform",
          `translate(${state.logoX} ${state.logoY}) translate(${cx} ${cy}) rotate(${state.logoRotate}) scale(${scale}) translate(${-cx} ${-cy})`);
      } else {
        img.removeAttribute("href");
        img.removeAttribute("transform");
        img.style.display = "none";
      }
    });

    dropzone.hidden = hasLogo;
    logoControls.hidden = !hasLogo;
    document.querySelectorAll(".logo-placeholder").forEach((el) => {
      el.style.display = hasLogo ? "none" : "";
    });
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
  setColor(state.hex, state.pantone);
  updateSummary();
})();
