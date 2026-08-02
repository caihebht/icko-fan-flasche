# Planung: Icko Fan-Flasche – Website mit Farb- & Logo-Konfigurator

## 1. Ziel

Eine Website für die **Icko Fan-Flasche**, mit der Kunden die Flasche **interaktiv konfigurieren** können:

- Größe wählen (0,5 l / 1,0 l)
- Farbe frei wählen (Pantone/PMS, per Farbwähler + vordefinierte Swatches)
- Eigenes Logo hochladen und auf der Flasche platzieren (Position, Größe, Winkel)
- Das Ergebnis in einer **Live-Vorschau** sehen

Die Seite dient als Verkaufs-/Konfigurationstool und zeigt zugleich das Produkt (Features, Preise, Verpackung) aus der Produktvorstellung.

## 2. Ausgangslage – Produktdaten (aus "Icko Fan-Flasche Vorstellung 3.pdf")

| Eigenschaft | 0,5 l | 1,0 l |
|---|---|---|
| Gewicht | 288 g | 444 g |
| Höhe | 26,5 cm | 30 cm |
| Breite | 7 cm | 9 cm |
| Preis (MOQ 120 Stk.) | 12 € | 14 € |
| Preis (ab 600 Stk.) | 11 € | 13 € |
| Preis (ab 1200 Stk.) | 11 € +10% gratis | 13 € +10% gratis |
| UVP | 20 € | 30 € |
| Verpackung (Stk./Karton) | 24 | 24 |

Weitere Fakten für die Website:
- Doppelwand-Vakuum-Edelstahl (SUS 304), lebensmittelecht, BPA-frei
- Farbige Lackierung als Schutzschicht, **jede Pantone (PMS)-Farbe** möglich
- **UV-Logodruck**: hochglänzend, kratzfest, hohe Farbintensität
- Thermoisolierung: kalt bis 24 h, warm bis 12 h
- Einhandbedienung, auslaufsichere Silikonringverdichtung, tragbarer Deckel
- Lieferbedingung: DDP; Preisstand 01.06.2026, gültig bis 31.12.2026

## 3. Zielgruppe & Nutzung

- **B2B**: Unternehmen, Vereine, Event-Agenturen (Merchandising, Giveaways) → Logo hochladen, Angebot anfragen
- **B2C**: Einzelhandel-Kunden, die das Produkt kennenlernen sollen

## 4. Funktionsumfang

### MVP (Phase 1 – Konfigurator + Produktseite)
1. **Farb-Konfigurator**
   - Farbwähler (HTML5 `<input type="color">`)
   - Vordefinierte Pantone-Swatch-Palette (z. B. 24–48 Farben)
   - Direkte Aktualisierung der Flaschenfarbe in der Vorschau
2. **Größen-Umschalter**
   - 0,5 l / 1,0 l → Vorschau & Preisanzeige passen sich an
3. **Logo-Upload**
   - Bild hochladen (PNG/SVG/JPG), Drag & Drop
   - Logo in der Vorschau auf der Flasche platzieren:
     - Position verschieben (Drag)
     - Größe skalieren (Slider/Mausrad)
     - Winkel drehen (Slider)
   - Logo-Farbe umfärben (bei SVG/PNG mit Maske)
4. **Live-Vorschau**
   - Flasche als **SVG-Mockup** (sauber, schnell, skalierbar)
   - Material-/Glanzeffekt, z. B. Verlauf, Glanzlicht, Schatten
   - Optional: Hintergrund-Szene (Sport-Optik)
5. **Angebots-Übersicht / "In den Warenkorb" (Anfrage)**
   - Gewählte Größe, Farbe (Pantone-Nummer), Logo
   - Preisberechnung nach Stückzahl (Stufen: 120 / 600 / 1200)
   - Anfrage-Button → E-Mail / Kontaktformular (MVP: `mailto:` oder Formular)
6. **Produktpräsentation**
   - Features (Thermoisolierung, Material, Einhandbedienung …) als Sektionen
   - Preistabelle, Verpackungsdetails, MOQ

### Phase 2 (Erweiterungen)
- **3D-Vorschau** (Three.js / Model-Viewer, GLB-Modell der Flasche)
- Logo-Bibliothek & Vorlagen (Icko-Logo, Text-Tool mit Fonts)
- Angebots-PDF generieren (z. B. mit der Konfiguration als Bild)
- Mehrsprachigkeit (DE/EN)
- Admin-Bereich für Pantone-Palette & Preise (CMS/Datenbank)
- Mehrere Druckpositionen (Vorderseite, Rückseite, Deckel)

## 5. Seitenstruktur (Wireframe)

```
[ Header ]  Icko Logo | Navigation: Start · Konfigurator · Features · Preise · Kontakt

[ Sektion 1 – Hero ]  Produktname + Claim + CTA "Flasche konfigurieren"
[ Sektion 2 – Konfigurator ]  (siehe Layout unten)
[ Sektion 3 – Features ]  3–6 Karten (Vakuum, Pantone, UV-Druck, 24h kalt …)
[ Sektion 4 – Preise ]  Stufentabelle (120 / 600 / 1200 Stk.)
[ Sektion 5 – Verpackung/Details ]  Karton, Gewicht, DDP
[ Footer ]  Kontakt, Impressum, Lieferbedingungen
```

**Konfigurator-Layout (2 Spalten):**

```
┌───────────────────────────────┬──────────────────────────────┐
│  LIVE-VORSCHAU                │  KONFIGURATION               │
│  ┌───────────────────┐        │  1. Größe      [0,5l] [1,0l] │
│  │                   │        │  2. Farbe      [Farbwähler]  │
│  │   Flaschen-SVG    │        │     Swatches  ▢▢▢▢▢▢▢▢▢▢    │
│  │   mit Logo        │        │  3. Logo       [Upload/DnD]  │
│  │                   │        │     Position/Scale/Rot Slider│
│  └───────────────────┘        │  4. Zusammenfassung          │
│  Stückzahl: [120] [600] [1200]│     → Preis, Pantone, Logo   │
│  → [Angebot anfragen]         │                              │
└───────────────────────────────┴──────────────────────────────┘
```

## 6. Technische Planung

### Variante A – Einfach & schnell (empfohlen für MVP)
- **Kein Build-Tool**: eine `index.html` + `style.css` + `app.js`
- **Vorschau**: SVG-Mockup der Flasche, Farbe per `fill`-Änderung, Logo als `<image>` in der SVG
- **Logo-Transformation**: Drag über `pointer`-Events, Scale/Rotate per Slider (CSS `transform`)
- Sofort überall lauffähig (auch auf GitHub Pages / Netlify Drop), kein Framework nötig

### Variante B – Framework (falls Seite wachsen soll)
- **Vue 3 oder React + Vite**, ggf. mit Tailwind
- SVG-Komponenten, State-Management für Konfiguration
- Angebots-PDF via `html2canvas`/`jspdf`

### Variante C – 3D (Phase 2)
- **model-viewer** (Googles `<model-viewer>`) oder **Three.js**
- GLB-Flasche, Farbe = PBR-Material-Map, Logo als Textur-Decal
- Deutlich aufwändiger, daher erst nach MVP

**Empfehlung:** Mit **Variante A** starten (kein Framework, kein Build), Architektur so halten,
dass später auf Variante B/C migriert werden kann (Konfigurations-„State“ sauber getrennt).

## 7. Datenmodell (Konfiguration)

```js
{
  size: "0.5l" | "1.0l",
  color: { hex: "#C8102E", pantone: "PMS 485 C" },
  logo: {
    src: "data-url…",            // hochgeladenes Bild
    x: 0.5,                      // relative Position (0–1)
    y: 0.35,
    scale: 1.0,
    rotate: 0,                   // Grad
    tint: null | "#FFFFFF"       // optionales Umfärben
  },
  quantity: 120,                 // 120 | 600 | 1200
}
```

Pantone-Daten: lokale Tabelle `pantone.json` (Name + Hex), ggf. verlinkt zu Hex-Werten.
(Beachte: exakte Pantone-Farbwirkung zeigt nur der echte Druck – auf der Website ist es eine Annäherung. Hinweis auf der Seite einplanen.)

## 8. Projektstruktur

```
Projekte/ick-fan-flasche/
├── Icko Fan-Flasche Vorstellung 3.pdf   (Original)
├── PLAN.md                              (dieses Dokument)
├── web/
│   ├── index.html
│   ├── css/style.css
│   ├── js/app.js        (Konfigurator-Logik)
│   ├── js/data.js       (Pantone-Palette, Preise)
│   └── assets/
│       ├── flasche.svg  (SVG-Mockup)
│       ├── icko-logo.svg
│       └── ...          (Bilder, Hintergründe)
```

## 9. Meilensteine

| # | Schritt | Ergebnis |
|---|---|---|
| 1 | Gerüst & Layout | `index.html` mit allen Sektionen, Responsive-Grundgerüst |
| 2 | Flaschen-SVG-Mockup | Vorschau 0,5 l / 1,0 l, Größen-Umschalten |
| 3 | Farb-Konfigurator | Farbwähler + Pantone-Swatches wirken auf die Flasche |
| 4 | Logo-Upload & Editieren | Drag/Scale/Rotate, Umfärben |
| 5 | Preis & Anfrage | Stückzahl-Stufen, Zusammenfassung, Anfrage-Button |
| 6 | Feinschliff & Tests | Responsive, Klick-Test, Produktdaten final |

## 10. Offene Fragen

1. **Tech-Stack**: Variante A (pur) oder direkt mit Framework (Vue/React)?
2. **Bottle-Mockup**: Liegt das Original (SVG/AI/PNG) der Flasche vor, oder soll ich ein neues SVG-Mockup zeichnen?
3. **Logo-Upload**: Nur Bild-Upload oder auch Text-Werkzeug (eigener Schriftzug)?
4. **Kontakt**: Reicht ein `mailto:`-Link oder echtes Formular/Backend (z. B. PHP oder Form-Dienst)?
5. **Deployment**: Lokal testen oder direkt online stellen (GitHub Pages / Netlify)?
6. **Sprache**: Nur Deutsch oder auch Englisch?
7. **Pantone-Palette**: Reichen ~24–48 repräsentative Swatches, oder braucht es Zugriff auf alle Pantone-Coated-C-Sonderfarben?
