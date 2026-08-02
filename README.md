# Icko Fan-Flasche – Konfigurator-Website

Interaktive Konfigurator-Website für die **Icko Fan-Flasche** (0,5 l / 1,0 l).
Kunden wählen Größe, Pantone-Farbe und laden ihr eigenes Logo hoch – mit
Live-Vorschau und Preisberechnung. Optimiert für Hosting auf **GitHub Pages**.

## Inhalte

- `web/` – die komplette Website (HTML, CSS, JS, SVG-Mockup)
- `Icko Fan-Flasche Vorstellung 3.pdf` – Produktvorstellung (Größen, Features, Preise, Verpackung)
- `PLAN.md` – Projektplanung (Features, Wireframe, Tech-Optionen)
- `HOSTING-RESEARCH.md` – Hosting-Recherche & Onlineshop-Planung (WooCommerce/Shopify/Shopware)
- `log.md` – Änderungslog (nur im Projektordner, nicht im Repo)

## Lokal ausprobieren

Einfach die `web/index.html` im Browser öffnen – der Konfigurator läuft komplett
im Browser, es ist kein Server nötig.

## Deployment auf GitHub Pages

Die Website liegt im Unterordner `web/`. Ein GitHub-Action-Workflow
(`.github/workflows/deploy.yml`) veröffentlicht automatisch den Inhalt von `web/`
unter GitHub Pages, sobald Änderungen auf `main` gepusht werden.

### Manuelle Schritte (einmalig, im Repo)

1. Repository auf GitHub anlegen und pushen.
2. GitHub-Repo → **Settings → Pages** öffnen.
3. Bei **Source** die Option **GitHub Actions** wählen (nicht "Deploy from a branch").
4. Sicherstellen, dass **Environments → github-pages** mit der URL hinterlegt ist
   (erstellt der Workflow automatisch beim ersten Push).

### Nach dem ersten Push

Die Seite ist erreichbar unter:

```
https://<dein-username>.github.io/<repo-name>/
```

Jeder spätere `git push` auf `main` aktualisiert die Seite automatisch.

### Eigene Domain (optional)

1. Domain-Anbieter: DNS-CNAME-Record auf `<dein-username>.github.io` zeigen lassen.
2. Im Repo: **Settings → Pages → Custom domain** eintragen und auf **Save** klicken.

## Konfigurator-Features

- **Größe:** 0,5 l oder 1,0 l (SVG-Vorschau wechselt)
- **Farbe:** Freie Farbwahl (Farbwähler) oder 18 vordefinierte Pantone-Swatches
- **Logo:** Upload per Klick oder Drag & Drop (PNG, JPG, SVG, WebP), frei
  positionierbar, skalierbar, drehbar
- **Stückzahl:** 120 / 600 / 1200 mit Preisstaffel und Bonus-Hinweis
- **Angebot anfragen:** erzeugt eine E-Mail mit der kompletten Konfiguration

## Datenpflege

- Farbpalette & Preise: `web/js/data.js` (`PANTONE_SWATCHES`, `PRICES`)
- Kontakt-E-Mail für Angebote: `web/js/data.js` (`CONTACT_EMAIL`)
