# Hands of Hope – Website

Statische Website für [Hands of Hope gGmbH](https://handsofhope.de), gehostet auf GitHub Pages.

## Für das Team – Blog-Posts hinzufügen

→ **[BLOG_POST_ERSTELLEN.md](BLOG_POST_ERSTELLEN.md)**

Dort steht der Prompt für Claude (Entwurf erstellen + veröffentlichen) sowie eine Übersicht aller verfügbaren Blog-Komponenten.

## Projektstruktur

```
handsofhope/
├── index.html              # Startseite
├── components/             # Referenz-Kopien (nicht aktiv – siehe scripts/includes.js)
│   ├── header.html
│   └── footer.html
├── styles/                 # CSS-Dateien
│   ├── main.css            # Design-Tokens, Reset, Basis
│   ├── navigation.css      # Navigation
│   ├── layout.css          # Raster-Utilities
│   ├── typography.css      # Schrift & Typografie
│   ├── sections.css        # Section-Layouts
│   ├── forms.css           # Formulare
│   ├── gallery.css         # Galerie & Lightbox
│   └── responsive.css      # Responsive Breakpoints
├── scripts/                # JavaScript-Dateien
│   ├── includes.js         # Header/Footer als Template-Strings (kein fetch nötig)
│   ├── navigation.js       # Nav-Interaktionen
│   ├── animations.js       # Scroll-Reveal
│   ├── lazyload.js         # Lazy Loading
│   └── gallery.js          # Galerie-Funktionen
├── assets/                 # Statische Dateien
│   ├── logos/
│   ├── icons/
│   ├── fonts/
│   └── global/
│
├── rehabilitation/         # Unterseite Rehabilitation (One-Pager)
│   └── index.html
├── dienstleistungen/       # Unterseite Dienstleistungen (One-Pager)
│   └── index.html
├── strassencafe/           # Unterseite Straßencafé (One-Pager)
│   └── index.html
├── praevention/            # Unterseite Prävention (One-Pager)
│   └── index.html
│
├── ueber-uns/              # One-Pager mit Anker-Sektionen
│   ├── index.html          #   #wer-wir-sind · #team · #geschichte · #mitarbeiten
│   │                       #   (team/, geschichte/, mitarbeiten/ sind KEINE Unterordner)
│   ├── jobs/               # Stellenangebote-Übersicht + Einzelstellen
│   │   ├── index.html
│   │   ├── hausmeister/
│   │   │   └── index.html
│   │   ├── sozialarbeiter/
│   │   │   └── index.html
│   │   └── hauswirtschaft/
│   │       └── index.html
│   ├── spenden/            # Eigenständige Seite
│   │   └── index.html
│   └── kontakt/            # Eigenständige Seite
│       └── index.html
│
├── blog/
│   ├── index.html              # Übersicht (auto-generiert aus posts.js)
│   ├── posts.js                # Zentrale Post-Registry – hier neuen Post eintragen
│   ├── demo-alle-komponenten/  # Internes Referenz-Beispiel (noindex)
│   ├── mikes-geschichte/
│   ├── schulprojekt-neunkirchen/
│   └── donnerstag-fuer-donnerstag/
│
├── downloads/
├── impressum.html
├── datenschutz.html
├── robots.txt
├── sitemap.xml
└── CNAME                   # Eigene Domain (nach Migration)
```

### Navigation – Über uns (Anker-Struktur)

Die Dropdown-Links zeigen auf Sektionen des One-Pagers:

| Menüpunkt     | Ziel                           |
|---------------|-------------------------------|
| Wer wir sind  | `ueber-uns/#wer-wir-sind`     |
| Team          | `ueber-uns/#team`             |
| Geschichte    | `ueber-uns/#geschichte`       |
| Mitarbeiten   | `ueber-uns/#mitarbeiten`      |
| Stellenangebote | `ueber-uns/jobs/`           |
| Blog          | `blog/`                       |

## Lokale Entwicklung

Die Seite funktioniert direkt per **Doppelklick auf `index.html`** – kein lokaler Server nötig.

`scripts/includes.js` bettet Header und Footer als JavaScript-Template-Strings ein (kein `fetch()`). Pfade werden automatisch zur jeweiligen Seitentiefe angepasst.

### Header / Footer ändern
Alles in **`scripts/includes.js`** – die Funktionen `buildHeader()` und `buildFooter()`.
Die Dateien unter `components/` sind nur Lesbarkeits-Referenzen ohne Funktion.

## Domain-Migration

1. `CNAME`-Datei anlegen mit Inhalt: `handsofhope.de`
2. `robots.txt` Sitemap-URL aktualisieren
3. In GitHub Settings → Pages → Custom domain eintragen
4. DNS-Einträge beim Provider anpassen

## Bilder ersetzen

Alle Unsplash-Platzhalter durch eigene WebP-Bilder ersetzen:
- Max. 1200px breit für Hero, 800px für Cards
- Format: `.webp`
- Ablageort: jeweiliger Seitenordner (z.B. `rehabilitation/hero.webp`)

## Marke

### Markenarchitektur

| Ebene | Wer | Logo | Farbe |
|-------|-----|------|-------|
| Dachmarke | Hands of Hope · *living hope.* | `dachmarke-claim.webp` | Blau `#094684` |
| Arbeitsbereiche | Prävention · Rehabilitation · Wohngruppe | **kein eigenes** | Dachmarke |
| Eigenmarken | Straßencafé | `strassencafe.webp` | Rot `#781e00` |
| Eigenmarken | Hands of Hope Dienstleistungen | `dienstleistungen.webp` | Grün `#009d06` |

Die Arbeitsbereiche werden nicht über eine eigene Farbe, sondern über den
**Handschrift-Kicker** (Gochi Hand) im Hero benannt.

### Farb-Tokens

| Variable | Wert | Verwendung |
|----------|------|------------|
| `--blau` | `#094684` | Dachmarke |
| `--blau-dunkel` | `#06305c` | Footer, Hover |
| `--rot` | `#781e00` | Straßencafé |
| `--gruen` | `#009d06` | Dienstleistungen – Logo und Akzent |
| `--gruen-tief` | `#00871a` | Dienstleistungen – Flächen mit Text |
| `--dark` | `#052937` | Neutrales Dunkel |
| `--text` / `--text-light` | `#1a2a38` / `#4a5e6e` | Fließtext |

Weiß auf dem reinen Markengrün erreicht nur 3,6:1 und genügt damit nicht für
Fließtext. Textflächen nutzen deshalb `--gruen-tief` (4,7:1).

### Theming pro Seite

```html
<body data-brand="strassencafe">   <!-- oder dienstleistungen, sonst weglassen -->
```

Das setzt `--brand`, `--brand-flaeche`, `--brand-dunkel`, `--brand-hell` und
`--brand-zart` für die ganze Seite. Navigation, Hero, Buttons, Kicker und Footer
lesen nur noch diese Tokens – und `scripts/includes.js` wählt daraus auch das
passende Logo.

### Logos neu bauen

```bash
pip install pillow
python3 tools/build-logos.py
```

Leitet die komplette Logofamilie aus `assets/logos/handsofhope-logo.webp` ab
(Flamme freistellen, einfärben, Schriftzüge setzen). Die Schriften dafür liegen
in `tools/fonts/`.

## Schriften

| Token | Schrift | Verwendung |
|-------|---------|------------|
| `--font-head` | Nunito (800/900) | Headlines, Navigation, Buttons, Wortmarke |
| `--font-body` | Nunito Sans | Fließtext |
| `--font-hand` | Gochi Hand | Kicker, Claim, Arbeitsbereiche, Footer-Spalten |

## Hero

50/50-Split: links die Markenfarbe mit Kicker, Headline und Pill-Button, rechts
das Foto – **ungedimmt, ohne Overlay**. Auf dem Smartphone stapelt sich der Hero:
Foto oben (38svh), Farbfläche darunter.

Der Burger rechts in der Leiste ist auf **allen** Bildschirmgrößen sichtbar und
öffnet ein Vollbild-Menü mit der kompletten Seitenstruktur.
