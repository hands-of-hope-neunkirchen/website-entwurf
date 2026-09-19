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
│   ├── tabs.js             # Tastaturbedienbare Tabs (ARIA APG)
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
| Arbeitsbereich | Prävention | `praevention.webp` | **Dachmarke** |
| Arbeitsbereich | Rehabilitation | `rehabilitation.webp` | **Dachmarke** |
| Eigenmarke | Straßencafé | `strassencafe.webp` | Rot `#781e00` |
| Eigenmarke | Hands of Hope Dienstleistungen | `dienstleistungen.webp` | Grün `#009d06` |

**Die Unterscheidung liegt in der Farbe, nicht im Logo.** Die Arbeitsbereiche
tragen dieselbe Sperrung wie die Dachmarke – Flamme, Wortmarke und darunter
rechtsbündig der eigene Schriftzug in Gochi Hand an der Stelle des Claims –,
aber **keine eigene Farbe**. Nur die Eigenmarken haben eine.

Technisch heißt das: Für `data-brand="praevention"` und `"rehabilitation"` gibt
es in `styles/main.css` **bewusst keinen** `[data-brand='…']`-Block. `logoTag()`
findet den Eintrag in `LOGOS` und wählt die Sperrung, für die Farben greifen
mangels Theme-Block die `:root`-Werte der Dachmarke. Ein Theme-Block wäre hier
der Fehler.

Die vier Sperrungen der Dachmarken-Familie messen identisch 2951 × 765 px und
teilen `--logo-anteil: 0.658` – sonst springt das Logo beim Seitenwechsel in
der Größe.

### Wohngruppe gehört zur Rehabilitation

Die **Rehabilitation** ist der Oberbereich; die **Wohngruppe** (Waldstraße 6,
Neunkirchen) ist die Einrichtung darin und hat einen eigenen Abschnitt
`rehabilitation/#wohngruppe` – aber keinen eigenen Menüpunkt.

Nicht verwechseln: Die Wohngruppe besteht seit Jahren und trägt das laufende
Programm. Das **Nachsorgehaus** (`rehabilitation/#nachsorgehaus`) entsteht erst
und richtet sich an Absolventen nach dem Programm.

> Abweichung vom XD-Blatt „Markenarchitektur": Dort ist die Wohngruppe als
> dritter Arbeitsbereich neben Prävention und Rehabilitation geführt. Fachlich
> ist sie der Rehabilitation untergeordnet – die Website bildet das so ab.

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

Das setzt `--brand`, `--brand-flaeche`, `--brand-dunkel`, `--brand-hell`,
`--brand-zart` sowie die beiden Textstufen `--auf-brand` und `--auf-brand-leise`
für die ganze Seite. Navigation, Hero, Buttons, Kicker und Footer
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

Die Startseite trägt seit dem Markenumbau die Headline *„Hoffnung braucht
Hände."*. **„living hope." ist ausschließlich Claim** – es steht im Logo
(`dachmarke-claim.webp`) und im Seitentitel, nicht als Überschrift. Eine
Headline, die den Claim wiederholt, doppelt nur die Kopfzeile.

### Text auf der Markenfläche

Zwei Stufen statt beliebiger Deckkraftwerte: `--auf-brand` für Fließtext,
`--auf-brand-leise` für Feldbezeichner und Fußnoten. Auf Blau und Rot bleiben
beide über 4,5:1. Das Markengrün hat dafür keinen Spielraum – Weiß erreicht auf
`--gruen-tief` nur 4,7:1 –, deshalb laufen im Dienstleistungs-Theme **beide
Stufen auf volles Weiß**. Lesbarkeit vor Abstufung.

## Navigation

Die Leiste führt sieben Punkte: Über uns · Rehabilitation · Prävention ·
Dienstleistungen · Straßencafé · Blog · Medien. Unter 1100px reicht der Platz
dafür nicht mehr – dort übernimmt das Vollbild-Menü.

Der Burger rechts ist auf **allen** Bildschirmgrößen sichtbar und öffnet das
Vollbild-Menü mit der kompletten Seitenstruktur. **Spenden** steht nicht in der
Leiste, sondern als CTA im Vollbild-Menü und im Footer.
