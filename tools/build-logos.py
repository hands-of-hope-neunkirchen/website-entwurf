#!/usr/bin/env python3
"""
Baut die Logofamilie der Markenarchitektur aus dem Original-Logo.

Quelle: assets/logos/handsofhope-logo.webp (3308x887, Flamme + Wortmarke, mit Alphakanal)
Ziel:   assets/logos/*.webp

    pip install pillow
    python3 tools/build-logos.py

Die Wortmarke ist Nunito Black; "Straßencafé" und "Dienstleistungen" werden
deshalb in Nunito gesetzt, der Claim und die Arbeitsbereiche in Gochi Hand.
Beide Schriften liegen unter tools/fonts/ und stehen unter der SIL Open Font
License 1.1.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets/logos/handsofhope-logo.webp"
OUT = ROOT / "assets/logos"
FONTS = Path(__file__).resolve().parent / "fonts"

BLAU = (9, 70, 132)
ROT = (120, 30, 0)
GRUEN = (0, 157, 6)
WEISS = (255, 255, 255)

# Die Flamme liegt links von dieser Spalte, die Wortmarke rechts davon.
SPLIT_X = 700


def mask_bbox(img, box=None):
    """Alpha-Bounding-Box, optional innerhalb eines Ausschnitts."""
    a = img.getchannel("A")
    if box:
        a = a.crop(box)
    bb = a.getbbox()
    if box and bb:
        return (bb[0] + box[0], bb[1] + box[1], bb[2] + box[0], bb[3] + box[1])
    return bb


def tint(img, color):
    """Färbt eine Grafik flächig um und behält die Kantenglättung bei."""
    solid = Image.new("RGBA", img.size, color + (0,))
    solid.putalpha(img.getchannel("A"))
    return solid


def text_layer(text, font, color):
    d = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    box = d.textbbox((0, 0), text, font=font)
    layer = Image.new("RGBA", (box[2] - box[0] + 4, box[3] - box[1] + 4), (0, 0, 0, 0))
    ImageDraw.Draw(layer).text((-box[0] + 2, -box[1] + 2), text, font=font, fill=color + (255,))
    return layer.crop(layer.getbbox())


def fit_font(path, text, target_height):
    """Sucht die Schriftgröße, bei der die Versalhöhe target_height entspricht."""
    size = 10
    while size < 900:
        f = ImageFont.truetype(str(path), size)
        h = text_layer(text, f, (0, 0, 0)).height
        if h >= target_height:
            return f
        size += 2
    return ImageFont.truetype(str(path), size)


def baseline_layer(text, font, color):
    """Rendert Text auf eine Fläche, deren Oberkante die Textoberkante ist.

    Anders als text_layer wird hier *nicht* auf die Tinte beschnitten: Die
    Fläche reicht immer von der Oberlänge bis zur Unterlänge der Schrift.
    Dadurch sitzt die Grundlinie bei jedem Wort an derselben Stelle – egal ob
    es Unterlängen hat ("living hope.") oder nicht ("Rehabilitation").
    """
    ascent, descent = font.getmetrics()
    d = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    box = d.textbbox((0, 0), text, font=font)
    layer = Image.new("RGBA", (box[2] + 4, ascent + descent), (0, 0, 0, 0))
    ImageDraw.Draw(layer).text((0, 0), text, font=font, fill=color + (255,))
    # Waagerecht auf die Tinte beschneiden, senkrecht die Metrik behalten.
    ink = layer.getbbox()
    return layer.crop((ink[0], 0, ink[2], layer.height))


def compose(parts, pad=0):
    """Setzt (bild, x, y)-Tupel auf eine transparente Fläche."""
    w = max(x + p.width for p, x, y in parts) + pad * 2
    h = max(y + p.height for p, x, y in parts) + pad * 2
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    for p, x, y in parts:
        canvas.alpha_composite(p, (x + pad, y + pad))
    return canvas


def save(img, name):
    path = OUT / f"{name}.webp"
    img.save(path, "WEBP", lossless=True, quality=100, method=6)
    print(f"  {path.relative_to(ROOT)}  {img.width}x{img.height}  {path.stat().st_size // 1024} KB")


# Geometrie der Sperrungen, abgemessen am Markenarchitektur-Blatt des Entwurfs.
# Alle Werte als Faktor der Flammenhöhe (H) bzw. Flammenbreite (B) – dadurch
# auflösungsunabhängig und gegen die Vorlage nachrechenbar.
#
# Der Unterschied ist beabsichtigt: Bei den Eigenmarken sitzt der Schriftzug
# mittig auf der Flamme, bei der Dachmarke nur die Wortmarke – der Claim hängt
# darunter und ragt unter die Flamme hinaus.
MASSE = {
    "dachmarke": {
        "abstand": 0.426,        # × B, Flamme → Schrift
        "wortmarke_mitte": 0.06,  # × H, Versalkasten unter der Flammenmitte
        "claim_hoehe": 0.451,     # × H
        "claim_abstand": 0.079,   # × Versalhöhe, unter der Wortmarken-Unterkante
    },
    "strassencafe": {
        "abstand": 0.323,
        "schrift_hoehe": 0.530,   # × H
        "mitte": 0.018,           # × H, Versatz unter der Flammenmitte
    },
    "dienstleistungen": {
        "abstand": 0.548,
        "zeile1_hoehe": 0.476,    # × H
        "zeile2_hoehe": 0.415,    # × H
        "mitte": 0.049,
    },
}


def main():
    src = Image.open(SRC).convert("RGBA")

    flame = src.crop(mask_bbox(src, (0, 0, SPLIT_X, src.height)))
    word = src.crop(mask_bbox(src, (SPLIT_X, 0, src.width, src.height)))
    FH, FB = flame.height, flame.width

    # Versalkasten der Wortmarke aus dem "H" – Bezugsmaß für die Dachmarke.
    h_box = mask_bbox(src, (752, 0, 976, src.height))
    cap_h = h_box[3] - h_box[1]
    word_box = mask_bbox(src, (SPLIT_X, 0, src.width, src.height))
    # Wie weit der Versalkasten innerhalb der Wortmarken-Grafik oben beginnt
    cap_offset = h_box[1] - word_box[1]

    print(f"Flamme {FB}x{FH} · Wortmarke {word.width}x{word.height} · Versalhöhe {cap_h}")

    nunito_black = FONTS / "Nunito_wght_900.ttf"
    nunito_semi = FONTS / "Nunito_wght_600.ttf"
    hand = FONTS / "Gochi_Hand.ttf"

    print("\nFlammen & Wortmarken:")
    for name, col in [("blau", BLAU), ("rot", ROT), ("gruen", GRUEN), ("weiss", WEISS)]:
        save(tint(flame, col), f"flamme-{name}")

    # ── Dachmarke ──
    # Der Versalkasten sitzt auf der Flammenmitte, leicht nach unten versetzt.
    m = MASSE["dachmarke"]
    abstand = round(FB * m["abstand"])
    wort_oben = round(FH / 2 + FH * m["wortmarke_mitte"] - cap_h / 2 - cap_offset)

    print("\nDachmarke:")
    for name, col in [("", BLAU), ("-weiss", WEISS)]:
        f, w = tint(flame, col), tint(word, col)
        save(compose([(f, 0, 0), (w, FB + abstand, wort_oben)]), f"dachmarke{name}")

    # ── Dachmarke mit Schriftzug ──
    # Dieselbe Sperrung trägt den Claim der Dachmarke und die Schriftzüge der
    # Arbeitsbereiche. Drei Dinge halten die Familie zusammen:
    #
    #   1. Eine gemeinsame Schriftgröße, abgeleitet aus dem Claim. Würde jedes
    #      Wort einzeln auf dieselbe Gesamthöhe skaliert, bekäme ein Wort ohne
    #      Unterlänge ("Rehabilitation") größere Buchstaben als eines mit
    #      ("living hope.").
    #   2. Die Grundlinie statt der Tintenoberkante als Bezug – dafür sorgt
    #      baseline_layer.
    #   3. Eine gemeinsame Leinwandhöhe, damit das Logo beim Seitenwechsel
    #      nicht in der Größe springt.
    claim_font = fit_font(hand, "living hope.", round(FH * m["claim_hoehe"]))
    claim_luft = round(cap_h * m["claim_abstand"])
    # claim_luft ist der Abstand von der Wortmarken-Unterkante zur *Tinte* des
    # Claims. baseline_layer liefert die Fläche ab dem Textursprung, der über
    # der Tinte liegt – um diesen Betrag wird zurückgesetzt. Bezug ist immer
    # der Claim, damit die Grundlinie für alle Schriftzüge dieselbe bleibt.
    _d = ImageDraw.Draw(Image.new("RGBA", (1, 1)))
    ref_tinte_oben = _d.textbbox((0, 0), "living hope.", font=claim_font)[1]
    schrift_oben = wort_oben + word.height + claim_luft - ref_tinte_oben

    def sperrung(text, col, leinwand_h=None):
        f, w = tint(flame, col), tint(word, col)
        t = baseline_layer(text, claim_font, col)
        bild = compose([
            (f, 0, 0),
            (w, FB + abstand, wort_oben),
            (t, FB + abstand + w.width - t.width, schrift_oben),
        ])
        # Auf die Tinte beschneiden – sonst trägt jedes Bild die ungenutzte
        # Unterlänge der Schrift als Leerraum mit.
        bild = bild.crop(bild.getbbox())
        if leinwand_h and bild.height < leinwand_h:
            voll = Image.new("RGBA", (bild.width, leinwand_h), (0, 0, 0, 0))
            voll.alpha_composite(bild, (0, 0))
            bild = voll
        return bild

    # Der Claim gibt die Referenzhöhe der ganzen Familie vor; die
    # Arbeitsbereiche ohne Unterlänge werden darauf aufgefüllt.
    leinwand_h = sperrung("living hope.", BLAU).height

    for titel, datei, text in [
        ("Dachmarke mit Claim", "dachmarke-claim", "living hope."),
        ("Prävention", "praevention", "Prävention"),
        ("Rehabilitation", "rehabilitation", "Rehabilitation"),
    ]:
        print(f"\n{titel}:")
        for suffix, col in [("", BLAU), ("-weiss", WEISS)]:
            save(sperrung(text, col, leinwand_h), f"{datei}{suffix}")

    # ── Straßencafé ──
    m = MASSE["strassencafe"]
    abstand = round(FB * m["abstand"])
    cafe_font = fit_font(nunito_black, "Straßencafé", round(FH * m["schrift_hoehe"]))

    print("\nStraßencafé:")
    for name, col in [("", ROT), ("-weiss", WEISS)]:
        f = tint(flame, col)
        t = text_layer("Straßencafé", cafe_font, col)
        oben = round(FH / 2 + FH * m["mitte"] - t.height / 2)
        save(compose([(f, 0, 0), (t, FB + abstand, oben)]), f"strassencafe{name}")

    # ── Dienstleistungen ──
    # Zwei unterschiedlich große Zeilen wie in der Vorlage.
    m = MASSE["dienstleistungen"]
    abstand = round(FB * m["abstand"])
    line1_font = fit_font(nunito_black, "Hands of Hope", round(FH * m["zeile1_hoehe"]))
    line2_font = fit_font(nunito_semi, "Dienstleistungen", round(FH * m["zeile2_hoehe"]))

    print("\nDienstleistungen:")
    for name, col in [("", GRUEN), ("-weiss", WEISS)]:
        f = tint(flame, col)
        l1 = text_layer("Hands of Hope", line1_font, col)
        l2 = text_layer("Dienstleistungen", line2_font, col)
        lead = round(cap_h * 0.10)
        block_h = l1.height + lead + l2.height
        oben = round(FH / 2 + FH * m["mitte"] - block_h / 2)
        save(compose([
            (f, 0, 0),
            (l1, FB + abstand, oben),
            (l2, FB + abstand, oben + l1.height + lead),
        ]), f"dienstleistungen{name}")

    print("\nFavicon:")
    fav = tint(flame, BLAU)
    side = max(fav.size)
    sq = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    sq.alpha_composite(fav, ((side - fav.width) // 2, (side - fav.height) // 2))
    sq.resize((512, 512), Image.LANCZOS).save(OUT / "favicon-512.png")
    print(f"  assets/logos/favicon-512.png  512x512")


if __name__ == "__main__":
    main()
