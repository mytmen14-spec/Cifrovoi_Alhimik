#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANIMA День 1 — моушн-рендер. 30 fps, 1080x1920, ~48 сек loop.
Пишет кадры в frames/ для сборки ffmpeg.
"""
import math, random, os, sys
from PIL import Image, ImageDraw, ImageFilter, ImageFont

random.seed(7)
W, H = 1080, 1920
FPS = 30
DUR = 48.0
TOTAL = int(DUR * FPS)
HERE = os.path.dirname(os.path.abspath(__file__))
SCENES = os.path.join(HERE, "scenes")
FRAMES = os.path.join(HERE, "frames")
os.makedirs(FRAMES, exist_ok=True)

GOLD = (212, 165, 116)
WHITE = (240, 235, 250)

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
def font(sz):
    return ImageFont.truetype(FONT_BOLD, sz)

def load(name):
    return Image.open(os.path.join(SCENES, name)).convert("RGBA")

BG = {i: load(f"s{i}_bg.png") for i in range(1, 8)}
COMPASS = load("s1_compass.png")
NEEDLE = load("s1_needle.png")
NEEDLE2 = load("s7_needle.png")
LUM_BRIGHT = load("s2_lumen_bright.png")
LUM_DIM = load("s2_lumen_dim.png")
GLITCH = load("s4_glitch.png")
NB_GLOW = load("s5_notebook_glow.png")
S6_LUM = load("s6_lumens.png")
PARTICLE = load("particle.png")
MOTHSPRITE = None  # рисуем процедурно

def clamp(v, a, b): return max(a, min(b, v))
def lerp2(a, b, t): return a + (b - a) * t
def smooth(t):  # 0..1 -> ease
    t = clamp(t, 0, 1)
    return t * t * (3 - 2 * t)
def ease_out(t):
    t = clamp(t, 0, 1)
    return 1 - (1 - t) ** 3

# пре-рендер частиц в цветах с альфой (быстрее, чем на каждый кадр)
PART_CACHE = {}
def part_spr(color, size):
    key = (color, size)
    if key not in PART_CACHE:
        base = Image.new("RGBA", (size, size), color + (0,))
        src = PARTICLE.resize((size, size))
        base.putalpha(src.split()[3])
        PART_CACHE[key] = base
    return PART_CACHE[key]

def zoompan(bg, cx, cy, z, dx=0.0, dy=0.0):
    """Кадрирование с зумом: возвращает 1080x1920."""
    z = max(z, 1.0)
    vw, vh = W / z, H / z
    x = clamp(cx - vw / 2 + dx, 0, W - vw)
    y = clamp(cy - vh / 2 + dy, 0, H - vh)
    img = bg.crop((int(x), int(y), int(x + vw), int(y + vh)))
    return img.resize((W, H), Image.BILINEAR)

def tint(img, color, amount):
    """Наложение цвета (multiply-ish через blend)."""
    ov = Image.new("RGBA", img.size, color + (int(amount * 255),))
    out = Image.alpha_composite(img.convert("RGBA"), ov)
    return out

def draw_moth(d, x, y, sc, flap, alpha, tilt=0.0):
    wing_w = 26 * sc * abs(math.cos(flap)) + 6 * sc
    wing_h = 15 * sc
    col = (150, 150, 168, alpha)
    body = (95, 95, 112, alpha)
    d.ellipse([x - wing_w * 2, y - wing_h, x, y + wing_h], fill=col)
    d.ellipse([x, y - wing_h, x + wing_w * 2, y + wing_h], fill=col)
    d.ellipse([x - 4 * sc, y - 12 * sc, x + 4 * sc, y + 12 * sc], fill=body)

class Particles:
    def __init__(self, n, region=(0, 0, W, H), speed=30, colors=None):
        self.items = []
        colors = colors or [(255, 220, 150)]
        for _ in range(n):
            self.items.append(dict(
                x=random.uniform(region[0], region[2]),
                y=random.uniform(region[1], region[3]),
                vx=random.uniform(-speed, speed) * 0.3,
                vy=random.uniform(-speed, speed),
                s=random.uniform(0.35, 1.1),
                ph=random.uniform(0, math.pi * 2),
                c=random.choice(colors),
                reg=region))
    def step(self, dt, t):
        for p in self.items:
            p["x"] += p["vx"] * dt + math.sin(t * 1.3 + p["ph"]) * 12 * dt
            p["y"] += p["vy"] * dt
            r = p["reg"]
            if p["y"] < r[1] - 30: p["y"] = r[3] + 20
            if p["y"] > r[3] + 30: p["y"] = r[1] - 20
            if p["x"] < r[0] - 30: p["x"] = r[2]
            if p["x"] > r[2] + 30: p["x"] = r[0]
    def draw(self, img, t, gain=1.0):
        for p in self.items:
            tw = 0.55 + 0.45 * math.sin(t * 3 + p["ph"])
            a = clamp(150 * p["s"] * tw * gain, 0, 255)
            if a <= 4: continue
            size = max(8, int(64 * p["s"]))
            spr = part_spr(p["c"], size)
            r, g, b, al = spr.split()
            al = al.point(lambda v: int(v * a / 255))
            img.paste(Image.merge("RGBA", (r, g, b, al)),
                      (int(p["x"] - size / 2), int(p["y"] - size / 2)),
                      Image.merge("RGBA", (r, g, b, al)))

def text_block(draw_frame, lines, cy, t_in, dur, size=88, glow=True, anchor_alpha=None):
    """Крупный текст по центру с pop-анимацией."""
    k = clamp(t_in / 0.35, 0, 1)
    fade_out = clamp((dur - t_in) / 0.3, 0, 1)
    alpha = k * fade_out
    if alpha <= 0.01: return
    scale = 0.86 + 0.14 * ease_out(k)
    f = font(int(size * scale))
    total_h = len(lines) * int(size * scale * 1.25)
    y = cy - total_h // 2
    tmp = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    td = ImageDraw.Draw(tmp)
    for ln in lines:
        bb = td.textbbox((0, 0), ln, font=f)
        tw_ = bb[2] - bb[0]
        x = (W - tw_) // 2
        if glow:
            td.text((x, y + 4), ln, font=f, fill=(0, 0, 0, int(150 * alpha)))
        td.text((x, y), ln, font=f, fill=WHITE + (int(255 * alpha),))
        td.text((x, y), ln, font=f, fill=GOLD + (int(90 * alpha),))
        y += int(size * scale * 1.25)
    tmp = tmp.filter(ImageFilter.GaussianBlur(0.6)) if glow else tmp
    draw_frame.paste(tmp, (0, 0), tmp)

# ---------------- ГЛОБАЛЬНОЕ СОСТОЯНИЕ ----------------
dust_cold = Particles(70, (0, 700, W, 1500), speed=25, colors=[(170, 190, 230)])
dust_gold = Particles(90, (0, 400, W, 1850), speed=40, colors=[(255, 215, 150)])
gold_burst = Particles(140, (0, 200, W, 1850), speed=55, colors=[(255, 220, 150), (255, 240, 200)])

# Мотыльки: летят от головы (540,1000) к цветам
FLOWERS = [(170, 1450), (400, 1500), (700, 1480), (930, 1440), (540, 1560)]
MOTHS = []
for fi, (fx, fy) in enumerate(FLOWERS):
    for k in range(3):
        MOTHS.append(dict(
            sx=540 + random.randint(-60, 60), sy=980 + random.randint(-40, 40),
            tx=fx + random.randint(-30, 30), ty=fy + random.randint(-40, 10),
            delay=fi * 0.7 + k * 0.55 + random.uniform(0, 0.4),
            flight=2.6 + random.uniform(0, 1.2),
            ph=random.uniform(0, 6.28), sc=random.uniform(0.75, 1.25),
            arrive=0.0))
for i in range(len(MOTHS)):
    m = MOTHS[i]
    m["arrive"] = m["delay"] + m["flight"]

TAB_POS = []
random.seed(11)
for i in range(12):
    TAB_POS.append((540 - 300 + (i % 4) * 165 + 65, 920 + (i // 4) * 175 + 52))

def moth_progress(m, t):
    if t < m["delay"]: return -1
    p = clamp((t - m["delay"]) / m["flight"], 0, 1)
    return p

# ---------------- РЕНДЕР КАДРОВ ----------------
START = 0
for idx in range(TOTAL):
    t = idx / FPS
    frame = None

    if t < 3.5:
        # БЛОК 1: ХУК — компас, зум-in (все слои масштабируются вместе)
        tt = t
        z = 1.0 + 0.85 * smooth(tt / 3.2)
        shake = 0 if tt > 0.5 else math.sin(tt * 60) * 6 * (0.5 - tt)
        cx, cy = 540, 1150
        vw, vh = W / z, H / z
        ox = clamp(cx - vw / 2 + shake, 0, W - vw)
        oy = clamp(cy - vh / 2 + shake * 0.5, 0, H - vh)
        def to_screen(px, py):
            return ((px - ox) * z, (py - oy) * z)
        frame = BG[1].crop((int(ox), int(oy), int(ox + vw), int(oy + vh))).resize((W, H), Image.BILINEAR)
        ccx, ccy = to_screen(cx, cy)
        cr = int(240 * z)
        comp_s = COMPASS.crop((cx - 260, cy - 260, cx + 260, cy + 260)).resize((cr * 2, cr * 2), Image.BILINEAR)
        nsz = int(360 * z)
        ndl = NEEDLE.rotate(-(tt * 640 + 40 * math.sin(tt * 9)), expand=False, resample=Image.BICUBIC).resize((nsz, nsz), Image.BILINEAR)
        frame.paste(comp_s, (int(ccx - cr), int(ccy - cr)), comp_s)
        frame.paste(ndl, (int(ccx - nsz / 2), int(ccy - nsz / 2)), ndl)
        dust_cold.step(1/FPS, t)
        dust_cold.draw(frame, t, gain=0.5)
        frame = tint(frame, (40, 60, 110), 0.10)
        text_block(frame, ["ТЫ НЕ", "ЛЕНИВЫЙ"], 560, tt, 3.5, size=110)

    elif t < 10.5:
        # БЛОК 2.1: мотыльки вылетают из головы (мотыльки в координатах фона -> экран)
        tt = t - 3.5
        z = 1.0 + 0.12 * smooth(tt / 7)
        vw, vh = W / z, H / z
        ox, oy = clamp(540 - vw / 2, 0, W - vw), clamp(1100 - vh / 2, 0, H - vh)
        frame = BG[2].crop((int(ox), int(oy), int(ox + vw), int(oy + vh))).resize((W, H), Image.BILINEAR)
        d = ImageDraw.Draw(frame, "RGBA")
        for m in MOTHS:
            p = moth_progress(m, tt)
            if p < 0: continue
            e = ease_out(p)
            x = lerp2(m["sx"], m["tx"], e)
            y = lerp2(m["sy"], m["ty"], e) - 160 * math.sin(math.pi * p)
            flap = tt * 18 + m["ph"]
            draw_moth(d, (x - ox) * z, (y - oy) * z, m["sc"] * z, flap, int(150 + 40 * math.sin(tt * 5 + m["ph"])))
        dust_cold.step(1/FPS, t)
        dust_cold.draw(frame, t, gain=0.6)
        text_block(frame, ["Каждая незавершённая", "задача — открытая", "вкладка в мозге"], 480, tt, 7.0, size=76)

    elif t < 18.5:
        # БЛОК 2.2: цветы тускнеют
        tt = t - 10.5
        frame = BG[3].copy()
        d = ImageDraw.Draw(frame, "RGBA")
        # прилетевшие мотыльки сидят на цветах, крылья медленно складываются
        for m in MOTHS:
            x = m["tx"]; y = m["ty"] - 20
            draw_moth(d, x, y, m["sc"], tt * 4 + m["ph"], 170)
        # затемнение свечения цветов
        dark = clamp(tt / 6.0, 0, 1)
        frame = tint(frame, (10, 8, 25), 0.28 * dark)
        dust_cold.step(1/FPS, t)
        dust_cold.draw(frame, t, gain=0.45)
        txt = ["Они пожирают", "твою энергию"] if tt < 4 else ["Ты устаёшь, даже", "когда ничего", "не делаешь"]
        tin = tt if tt < 4 else tt - 4
        tstart_dur = 4.0 if tt < 4 else 4.0
        text_block(frame, txt, 500, tin, tstart_dur, size=88)

    elif t < 25.5:
        # БЛОК 2.3: голова с вкладками + глитч
        tt = t - 18.5
        frame = BG[4].copy()
        d = ImageDraw.Draw(frame, "RGBA")
        # мерцающие вкладки
        for i, (tx, ty) in enumerate(TAB_POS):
            pulse = 0.5 + 0.5 * math.sin(tt * (4 + i * 0.7) + i)
            a = int(60 + 120 * pulse)
            col = [GOLD, (74, 111, 165), (180, 120, 200)][i % 3]
            d.rounded_rectangle([tx - 65, ty - 52, tx + 65, ty + 52], radius=12, outline=col + (a,), width=4)
        # глитч слоями каждые ~2 сек
        gk = (tt * 0.55) % 1.0
        if gk < 0.12:
            off = int(14 * math.sin(tt * 90))
            g2 = GLITCH.copy()
            frame.paste(g2, (off, -off // 2), g2)
            frame = tint(frame, (255, 60, 60), 0.05)
        # затухание к чёрному на последних 0.8 сек
        fade = clamp((tt - 5.7) / 0.8, 0, 1)
        if fade > 0:
            frame = tint(frame, (0, 0, 0), fade)
        text_block(frame, ["Твой мозг не отдыхает.", "Он перезагружается."], 480, tt, 5.6, size=84)

    elif t < 32.5:
        # БЛОК 3.1: блокнот, мотыльки исчезают
        tt = t - 25.5
        frame = BG[5].copy()
        d = ImageDraw.Draw(frame, "RGBA")
        frame.paste(NB_GLOW, (0, 0), NB_GLOW)
        # мотыльки растворяются один за другим
        for m in MOTHS:
            dis = 0.6 + MOTHS.index(m) * 0.35
            p = clamp((tt - dis) / 0.6, 0, 1)
            if p >= 1: continue
            x = m["tx"] + random.uniform(-2, 2)
            y = m["ty"] - 20 - 40 * p
            draw_moth(d, x, y, m["sc"] * (1 - 0.4 * p), tt * 14 + m["ph"], int(170 * (1 - p)))
        # «строки» в блокноте появляются
        dl = ImageDraw.Draw(frame, "RGBA")
        for ln in range(4):
            lk = clamp((tt - 0.8 - ln * 0.9) / 0.5, 0, 1)
            if lk > 0:
                dl.line([(560 - 70, 1205 + ln * 26), (560 - 70 + 140 * lk, 1205 + ln * 26)],
                        fill=(90, 70, 50, 220), width=3)
        dust_gold.step(1/FPS, t)
        dust_gold.draw(frame, t, gain=smooth(tt / 6) * 0.8)
        txt = ["Выпиши всё.", "Каждую мысль."] if tt < 3.5 else ["Перенеси их", "на бумагу"]
        tin = tt if tt < 3.5 else tt - 3.5
        text_block(frame, txt, 480, tin, 3.5, size=92)

    elif t < 40.5:
        # БЛОК 3.2: расцвет Люменов
        tt = t - 32.5
        bloom = smooth(tt / 2.5)
        base = Image.blend(BG[5].convert("RGB"), BG[6].convert("RGB"), bloom).convert("RGBA")
        # пульс яркости люменов
        pulse = 0.75 + 0.25 * math.sin(tt * 2.2)
        lum = S6_LUM.copy()
        r, g, b, a = lum.split()
        a = a.point(lambda v: int(v * bloom * pulse))
        lum = Image.merge("RGBA", (r, g, b, a))
        base.paste(lum, (0, 0), lum)
        frame = base
        gold_burst.step(1/FPS, t)
        gold_burst.draw(frame, t, gain=bloom)
        text_block(frame, ["Твой мозг", "снова твой"], 500, tt, 8.0, size=100)

    elif t < 45.0:
        # БЛОК 3.3: взгляд в камеру, CTA, zoom out (люмены масштабируются вместе с фоном)
        tt = t - 40.5
        z = 1.32 - 0.32 * smooth(tt / 4.0)
        vw, vh = W / z, H / z
        ox, oy = clamp(540 - vw / 2, 0, W - vw), clamp(1150 - vh / 2, 0, H - vh)
        frame = BG[6].crop((int(ox), int(oy), int(ox + vw), int(oy + vh))).resize((W, H), Image.BILINEAR)
        pulse = 0.8 + 0.2 * math.sin(tt * 2.5)
        lum = S6_LUM.crop((int(ox), int(oy), int(ox + vw), int(oy + vh))).resize((W, H), Image.BILINEAR)
        r, g, b, a = lum.split()
        a = a.point(lambda v: int(v * pulse))
        frame.paste(Image.merge("RGBA", (r, g, b, a)), (0, 0), Image.merge("RGBA", (r, g, b, a)))
        gold_burst.step(1/FPS, t)
        gold_burst.draw(frame, t, gain=1.0)
        text_block(frame, ["Сохрани,", "чтобы не потерять", "в тумане 🌫️"], 430, tt, 4.5, size=78)

    else:
        # БЛОК 4: ЛУП — снова компас (стрелка вращается, лёгкий зум к началу видео)
        tt = t - 45.0
        z = 1.0 + 0.85 * smooth(tt / 3.0)   # совпадает с зумом блока 1 -> бесшовный loop
        vw, vh = W / z, H / z
        ox, oy = clamp(540 - vw / 2, 0, W - vw), clamp(1000 - vh / 2, 0, H - vh)
        frame = BG[7].crop((int(ox), int(oy), int(ox + vw), int(oy + vh))).resize((W, H), Image.BILINEAR)
        nsz = int(225 * z)
        ndl = NEEDLE2.rotate(-(tt * 700), expand=False, resample=Image.BICUBIC).resize((nsz, nsz), Image.BILINEAR)
        ccx, ccy = (540 - ox) * z, (1000 - oy) * z
        frame.paste(ndl, (int(ccx - nsz / 2), int(ccy - nsz / 2)), ndl)
        dust_cold.step(1/FPS, t)
        dust_cold.draw(frame, t, gain=0.5)
        frame = tint(frame, (40, 60, 110), 0.10)

    # лёгкая виньетка на каждом кадре (дешёвая: тёмные углы градиентом)
    frame.save(os.path.join(FRAMES, f"f{idx:04d}.png"))
    if idx % 150 == 0:
        print(f"frame {idx}/{TOTAL} t={t:.1f}s", flush=True)

print("RENDER DONE", TOTAL, "frames")
