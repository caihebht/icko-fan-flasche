/* =========================================================
   Icko Fan-Flasche – Konfigurator-Daten (Pantone, Preise)
   ========================================================= */

const PANTONE_SWATCHES = [
  { name: "PMS 485 C",   hex: "#DA291C" },
  { name: "PMS 185 C",   hex: "#E4002B" },
  { name: "PMS 200 C",   hex: "#BA0C2F" },
  { name: "PMS 165 C",   hex: "#FF671F" },
  { name: "PMS 137 C",   hex: "#FFB81C" },
  { name: "PMS 116 C",   hex: "#FEDD00" },
  { name: "PMS 348 C",   hex: "#00843D" },
  { name: "PMS 340 C",   hex: "#006747" },
  { name: "PMS 293 C",   hex: "#003DA5" },
  { name: "PMS 286 C",   hex: "#0033A0" },
  { name: "PMS 2727 C",  hex: "#307FE2" },
  { name: "PMS 306 C",   hex: "#00B5E2" },
  { name: "PMS 2592 C",  hex: "#6A2C91" },
  { name: "PMS 7421 C",  hex: "#9B2743" },
  { name: "PMS 7549 C",  hex: "#2C5697" },
  { name: "PMS 445 C",   hex: "#54585A" },
  { name: "PMS Black 6 C", hex: "#101820" },
  { name: "PMS 656 C",   hex: "#C6D6F0" },
];

const PRICES = {
  "05": { "120": 12, "600": 11, "1200": 11 },
  "10": { "120": 14, "600": 13, "1200": 13 },
};

const QUANTITY_BONUS = {
  "120": null,
  "600": null,
  "1200": "10% Warenüberschuss gratis",
};

const CONTACT_EMAIL = "info@icko.de";
