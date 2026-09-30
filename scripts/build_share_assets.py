"""Build the social share card and the icon set, in the site's own identity.

The share card is what a supervisor sees before they see the site: it is what
renders when the link is pasted into an email, LinkedIn, Slack or WhatsApp.
Without it those clients show a bare URL, which reads as a link to nothing.

1200x630 is the size every major client crops to.

This mirrors the page it advertises: near-black ground, Archivo condensed for
the name, the claim broken across lines with the last one in gold, and the
orbit mark drawn rather than photographed. Change the design on the page and
this has to be rerun, because none of it is read from the CSS.

The typeface is fetched once into a gitignored cache rather than committed,
since the repo already ships the subset woff2 the site actually serves and a
second copy of the full TTF would be dead weight.

Usage:  python scripts/build_share_assets.py
"""

import os
import urllib.request

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
IMG = os.path.join(REPO, "public", "img")

PLATE = os.path.join(IMG, "hero-lahore.jpg")
PHOTO = os.path.join(IMG, "profile.jpg")
OUT_CARD = os.path.join(IMG, "share-card.jpg")
OUT_TOUCH = os.path.join(IMG, "icon-180.png")

FONT_CACHE = os.path.join(HERE, ".cache-archivo.ttf")
FONT_URL = ("https://github.com/google/fonts/raw/main/ofl/archivo/"
            "Archivo%5Bwdth,wght%5D.ttf")

W, H = 1200, 630

# The reskin palette, kept in step with assets/css/variables.css by hand.
GROUND = (11, 20, 16)        # --bg
INK = (241, 247, 237)        # --ink
INK_SOFT = (185, 203, 189)   # --ink-soft
GOLD = (212, 185, 72)        # --accent
SAGE = (124, 169, 130)


def font(size, weight=400, width=100):
    """Archivo is variable on weight and width, and the card uses both: the name
    is heavy and condensed, the labels are light and wide."""
    try:
        f = ImageFont.truetype(FONT_CACHE, size)
        try:
            # Archivo declares wght before wdth in its fvar table. Passing them
            # the other way round sets the weight to the width value, which
            # renders every line thin and stretched: worth checking against
            # get_variation_axes() rather than assuming alphabetical order.
            f.set_variation_by_axes([weight, width])
        except (AttributeError, OSError):
            pass  # Pillow without FreeType variation support: regular weight
        return f
    except OSError:
        return ImageFont.load_default()


def ensure_font():
    if not os.path.exists(FONT_CACHE):
        print("fetching Archivo ...")
        urllib.request.urlretrieve(FONT_URL, FONT_CACHE)


def draw_orbit(card):
    """The same mark the hero draws in SVG: a graticuled globe, an imaged swath
    and two inclined orbits with a satellite on the outer one. Drawn onto an
    oversized layer and downsampled, because PIL has no antialiasing of its own
    and a 1px orbit line would otherwise come out ragged."""
    S = 4
    size = 760 * S
    layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    c = size // 2
    r = 218 * S

    d.ellipse([c - r, c - r, c + r, c + r], fill=(26, 44, 36, 190))

    # graticule: parallels and meridians as nested ellipses
    for ry in (r * 0.30, r * 0.62):
        d.ellipse([c - r, c - ry, c + r, c + ry], outline=SAGE + (95,), width=2 * S)
    for rx in (r * 0.33, r * 0.68):
        d.ellipse([c - rx, c - r, c + rx, c + r], outline=SAGE + (95,), width=2 * S)
    d.line([c - r, c, c + r, c], fill=SAGE + (110,), width=2 * S)
    d.line([c, c - r, c, c + r], fill=SAGE + (110,), width=2 * S)
    d.ellipse([c - r, c - r, c + r, c + r], outline=SAGE + (150,), width=3 * S)

    # the imaged swath, clipped to the disc
    swath = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    sd = ImageDraw.Draw(swath)
    sd.rectangle([c - r * 1.6, c - r * 0.30, c + r * 1.6, c - r * 0.02],
                 fill=GOLD + (120,))
    swath = swath.rotate(-34, resample=Image.BICUBIC, center=(c, c))
    disc = Image.new("L", (size, size), 0)
    ImageDraw.Draw(disc).ellipse([c - r, c - r, c + r, c + r], fill=255)
    layer.paste(swath, (0, 0), Image.composite(swath.split()[-1], disc, disc))

    # two inclined orbits
    orb = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    od = ImageDraw.Draw(orb)
    od.ellipse([c - r * 1.52, c - r * 0.75, c + r * 1.52, c + r * 0.75],
               outline=GOLD + (215,), width=3 * S)
    orb = orb.rotate(24, resample=Image.BICUBIC, center=(c, c))
    layer.alpha_composite(orb)

    sat = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    sd2 = ImageDraw.Draw(sat)
    sx, sy = c + r * 1.52, c
    sd2.ellipse([sx - 34 * S, sy - 34 * S, sx + 34 * S, sy + 34 * S], fill=GOLD + (55,))
    sd2.ellipse([sx - 15 * S, sy - 15 * S, sx + 15 * S, sy + 15 * S], fill=GOLD + (255,))
    sat = sat.rotate(24, resample=Image.BICUBIC, center=(c, c))
    layer.alpha_composite(sat)

    layer = layer.resize((760, 760), Image.LANCZOS)
    card.paste(layer, (W - 560, (H - 760) // 2 + 40), layer)


def build_card():
    ensure_font()
    card = Image.new("RGB", (W, H), GROUND)

    # the Lahore plate as texture only, at the same weight the hero gives it
    plate = Image.open(PLATE).convert("RGB")
    scale = max(W / plate.width, H / plate.height)
    plate = plate.resize((int(plate.width * scale), int(plate.height * scale)), Image.LANCZOS)
    left = int((plate.width - W) * 0.62)
    top = (plate.height - H) // 2
    plate = plate.crop((left, top, left + W, top + H))
    plate = ImageEnhance.Color(plate).enhance(0.45)
    card = Image.blend(card, plate, 0.16)

    draw_orbit(card)

    # a wash back over the left half so the type keeps its ground
    wash = Image.new("L", (W, H), 0)
    wd = ImageDraw.Draw(wash)
    for x in range(W):
        wd.line([(x, 0), (x, H)], fill=max(0, int(248 - 248 * (x / (W * 0.72)))))
    card = Image.composite(Image.new("RGB", (W, H), GROUND), card, wash)

    d = ImageDraw.Draw(card)
    x = 72

    d.text((x, 86), "SEEKING A PHD POSITION FOR 2026/27",
           font=font(20, weight=700, width=112), fill=GOLD)

    d.text((x, 132), "MUHAMMAD MOOSA RAZA",
           font=font(58, weight=700, width=88), fill=INK)
    d.text((x, 202), "EARTH OBSERVATION RESEARCHER",
           font=font(21, weight=500, width=105), fill=INK_SOFT)

    claim = font(62, weight=800, width=84)
    d.text((x, 286), "Floods, drought", font=claim, fill=INK)
    d.text((x, 350), "and land change,", font=claim, fill=INK)
    d.text((x, 414), "measured properly.", font=claim, fill=GOLD)

    small = font(20, weight=600, width=108)
    d.text((x, 516), "12 OPEN STUDIES   ·   PAKISTAN   ·   CODE AND DATA RELEASED",
           font=small, fill=SAGE)
    d.text((x, 556), "moosarazauaf.github.io", font=font(22, weight=700, width=100), fill=INK)

    # headshot, small and square-cornered to match the reskin
    size = 118
    photo = Image.open(PHOTO).convert("RGB")
    s = max(size / photo.width, size / photo.height)
    photo = photo.resize((int(photo.width * s), int(photo.height * s)), Image.LANCZOS)
    pl = (photo.width - size) // 2
    pt = (photo.height - size) // 2
    photo = photo.crop((pl, pt, pl + size, pt + size))
    px, py = W - size - 72, H - size - 72
    card.paste(photo, (px, py))
    ImageDraw.Draw(card).rectangle([px - 1, py - 1, px + size, py + size],
                                   outline=GOLD, width=2)

    card.save(OUT_CARD, quality=86, optimize=True, progressive=True)
    print(f"share-card.jpg  {os.path.getsize(OUT_CARD) / 1024:.0f} KB")


def build_touch_icon():
    """180x180 for iOS home screens: the orbit ring around the initials, which
    is the smallest the mark can be drawn and still read as an orbit."""
    ensure_font()
    s, S = 180, 4
    icon = Image.new("RGB", (s * S, s * S), GROUND)
    d = ImageDraw.Draw(icon)
    c = s * S // 2
    r = int(s * S * 0.40)
    d.ellipse([c - r, c - int(r * 0.48), c + r, c + int(r * 0.48)],
              outline=GOLD, width=5 * S)
    f = font(150 * S, weight=800, width=88)
    box = d.textbbox((0, 0), "MR", font=f)
    d.text((c - (box[2] - box[0]) / 2 - box[0], c - (box[3] - box[1]) / 2 - box[1]),
           "MR", font=f, fill=INK)
    icon = icon.resize((s, s), Image.LANCZOS).filter(ImageFilter.SHARPEN)
    icon.save(OUT_TOUCH, optimize=True)
    print(f"icon-180.png    {os.path.getsize(OUT_TOUCH) / 1024:.0f} KB")


if __name__ == "__main__":
    build_card()
    build_touch_icon()
