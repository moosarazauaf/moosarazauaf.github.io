"""Build the social share card and the icon set.

The share card is what a supervisor sees before they see the site: it is what
renders when the link is pasted into an email, LinkedIn, Slack or WhatsApp.
Without it those clients show a bare URL, which reads as a link to nothing.

1200x630 is the size every major client crops to. The plate behind the text is
the same Lahore land-change export the hero uses, so the card is the actual work
rather than a stock graphic.

Usage:  python scripts/build_share_assets.py
"""

import os

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
IMG = os.path.join(REPO, "assets", "img")

PLATE = os.path.join(IMG, "hero-lahore.jpg")
PHOTO = os.path.join(IMG, "profile.jpg")
OUT_CARD = os.path.join(IMG, "share-card.jpg")
OUT_TOUCH = os.path.join(IMG, "icon-180.png")

W, H = 1200, 630

FOREST_DEEP = (22, 38, 31)
FOREST = (36, 62, 54)
PAPER = (241, 247, 237)
MEADOW = (224, 238, 198)
SAGE_BRIGHT = (157, 196, 163)

FONTS = "C:/Windows/Fonts"


def font(name, size):
    """Georgia for display and Segoe for the rest, matching the site. Falls back
    to Pillow's built-in face rather than dying on a machine without them."""
    try:
        return ImageFont.truetype(os.path.join(FONTS, name), size)
    except OSError:
        return ImageFont.load_default()


def build_card():
    plate = Image.open(PLATE).convert("RGB")

    # Cover-crop to 1200x630 from the centre-right, which is where the exporter
    # puts the measured present. Same framing decision as the hero.
    scale = max(W / plate.width, H / plate.height)
    plate = plate.resize((int(plate.width * scale), int(plate.height * scale)), Image.LANCZOS)
    left = int((plate.width - W) * 0.62)
    top = (plate.height - H) // 2
    card = plate.crop((left, top, left + W, top + H))

    card = ImageEnhance.Color(card).enhance(0.9)

    # The same two-layer scrim the hero uses: a colour bed plus a ramp that
    # deepens toward the type. Text over imagery needs a controlled ground.
    scrim = Image.new("RGB", (W, H), FOREST_DEEP)
    mask = Image.new("L", (W, H))
    md = ImageDraw.Draw(mask)
    for y in range(H):
        k = y / H
        md.line([(0, y), (W, y)], fill=int(90 + 120 * k))
    card = Image.composite(scrim, card, mask)

    # A darker wedge under the text block on the left, so the name holds its
    # contrast wherever the map happens to be bright.
    wedge = Image.new("L", (W, H), 0)
    wd = ImageDraw.Draw(wedge)
    for x in range(W):
        wd.line([(x, 0), (x, H)], fill=max(0, int(150 - 150 * (x / (W * 0.78)))))
    card = Image.composite(Image.new("RGB", (W, H), FOREST_DEEP), card, wedge)

    d = ImageDraw.Draw(card)
    x = 76

    d.text((x, 96), "SEEKING A PHD POSITION FOR 2026/27",
           font=font("segoeuib.ttf", 21), fill=MEADOW)

    # Sized so the surname clears the headshot circle on the right.
    d.text((x, 156), "Muhammad Moosa Raza", font=font("georgiab.ttf", 63), fill=PAPER)
    d.text((x, 240), "Earth Observation Researcher", font=font("segoeui.ttf", 32),
           fill=SAGE_BRIGHT)

    d.line([(x, 312), (x + 92, 312)], fill=MEADOW, width=3)

    body = font("segoeui.ttf", 26)
    for i, line in enumerate([
        "Remote sensing for floods, drought and land change,",
        "built so the numbers can be checked.",
    ]):
        d.text((x, 348 + i * 38), line, font=body, fill=(214, 228, 214))

    small = font("segoeui.ttf", 23)
    d.text((x, 468), "12 open studies   ·   Pakistan   ·   code and data released",
           font=small, fill=SAGE_BRIGHT)
    d.text((x, 520), "moosarazauaf.github.io", font=font("segoeuib.ttf", 25), fill=PAPER)

    # Headshot, circular, on the right where the wedge has faded out.
    size = 208
    photo = Image.open(PHOTO).convert("RGB")
    s = max(size / photo.width, size / photo.height)
    photo = photo.resize((int(photo.width * s), int(photo.height * s)), Image.LANCZOS)
    pl = (photo.width - size) // 2
    pt = (photo.height - size) // 2
    photo = photo.crop((pl, pt, pl + size, pt + size))

    circle = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(circle).ellipse((0, 0, size * 4, size * 4), fill=255)
    circle = circle.resize((size, size), Image.LANCZOS)

    px, py = W - size - 86, (H - size) // 2
    ring = Image.new("L", (size + 12, size + 12), 0)
    ImageDraw.Draw(ring).ellipse((0, 0, size + 11, size + 11), fill=255)
    card.paste(Image.new("RGB", (size + 12, size + 12), MEADOW), (px - 6, py - 6), ring)
    card.paste(photo, (px, py), circle)

    card.save(OUT_CARD, quality=86, optimize=True, progressive=True)
    print(f"share-card.jpg  {os.path.getsize(OUT_CARD) / 1024:.0f} KB")


def build_touch_icon():
    """180x180 for iOS home screens. A monogram, because a photograph is mud at
    icon sizes and the tab strip is where a supervisor finds the page again."""
    s = 180
    icon = Image.new("RGB", (s * 4, s * 4), FOREST)
    d = ImageDraw.Draw(icon)
    f = font("georgiab.ttf", 330)
    text = "MR"
    box = d.textbbox((0, 0), text, font=f)
    d.text(((s * 4 - box[2] + box[0]) / 2 - box[0], (s * 4 - box[3] + box[1]) / 2 - box[1] - 10),
           text, font=f, fill=PAPER)
    icon = icon.resize((s, s), Image.LANCZOS).filter(ImageFilter.SHARPEN)
    icon.save(OUT_TOUCH, optimize=True)
    print(f"icon-180.png    {os.path.getsize(OUT_TOUCH) / 1024:.0f} KB")


if __name__ == "__main__":
    build_card()
    build_touch_icon()
