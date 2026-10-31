#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANIMA — День 1 (Утро): генерация фоновых сцен в стиле вселенной.
Палитра: #2D1B4E / #1F4E3D / #D4A574 / #4A6FA5, glow, частицы, параллакс.
Выход: scenes/*.png (1080x1920) + particle.png.
"""
import math, random, os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

random.seed(42)
W, H = 1080, 1920
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "scenes")
os.makedirs(OUT, exist_ok=True)

PURPLE   = (45, 27, 78)
EMERALD  = (31, 78, 61)
GOLD     = (212, 165, 116)
FOG_BLUE = (74, 111, 165)
DARK     = (16, 10, 30)
MOTH     = (150, 150, 165)

def lerp(a, b, t): return a + (b - a) * t

def vgrad(c_top, c_bot):
    t = np.linspace(0, 1, H)[:, None, None]
    top = np.array(c_top, dtype=float)[None, None, :]
    bot = np.array(c_bot, dtype=float)[None, None, :]
    arr = top * (1 - t) + bot * t
    return Image.fromarray(arr.repeat(W, axis=1).astype(np.uint8), "RGB")

def radial_glow(size, color, peak=255, falloff=2.6):
    s = int(size)
    y, x = np.mgrid[0:s, 0:s]
    cx = cy = s / 2
    d = np.sqrt((x - cx) ** 2 + (y - cy) ** 2) / (s / 2)
    a = np.clip(peak * np.exp(-falloff * d * d * 3), 0, 255)
    g = np.zeros((s, s, 4), dtype=np.uint8)
    g[..., 0], g[..., 1], g[..., 2] = color
    g[..., 3] = a.astype(np.uint8)
    return Image.fromarray(g, "RGBA")

def paste_glow(img, glow, cx, cy, alpha_scale=1.0):
    if alpha_scale >= 1.0:
        layer = glow
    else:
        r, g, b, a = glow.split()
        a = a.point(lambda v: int(v * alpha_scale))
        layer = Image.merge("RGBA", (r, g, b, a))
    img.paste(layer, (int(cx - glow.width / 2), int(cy - glow.height / 2)), layer)

def glass_tree(draw, x, base_y, h, w, dim=0.55, leaf_glow=False):
    c_line = (int(lerp(90, 170, dim)), int(lerp(120, 200, dim)), int(lerp(160, 230, dim)))
    top_y = base_y - h
    draw.line([(x, base_y), (x, top_y)], fill=c_line + (140,), width=max(3, int(w * 0.09)))
    n_branch = 6
    for i in range(n_branch):
        t = 0.25 + 0.65 * i / max(1, n_branch - 1)
        by = base_y - h * t
        blen = w * (1.15 - t * 0.6) * random.uniform(0.8, 1.2)
        for side in (-1, 1):
            ex = x + side * blen
            ey = by - blen * random.uniform(0.35, 0.7)
            draw.line([(x, by), (ex, ey)], fill=c_line + (110,), width=max(2, int(w * 0.045)))
            if random.random() < 0.8:
                ls = random.uniform(9, 16)
                pts = [(ex, ey - ls), (ex + ls * .7, ey), (ex, ey + ls), (ex - ls * .7, ey)]
                lc = ((200, 230, 255, int(random.uniform(40, 110))) if not leaf_glow
                      else (255, 225, 160, int(random.uniform(70, 160))))
                draw.polygon(pts, fill=lc, outline=(220, 240, 255, 120))

def observer(draw, cx, cy, scale=1.0, eye_bright=1.0):
    """Наблюдатель: фигурка в плаще с капюшоном, светящиеся глаза."""
    s = scale
    body = (28, 18, 48, 255)
    trim = (212, 165, 116, 220)
    hw, hh = int(150 * s), int(300 * s)
    pts = []
    for i in range(25):
        t = i / 24
        ang = math.pi * (0.08 + 0.84 * t)
        pts.append((cx - hw * math.cos(ang) * (0.55 + 0.45 * t), cy - hh + hh * (t ** 1.35) * 1.02))
    pts += [(cx + hw * 0.55, cy), (cx - hw * 0.55, cy)]
    draw.polygon(pts, fill=body)
    hr = int(78 * s)
    draw.ellipse([cx - hr, cy - hh - int(20 * s), cx + hr, cy - hh + int(120 * s)], fill=(20, 14, 38, 255))
    draw.arc([cx - hr, cy - hh - int(20 * s), cx + hr, cy - hh + int(120 * s)], 180, 360, fill=trim, width=max(2, int(5 * s)))
    er = max(3, int(9 * s * eye_bright))
    ec = (255, 214, 140, int(160 + 95 * eye_bright))
    off = int(26 * s)
    ey = cy - hh + int(58 * s)
    for dx in (-off, off):
        draw.ellipse([cx + dx - er, ey - er, cx + dx + er, ey + er], fill=ec)
    return (cx, ey)

def lumen_flower(draw, cx, cy, stem_h, bright=1.0, radius=None):
    green = (31, 78, 61, 255)
    draw.line([(cx, cy), (cx, cy - stem_h)], fill=green, width=7)
    draw.ellipse([cx - 26, cy - stem_h * 0.55, cx - 4, cy - stem_h * 0.55 + 18], fill=green)
    draw.ellipse([cx + 4, cy - stem_h * 0.7, cx + 26, cy - stem_h * 0.7 + 18], fill=green)
    hy = cy - stem_h
    r = radius or 34
    gold_c = (int(lerp(120, 255, bright)), int(lerp(95, 200, bright)), int(lerp(70, 130, bright)))
    for i in range(6):
        ang = math.pi * 2 * i / 6 - math.pi / 2
        px = cx + math.cos(ang) * r * 0.75
        py = hy + math.sin(ang) * r * 0.55
        draw.ellipse([px - r * 0.5, py - r * 0.7, px + r * 0.5, py + r * 0.3],
                     fill=gold_c + (int(lerp(90, 230, bright)),))
    draw.ellipse([cx - r * 0.5, hy - r * 0.5, cx + r * 0.5, hy + r * 0.5],
                 fill=(255, 236, 190, int(lerp(60, 255, bright))))
    return (cx, hy)

def moth(draw, cx, cy, sc=1.0, alpha=170, tint=MOTH):
    wing = tint + (alpha,)
    bw, bh = int(26 * sc), int(16 * sc)
    draw.ellipse([cx - bw * 2, cy - bh, cx, cy + bh], fill=wing)
    draw.ellipse([cx, cy - bh, cx + bw * 2, cy + bh], fill=wing)
    draw.ellipse([cx - int(4 * sc), cy - int(12 * sc), cx + int(4 * sc), cy + int(12 * sc)],
                 fill=(90, 90, 105, alpha))

def fog_layers(img, strength=1.0, y0=0, y1=None):
    y1 = y1 or H
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for _ in range(14):
        yy = random.randint(y0, y1)
        ww = random.randint(500, 1400)
        hh = random.randint(60, 160)
        xx = random.randint(-200, W - 300)
        a = int(random.uniform(10, 34) * strength)
        d.ellipse([xx, yy, xx + ww, yy + hh], fill=(150, 170, 210, a))
    overlay = overlay.filter(ImageFilter.GaussianBlur(40))
    img.paste(overlay, (0, 0), overlay)

def save(img, name):
    img.convert("RGB").save(os.path.join(OUT, name))
    print("saved", name)

# ---------------- СПРАЙТ ЧАСТИЦЫ ----------------
radial_glow(64, (255, 220, 150), peak=255, falloff=1.4).save(os.path.join(OUT, "particle.png"))

# ---------------- СЦЕНА 1: ХУК — компас ----------------
img = vgrad((24, 16, 44), PURPLE).convert("RGBA")
d = ImageDraw.Draw(img, "RGBA")
for _ in range(9):
    glass_tree(d, random.randint(0, W), random.randint(1500, 1750), random.randint(500, 800), 90, dim=0.3)
fog_layers(img, 0.8, 900, 1700)
d = ImageDraw.Draw(img, "RGBA")
for x in (80, 260, 540, 820, 1000):
    glass_tree(d, x, random.randint(1780, 1900), random.randint(700, 1000), 150, dim=0.7)
observer(d, 540, 1620, 1.15, eye_bright=0.8)
save(img, "s1_bg.png")

comp = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
dc = ImageDraw.Draw(comp, "RGBA")
cx, cy, R = 540, 1150, 240
dc.ellipse([cx - R, cy - R, cx + R, cy + R], fill=(30, 22, 55, 235), outline=GOLD + (255,), width=8)
dc.ellipse([cx - R + 26, cy - R + 26, cx + R - 26, cy + R - 26], outline=(120, 140, 190, 160), width=3)
for i in range(24):
    a = math.pi * 2 * i / 24
    r1, r2 = (R - 40, R - 62) if i % 6 else (R - 40, R - 52)
    dc.line([(cx + r1 * math.cos(a), cy + r1 * math.sin(a)), (cx + r2 * math.cos(a), cy + r2 * math.sin(a))],
            fill=(200, 210, 235, 200), width=4)
comp.save(os.path.join(OUT, "s1_compass.png"))

needle = Image.new("RGBA", (360, 360), (0, 0, 0, 0))
nd = ImageDraw.Draw(needle, "RGBA")
nd.polygon([(180, 30), (196, 180), (164, 180)], fill=(225, 90, 80, 240))
nd.polygon([(180, 330), (196, 180), (164, 180)], fill=(215, 225, 245, 235))
nd.ellipse([168, 168, 192, 192], fill=GOLD + (255,))
needle.save(os.path.join(OUT, "s1_needle.png"))

# ---------------- СЦЕНА 2: МОТЫЛЬКИ К ЛЮМЕНАМ ----------------
img = vgrad(PURPLE, (34, 22, 60)).convert("RGBA")
d = ImageDraw.Draw(img, "RGBA")
for _ in range(6):
    glass_tree(d, random.randint(0, W), random.randint(1600, 1800), random.randint(600, 900), 110, dim=0.35)
fog_layers(img, 0.6, 1000, 1800)
d = ImageDraw.Draw(img, "RGBA")
flowers = [(170, 1750), (400, 1800), (700, 1780), (930, 1740), (540, 1860)]
for fx, fy in flowers:
    lumen_flower(d, fx, fy, random.randint(260, 380), bright=0.95)
sx, sy = 540, 1300
d.polygon([(sx - 170, sy), (sx - 120, sy - 210), (sx + 120, sy - 210), (sx + 170, sy)], fill=(28, 18, 48, 255))
d.ellipse([sx - 70, sy - 320, sx + 70, sy - 190], fill=(20, 14, 38, 255))
d.arc([sx - 70, sy - 320, sx + 70, sy - 190], 180, 360, fill=GOLD + (200,), width=5)
d.line([(sx - 110, sy - 60), (sx - 55, sy - 250)], fill=(28, 18, 48, 255), width=34)
d.line([(sx + 110, sy - 60), (sx + 55, sy - 250)], fill=(28, 18, 48, 255), width=34)
for (fx, fy) in flowers:
    for k in range(3):
        t = random.uniform(0.15, 0.85)
        mx = lerp(sx, fx, t) + random.randint(-50, 50)
        my = lerp(sy - 300, fy - 300, t) + random.randint(-40, 40)
        moth(d, mx, my, sc=random.uniform(0.7, 1.3), alpha=random.randint(120, 180))
save(img, "s2_bg.png")
for name, br in [("s2_lumen_bright.png", 1.0), ("s2_lumen_dim.png", 0.18)]:
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dl = ImageDraw.Draw(lay, "RGBA")
    for fx, fy in flowers:
        lumen_flower(dl, fx, fy, 300, bright=br)
    lay.save(os.path.join(OUT, name))

# ---------------- СЦЕНА 3: ЦВЕТЫ ТУСКНЕЮТ ----------------
img = vgrad((30, 20, 52), PURPLE).convert("RGBA")
d = ImageDraw.Draw(img, "RGBA")
for _ in range(6):
    glass_tree(d, random.randint(0, W), random.randint(1600, 1800), random.randint(600, 900), 110, dim=0.3)
fog_layers(img, 0.9, 800, 1800)
d = ImageDraw.Draw(img, "RGBA")
for fx, fy in [(170, 1750), (400, 1800), (700, 1780), (930, 1740)]:
    lumen_flower(d, fx, fy, 300, bright=0.15)
    moth(d, fx + random.randint(-25, 25), fy - 320, 1.1, 190)
    moth(d, fx + random.randint(-40, 40), fy - 260, 0.8, 150)
observer(d, 540, 1450, 1.0, eye_bright=0.35)
save(img, "s3_bg.png")

# ---------------- СЦЕНА 4: ГОЛОВА + ВКЛАДКИ ----------------
img = vgrad(DARK, (22, 14, 40)).convert("RGBA")
d = ImageDraw.Draw(img, "RGBA")
hx, hy, hr = 540, 1180, 430
d.ellipse([hx - hr, hy - hr, hx + hr, hy + hr], fill=(26, 18, 46, 255), outline=GOLD + (150,), width=6)
d.ellipse([hx - hr + 40, hy - hr + 40, hx + hr - 40, hy + hr - 40], outline=(90, 80, 140, 90), width=3)
tabs = []
for i in range(12):
    tx = hx - 300 + (i % 4) * 165 + random.randint(-12, 12)
    ty = hy - 260 + (i // 4) * 175 + random.randint(-12, 12)
    tw, th = 130, 105
    col = random.choice([GOLD, FOG_BLUE, (180, 120, 200)])
    a = random.randint(90, 200)
    d.rounded_rectangle([tx, ty, tx + tw, ty + th], radius=12, fill=col + (min(a, 70),), outline=col + (a,), width=3)
    d.line([(tx, ty + 26), (tx + tw, ty + 26)], fill=col + (a,), width=3)
    for k in range(3):
        d.ellipse([tx + 12 + k * 16, ty + 12, tx + 18 + k * 16, ty + 18], fill=col + (a,))
    d.line([(tx + 12, ty + 46), (tx + tw - 12, ty + 46)], fill=col + (max(a - 40, 0),), width=4)
    d.line([(tx + 12, ty + 66), (tx + tw - 30, ty + 66)], fill=col + (max(a - 60, 0),), width=4)
    tabs.append((tx + tw // 2, ty + th // 2))
ey = hy + 250
for dx in (-120, 120):
    d.arc([hx + dx - 60, ey - 25, hx + dx + 60, ey + 25], 20, 160, fill=GOLD + (200,), width=6)
save(img, "s4_bg.png")
gl = Image.new("RGBA", (W, H), (0, 0, 0, 0))
dg = ImageDraw.Draw(gl, "RGBA")
for (tx, ty) in tabs:
    dg.rounded_rectangle([tx - 75 + random.randint(-18, 18), ty - 62 + random.randint(-14, 14),
                          tx + 75, ty + 62], radius=12, outline=(255, 120, 120, 160), width=3)
    dg.rounded_rectangle([tx - 75, ty - 62, tx + 75 + random.randint(-18, 18), ty + 62], radius=12,
                         outline=(120, 220, 255, 160), width=3)
gl.save(os.path.join(OUT, "s4_glitch.png"))

# ---------------- СЦЕНА 5: БЛОКНОТ ----------------
img = vgrad((30, 22, 55), PURPLE).convert("RGBA")
d = ImageDraw.Draw(img, "RGBA")
for _ in range(6):
    glass_tree(d, random.randint(0, W), random.randint(1650, 1820), random.randint(600, 900), 110, dim=0.45)
fog_layers(img, 0.5, 1100, 1800)
d = ImageDraw.Draw(img, "RGBA")
for fx, fy in [(170, 1760), (930, 1750)]:
    lumen_flower(d, fx, fy, 300, bright=0.5)
sx, sy = 540, 1600
observer(d, sx, sy, 1.1, eye_bright=0.9)
bx, by = sx + 10, sy - 330
d.rounded_rectangle([bx - 90, by - 60, bx + 90, by + 70], radius=10, fill=(245, 235, 210, 255), outline=GOLD + (255,), width=5)
for ln in range(4):
    d.line([(bx - 70, by - 35 + ln * 26), (bx + 70 - random.randint(0, 40), by - 35 + ln * 26)], fill=(90, 70, 50, 200), width=3)
d.line([(bx - 90, by - 60), (bx - 90, by + 70)], fill=(120, 90, 60, 255), width=8)
save(img, "s5_bg.png")
nb = Image.new("RGBA", (W, H), (0, 0, 0, 0))
paste_glow(nb, radial_glow(500, GOLD, 150), bx, by)
nb.save(os.path.join(OUT, "s5_notebook_glow.png"))

# ---------------- СЦЕНА 6: РАСЦВЕТ ----------------
img = vgrad((36, 26, 66), (52, 34, 84)).convert("RGBA")
d = ImageDraw.Draw(img, "RGBA")
for _ in range(8):
    glass_tree(d, random.randint(0, W), random.randint(1600, 1850), random.randint(650, 950), 120, dim=0.8, leaf_glow=True)
fog_layers(img, 0.35, 1200, 1800)
d = ImageDraw.Draw(img, "RGBA")
flowers6 = [(150, 1770), (380, 1810), (700, 1790), (930, 1760), (540, 1860)]
for fx, fy in flowers6:
    lumen_flower(d, fx, fy, random.randint(280, 380), bright=1.0, radius=40)
observer(d, 540, 1560, 1.25, eye_bright=1.0)
save(img, "s6_bg.png")
lay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
dl = ImageDraw.Draw(lay, "RGBA")
for fx, fy in flowers6:
    lumen_flower(dl, fx, fy, 320, bright=1.0, radius=40)
lay.save(os.path.join(OUT, "s6_lumens.png"))

# ---------------- СЦЕНА 7: ЛУП (лицо + компас) ----------------
img = vgrad((26, 18, 48), PURPLE).convert("RGBA")
d = ImageDraw.Draw(img, "RGBA")
for x in (100, 350, 780, 1000):
    glass_tree(d, x, 1900, 900, 150, dim=0.4)
fog_layers(img, 0.5, 1300, 1850)
d = ImageDraw.Draw(img, "RGBA")
sx, sy = 540, 1350
observer(d, sx, sy, 1.6, eye_bright=0.85)
d.line([(sx, sy - 250), (540, 1060)], fill=(28, 18, 48, 255), width=40)
cx, cy, R = 540, 1000, 150
d.ellipse([cx - R, cy - R, cx + R, cy + R], fill=(30, 22, 55, 240), outline=GOLD + (255,), width=6)
for i in range(24):
    a = math.pi * 2 * i / 24
    d.line([(cx + (R - 24) * math.cos(a), cy + (R - 24) * math.sin(a)),
            (cx + (R - 38) * math.cos(a), cy + (R - 38) * math.sin(a))], fill=(200, 210, 235, 190), width=3)
save(img, "s7_bg.png")
needle.resize((225, 225)).save(os.path.join(OUT, "s7_needle.png"))

print("ALL SCENES DONE ->", OUT)
