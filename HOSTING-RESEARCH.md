# Hosting-Recherche: Icko Fan-Flasche Website

**Stand:** 02.08.2026 (Preise inkl. MwSt., Aktions- & Dauerpreise können sich ändern)

**Ausgangslage:** Konfigurator-Website (Farbe + Logo auf der Flasche) jetzt,
später soll daraus ein **Onlineshop** werden. Erfahrung mit Strato + PHP.

---

## Kurzfazit (TL;DR)

| Szenario | Empfehlung | Kosten/Monat |
|---|---|---|
| Nur Config-Website (kein PHP nötig) | GitHub Pages / Cloudflare Pages / Netlify | **0 €** (+ Domain ~1 €) |
| PHP + MySQL, günstig & dauerhaft | **netcup Webhosting** oder Hetzner | **~2–6 €** |
| **Volle Sprachfreiheit (VPS/Cloud)** | **Hetzner Cloud / netcup VPS** | **~3–6 €** |
| Wie bisher bei Strato bleiben | Strato Hosting Basic | ~1 € (12 Mon.) → danach 9 € |
| Späterer kleiner Onlineshop | WooCommerce auf netcup/Strato | ~3–10 € Hosting + Plugins |
| Fertiger Shop-Service | Shopify Basic | ab 36 € (+2% Transaktion) |

**Empfehlung für dich:** Da ein Onlineshop sicher geplant ist, lohnt sich schon
jetzt ein günstiges **PHP-Webhosting** (netcup oder Strato) statt nur kostenlos
statisch – so entfällt eine spätere Migration. Die Config-Website läuft problemlos
auf jedem PHP-Host. **Nur wenn du serverseitig eigene Logik planst** (Angebots-PDF,
Logo-Verarbeitung, eigene API, andere Sprache als PHP), ist ein **VPS/Cloud-Server**
die bessere Wahl (siehe Abschnitt 3).

---

## 1. Warum die Config-Website fast alles kostet: nichts

Der Farb-/Logo-Konfigurator ist **reine Client-Seite** (HTML/CSS/JS, SVG-Vorschau,
Logo-Upload). Er braucht **kein PHP, keine Datenbank** → statisch hostbar.

| Anbieter | Kosten | Grenzen (Free) | PHP? | Shop später? |
|---|---|---|---|---|
| **GitHub Pages** | 0 € | 100 GB/Monat, Repo ≤1 GB | nein | nein |
| **Cloudflare Pages** | 0 € | unbegrenzt Bandbreite, 500 Builds/Monat, kommerziell erlaubt | nein (nur Workers) | nein |
| **Netlify** | 0 € | 100 GB/Monat, 100 Formular-Submits/Monat, kommerziell erlaubt | nein | nein |
| **Vercel** | 0 € | 100 GB/Monat; **Free nur non-commercial** | nein | nein |

**Fazit:** Für die Config-Seite reichen kostenlose Optionen. Limitierender Faktor
ist nur, dass später **kein Shop** darauf läuft.

---

## 2. Günstige klassische PHP-Webhosts (wie Strato, aber günstiger)

Für PHP + MySQL + SSL + (optional) SSH. Domain meist extra (~10–20 €/Jahr).

| Anbieter | Tarif | Preis/Monat | Webspace | DBs | SSH | Dauerpreis? |
|---|---|---|---|---|---|---|
| **netcup** | Webhosting 1000 | **2,17 €** | 25 GB | 1 | nein | ja |
| **netcup** | Webhosting 2000 | ~3,81 € | 150 GB | 10 | ja | ja |
| **netcup** | Webhosting 4000 | **5,48 €** | 500 GB | 25 | ja | ja |
| **Hetzner** | Webhosting S | ab 2,00 € | 10 GB | 1 | nein | ja (ohne Mindestlaufzeit) |
| **Strato** | Hosting Starter | 0 € (1. Monat), dann 5 € | 50 GB | – | – | – |
| **Strato** | Hosting Basic | **1 €** (12 Mon.), danach **9 €** | 100 GB | 2 | – | nein (Aktion) |
| **IONOS** | Webhosting Standard | 1 € (6 Mon.), dann 6 € + 10 € Setup | 100 GB | 10 | ja | nein (Aktion) |
| **all-inkl** | Basis-Paket | ~4,55 € | 25 GB | 1 | ja | ja |

**Einschätzung:** **netcup Webhosting 2000/4000** hat das beste Preis-Leistungs-
Verhältnis: Dauerpreis ohne Abo-Abo, PHP-Version frei wählbar, SSH & Cronjobs,
Server in DE/AT. Strato ist okay, aber die günstigen Preise sind meist nur
Neukunden-Aktionen (danach deutlich teurer).

---

## 3. VPS / Cloud-Server (volle Sprachfreiheit)

Der Konfigurator (Client-JS) und ein WooCommerce-Shop laufen problemlos auf
Shared-Hosting. Ein **VPS/Cloud-Server** lohnt sich, wenn du serverseitig eigene
Logik bauen willst (Angebots-PDF, Logo-/Bildverarbeitung, eigene API) und dabei
**nicht auf PHP beschränkt sein** möchtest: Node.js, Python, Go, Docker, beliebige
Datenbanken (PostgreSQL, MongoDB …) – alles installierbar.

| Anbieter | Tarif | Preis/Monat | Ressourcen |
|---|---|---|---|
| **Hetzner Cloud** | CX22 | **~3,29 €** | 2 vCPU, 4 GB RAM, 40 GB |
| **Hetzner Cloud** | CX32 | ~5,99 € | 4 vCPU, 8 GB RAM, 80 GB |
| **netcup** | VPS 1000 | ~3,25 € | 1 vCPU, 2 GB RAM, 160 GB |
| **netcup** | VPS 2000 | ~6,50 € | 2 vCPU, 4 GB RAM, 320 GB |
| **DigitalOcean** | Basic Droplet | ~4–6 € ($4–6) | 1 vCPU, 1 GB RAM, 25 GB |
| **Contabo** | VPS | ab ~5 € | 4 vCPU, 8 GB RAM, 50 GB |

**Vorteile**
- Jede Programmiersprache & Datenbank möglich
- Root-Zugriff, Docker, vollständige Kontrolle
- Skalierbar: mehr RAM/CPU/SSD per Klick (auch automatisch)

**Nachteile / Aufwand**
- **Du verwaltest alles selbst:** Updates, Backups, Security-Patches,
  nginx/PHP-Konfiguration, Monitoring
- **E-Mail nicht inklusive** – eigenes Mailserver-Setup nötig oder E-Mail-Dienst dazu
- Bei Fehlkonfiguration: Ausfälle, Sicherheitsrisiken
- Höhere laufende Betreuung als beim Shared-Hosting

**Fazit:** Cloud/VPS ist **nicht pauschal besser** – es lohnt sich erst, wenn du
die Sprachfreiheit und Kontrolle tatsächlich brauchst und bereit bist, die Server-
Wartung zu übernehmen (oder eine einmalige Einrichtung zu investieren). Für eine
reine Config-Website + WooCommerce-Shop reicht Shared-Hosting, da PHP dort völlig
ausreicht.

---

## 4. Onlineshop-Optionen (die spätere Phase)

### a) WooCommerce (WordPress) – empfohlen für den Einstieg
- Plugin **kostenlos**, läuft auf **normalem PHP-Webhosting** (netcup/Strato reicht für kleine Shops).
- Kosten realistisch: Hosting **~3–10 €/Monat** + DSGVO-Plugin (z. B. Germanized Pro ~69 €/Jahr).
- Managed Hosting (Backup/Updates inkl.): HostPress **ab 44 €/Monat**, Raidboxes ab ~44 €/Monat.
- Gut, wenn du PHP kannst und volle Kontrolle willst.

### b) Shopware
- **Community Edition: 0 €** (Open Source, bis 1 Mio. € Umsatz/Jahr), Self-Hosted auf netcup/Strato möglich.
- Cloud-Editionen: **Rise ab 600 €/Monat**, Evolve ab 2.400 €/Monat.
- Managed Self-Hosted (z. B. Hetzner): ~100–200 €/Monat.
- Mächtig, aber für Start eher Overkill.

### c) Shopify (SaaS, kein PHP)
- **Basic ab ~36 €/Monat** + **2 % Transaktionsgebühr** (ohne Shopify Payments).
- Schnellster Start, Hosting inklusive, aber monatlich teurer und weniger flexibel als WooCommerce.

### d) Baukasten-Shops
- **STRATO Webshop Now** ab 15 €/Monat · **IONOS MyWebsite Shop** ab 6 €/Monat (6 Mon., danach ~12 €).
- Kein PHP/Custom-Code nötig – am flexibelsten ist das aber nicht.

---

## 5. Etablierte Wege für den kleinen Shop-Start (2026)

Für einen **kleinen** Shop sind zwei Wege etabliert – WooCommerce (Open Source,
selbst gehostet) und Shopify (SaaS).

| Kriterium | **WooCommerce** | **Shopify** |
|---|---|---|
| Etabliertheit | Global meistgenutzt (~33 % aller Shops, 4,5 Mio. aktiv) | Größtes SaaS-Shopsystem, schnellster Launch |
| Einstiegskosten | Plugin kostenlos, nur Hosting (~10 €/Monat) | Ab 36 €/Monat + 2 % Transaktionsgebühr |
| Wartungsaufwand | Du verwaltest Updates/Security (8–12 h/Monat) | ~0, alles inklusive |
| Kontrolle | Voll (PHP, Code, eigene Daten) | Begrenzt |
| DSGVO (DE) | Germanized-Plugin (~69 €/Jahr) nötig | US-Firma, Anpassungen nötig |

**Hinweis Deutschland:** Unter den Top-1.000 DE-Shops führt **Shopware** (25,7 %),
aber das ist für Profis/Mittelstand. Für einen kleinen Start ist WooCommerce oder
Shopify der etablierte Standard.

**Empfohlenes Vorgehen (mit PHP-Erfahrung):**
1. **Jetzt:** Config-Website bauen – auf günstigem PHP-Hosting (netcup ~4 €/Monat)
   oder kostenlos statisch.
2. **Shop-Phase:** **WooCommerce** auf demselben Hosting – kein Umzug, kaum
   Zusatzkosten (nur Plugins).
3. **Rechtliches:** Germanized Pro (~69 €/Jahr) für DSGVO-konforme Rechtstexte.
4. Erst bei Umsatzwachstum → Managed Hosting oder Wechsel zu Shopify/Shopware.

**Shopify lohnt sich nur**, wenn du keine Technik verwalten willst und schnell
live sein musst. Bei PHP-Erfahrung und geplantem Konfigurator passt WooCommerce
besser.

---

## 6. Was außerdem anfällt

| Posten | Kosten |
|---|---|
| Domain (.de) | ~8–15 €/Jahr (z. B. Cloudflare Registrar, Namecheap, INWX) |
| SSL-Zertifikat | 0 € (bei allen genannten Anbietern inklusive) |
| E-Mail-Postfach | 0 € bei den meisten Webhosting-Tarifen inklusive |

---

## 7. Empfehlung für deinen Fall

1. **Jetzt (Config-Website):**
   - **netcup Webhosting 2000** (~3,81 €/Monat, Dauerpreis, SSH) – PHP+MySQL reicht
     für Config-Seite **und** späteren Shop. Oder bei Strato bleiben (Hosting Basic
     für 12 Monate zu 1 €/Monat), wenn dir die bekannte Umgebung wichtiger ist.
   - **Wenn du serverseitig eigene Logik planst oder Sprachfreiheit willst:**
     VPS/Cloud statt Shared-Hosting, z. B. **Hetzner Cloud CX22** (~3,29 €/Monat)
     oder **netcup VPS 2000** (~6,50 €/Monat). Einmalige Einrichtung für
     Updates/Backups/Mailservern nötig.
   - Alternative ohne Shop-Plan: 0 € mit GitHub Pages / Cloudflare Pages + eigener Domain.
2. **Später (Onlineshop):** WooCommerce auf demselben Webhosting (netcup/Strato)
   bzw. auf dem VPS, nur Plugins (~70–100 €/Jahr) zusätzlich. Erst bei Umsatzwachstum
   auf Managed Hosting oder Shopify upgraden.

**Grobkostenübersicht:**
- Minimal (statisch): **0 €/Monat** + Domain ~1 €/Monat
- Empfohlen (PHP-Host): **~4 €/Monat** + Domain ~1 €/Monat
- Mit Sprachfreiheit (VPS/Cloud): **~3–6 €/Monat** (+ Einrichtungsaufwand)
- Mit kleinem Shop (WooCommerce): **~10 €/Monat** gesamt
- Mit Shop-SaaS: **ab 36 €/Monat**

---

## Quellen (recherchiert 02.08.2026)
- netcup (netcup.com), Hetzner, STRATO, IONOS, all-inkl – offizielle Tarifseiten & Webhosting-Vergleich
- Static-Hosting-Vergleich (GitHub Pages, Netlify, Vercel, Cloudflare Pages)
- Shopware/WooCommerce-Kostenanalysen (Ostend Digital, Qualimero, HostPress, Raidboxes)
