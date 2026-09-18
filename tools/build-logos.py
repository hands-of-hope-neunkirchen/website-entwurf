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


def main():
    src = Image.open(SRC).convert("RGBA")

    flame = src.crop(mask_bbox(src, (0, 0, SPLIT_X, src.height)))
    word = src.crop(mask_bbox(src, (SPLIT_X, 0, src.width, src.height)))

    # Versalhöhe aus dem "H" der Wortmarke – Bezugsmaß für alle gesetzten Zeilen.
    cap_h = mask_bbox(src, (752, 0, 976, src.height))[3] - mask_bbox(src, (752, 0, 976, src.height))[1]
    gap = round(flame.width * 0.42)          # Abstand Flamme ↔ Schrift wie im Original
    print(f"Flamme {flame.width}x{flame.height} · Wortmarke {word.width}x{word.height} · Versalhöhe {cap_h}")

    nunito_black = FONTS / "Nunito_wght_900.ttf"
    nunito_semi = FONTS / "Nunito_wght_600.ttf"
    hand = FONTS / "Gochi_Hand.ttf"

    print("\nFlammen & Wortmarken:")
    for name, col in [("blau", BLAU), ("rot", ROT), ("gruen", GRUEN), ("weiss", WEISS)]:
        save(tint(flame, col), f"flamme-{name}")

    print("\nDachmarke:")
    for name, col in [("", BLAU), ("-weiss", WEISS)]:
        f, w = tint(flame, col), tint(word, col)
        y = (max(f.height, w.height) - w.height) // 2
        save(compose([(f, 0, 0), (w, f.width + gap, y)]), f"dachmarke{name}")

    print("\nDachmarke mit Claim:")
    claim_font = fit_font(hand, "living hope.", round(cap_h * 0.52))
    for name, col in [("", BLAU), ("-weiss", WEISS)]:
        f, w = tint(flame, col), tint(word, col)
        claim = text_layer("living hope.", claim_font, col)
        block_h = w.height + round(cap_h * 0.30) + claim.height
        top = (f.height - block_h) // 2
        save(compose([
            (f, 0, 0),
            (w, f.width + gap, top),
            (claim, f.width + gap + w.width - claim.width, top + w.height + round(cap_h * 0.30)),
        ]), f"dachmarke-claim{name}")

    print("\nStraßencafé:")
    cafe_font = fit_font(nunito_black, "Straßencafé", cap_h)
    for name, col in [("", ROT), ("-weiss", WEISS)]:
        f = tint(flame, col)
        t = text_layer("Straßencafé", cafe_font, col)
        save(compose([(f, 0, 0), (t, f.width + gap, (f.height - t.height) // 2)]), f"strassencafe{name}")

    print("\nDienstleistungen:")
    line1_font = fit_font(nunito_black, "Hands of Hope", round(cap_h * 0.74))
    line2_font = fit_font(nunito_semi, "Dienstleistungen", round(cap_h * 0.74))
    for name, col in [("", GRUEN), ("-weiss", WEISS)]:
        f = tint(flame, col)
        l1 = text_layer("Hands of Hope", line1_font, col)
        l2 = text_layer("Dienstleistungen", line2_font, col)
        lead = round(cap_h * 0.34)
        block_h = l1.height + lead + l2.height
        top = (f.height - block_h) // 2
        save(compose([
            (f, 0, 0),
            (l1, f.width + gap, top),
            (l2, f.width + gap, top + l1.height + lead),
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
