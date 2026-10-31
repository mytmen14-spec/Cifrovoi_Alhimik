#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ANIMA День 1 — процедурный саундтрек (numpy -> wav).
Темный эмбиент-дрон минор -> мажор в решении -> возврат для лупа.
Слои: дрон, суб-бас, ветер (розовый шум), тики компаса, крылья мотыльков,
глитчи, колокольчики, расцвет, финальный аккорд. Итог: audio_master.wav 48с.
"""
import numpy as np, wave, os, struct

SR = 44100
DUR = 48.0
N = int(SR * DUR)
T = np.arange(N) / SR
t = np.zeros(N)

def env_seg(times, values):
    """Линейная огибающая по точкам (сек, уровень)."""
    times = np.array(times); values = np.array(values, dtype=float)
    return np.interp(T, times, values)

def add(sig, gain_env=None, offset=0.0):
    global t
    if gain_env is None:
        t[:len(sig)] += sig[:N]
    else:
        g = env_seg(gain_env[0], gain_env[1])
        t[:len(sig)] += (sig[:N] * g)[:N]

rng = np.random.default_rng(1)

# ---------- ДРОН: A2+E2+A3 (+C4 приSolution) с медленным вибрато и тремоло ----------
def drone(freq, amp, detune_lfo_rate, detune_depth):
    ph = rng.uniform(0, 6.28)
    f = freq + detune_depth * np.sin(2 * np.pi * detune_lfo_rate * T + ph)
    # два слегка расстроенных осциллятора = хору
    s = np.sin(2 * np.pi * np.cumsum(f) / SR)
    s2 = np.sin(2 * np.pi * np.cumsum(f * 1.005) / SR)
    return amp * (s + s2) * 0.5

minor_env = ([0, 1.5, 10, 18, 25.5, 26.5, 32, 40, 44.5, 46, 48],
             [0.0, 0.5, 0.65, 0.75, 0.8, 0.35, 0.3, 0.3, 0.15, 0.35, 0.55])
major_env = ([0, 25.5, 27, 33, 41, 45, 48],
             [0.0, 0.0, 0.5, 0.6, 0.55, 0.3, 0.0])

d_minor = (drone(110.0, 0.22, 0.07, 1.2) + drone(164.81, 0.14, 0.09, 1.0)
           + drone(220.0, 0.08, 0.11, 0.8) + drone(82.41, 0.16, 0.05, 0.6))
# тревожный рост к блоку 2.3: добавим уменьшенный интервал
d_tense = drone(233.08, 0.05, 0.13, 1.5)
d_major = (drone(110.0, 0.20, 0.07, 1.0) + drone(164.81, 0.13, 0.09, 0.9)
           + drone(220.0, 0.11, 0.10, 0.7) + drone(277.18, 0.07, 0.12, 0.6))  # C#4 -> мажор

add(d_minor, minor_env)
add(d_tense, ([0, 18, 21, 25, 26, 48], [0, 0, 0.9, 1.0, 0, 0]))
add(d_major, major_env)

# ---------- ВЕТЕР: розовый шум через фильтрованную интеграцию ----------
wn = rng.standard_normal(N)
# простой ROSA-подобный фильтр: накопительное скользящее
k = 900
wind = np.convolve(wn, np.ones(k) / k, mode="same")
wind_env = ([0, 4, 25, 33, 45, 48], [0.05, 0.09, 0.07, 0.05, 0.08, 0.10])
add(wind * 0.5, wind_env)

def impulse(start, length, fn):
    i0 = int(start * SR); i1 = min(int((start + length) * SR), N)
    tt = np.arange(i1 - i0) / SR
    sig = fn(tt)
    tail = np.zeros(N)
    tail[i0:i1] = sig
    return tail

def tick_osc(f0, decay, q=0.05):
    def fn(tt):
        env = np.exp(-tt / decay)
        body = np.sin(2 * np.pi * f0 * tt + 3 * np.sin(2 * np.pi * f0 * 2.3 * tt))
        click = rng.standard_normal(len(tt)) * np.exp(-tt / 0.004) * 0.5
        return env * (body * (1 - q) + click)
    return fn

# 1) Тики компаса (0–3 сек, часто; и в лупе 45–48)
comp_sig = np.zeros(N)
for st in np.arange(0.05, 3.0, 0.16):
    comp_sig += impulse(st, 0.12, tick_osc(rng.uniform(1800, 2600), 0.03))
for st in np.arange(45.1, 47.9, 0.16):
    comp_sig += impulse(st, 0.12, tick_osc(rng.uniform(1800, 2600), 0.03))
add(comp_sig * 0.5)

# 2) Шёпот (4–10 сек): модулированный полосовой шум
sh = np.convolve(rng.standard_normal(N), np.ones(60) / 60, mode="same")
whisper = np.zeros(N)
i0, i1 = int(4 * SR), int(10 * SR)
mod = 0.5 + 0.5 * np.sin(2 * np.pi * 3.1 * np.arange(i1 - i0) / SR) * np.sin(2 * np.pi * 0.7 * np.arange(i1 - i0) / SR)
whisper[i0:i1] = sh[i0:i1] * mod * 0.06
fade = np.linspace(0, 1, 4000); fade2 = fade[::-1]
whisper[i0:i0 + 4000] *= fade; whisper[i1 - 4000:i1] *= fade2
add(whisper)

# 3) Крылья мотыльков (4–20 сек): мягкие пульсации шума на ~9 Гц
flap = np.zeros(N)
i0, i1 = int(4 * SR), int(20 * SR)
n = i1 - i0
tt = np.arange(n) / SR
wingband = np.convolve(rng.standard_normal(n), np.ones(140) / 140, mode="same")
pulse = (np.sin(2 * np.pi * 9 * tt) ** 2) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.9 * tt))
flap[i0:i1] = wingband * pulse * 0.05
flap[i0:i0 + 8000] *= np.linspace(0, 1, 8000)
flap[i1 - 8000:i1] *= np.linspace(1, 0, 8000)
add(flap)

# 4) Хрустальный треск стекла (11–18 сек, случайно)
glass = np.zeros(N)
for st in np.sort(rng.uniform(11.2, 17.8, 9)):
    glass += impulse(st, 0.35, tick_osc(rng.uniform(3200, 5200), 0.05, q=0.02))
add(glass * 0.35)

# 5) Затухание свечения (11–17): нисходящий тон
def downslide(f_start, f_end, dur_s, amp):
    n = int(dur_s * SR)
    tt = np.arange(n) / SR
    fr = np.linspace(f_start, f_end, n)
    return amp * np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.hanning(n)
fade_sig = np.zeros(N)
seg = downslide(900, 300, 5.5, 0.10)
fade_sig[int(11.2 * SR):int(11.2 * SR) + len(seg)] = seg
add(fade_sig)

# 6) Глитчи + щелчки (18.5–24 сек)
glitch = np.zeros(N)
for st in np.sort(rng.uniform(18.7, 23.8, 16)):
    ln = rng.uniform(0.03, 0.12)
    glitch += impulse(st, ln, lambda tt, f=rng.uniform(600, 1400):
                      np.sign(np.sin(2 * np.pi * f * tt)) * np.exp(-tt / ln) * 0.12)
clicks = np.zeros(N)
for st in np.arange(19.0, 24.0, 0.22):
    clicks += impulse(st + rng.uniform(0, 0.05), 0.05, tick_osc(rng.uniform(2500, 4000), 0.012))
add(glitch + clicks * 0.5)

# 7) Письмо ASMR (26–32 сек): мелкие скребущие шумы
pen = np.zeros(N)
for st in np.arange(26.3, 31.8, 0.09):
    pen += impulse(st, 0.05, lambda tt: np.convolve(rng.standard_normal(len(tt)), np.ones(8) / 8, "same") * np.exp(-tt / 0.02) * 0.10)
add(pen * 0.6)

# 8) Кристальные колокольчики: исчезновение мотыльков (26.1+, каждые ~0.35 сек)
def chime(f, dur_s=1.2, amp=0.12):
    return lambda tt: amp * np.sin(2 * np.pi * f * tt) * np.exp(-tt / 0.35) * (1 + 0.4 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt / 0.15))
notes = [880, 1046.5, 1318.5, 1568, 1174.7]
chimes = np.zeros(N)
for i, st in enumerate(np.arange(26.2, 32.0, 0.42)):
    chimes += impulse(st, 1.4, chime(rng.choice(notes), amp=0.07))
add(chimes)

# 9) Расцвет (33 сек): восходящий арпеджио A-C#-E + shimmer
bloom = np.zeros(N)
seq = [(33.0, 440), (33.35, 554.37), (33.7, 659.25), (34.05, 880), (34.4, 1108.72)]
for st, f in seq:
    bloom += impulse(st, 2.2, chime(f, amp=0.13))
shimmer = np.convolve(rng.standard_normal(N), np.ones(30) / 30, mode="same")
i0 = int(33 * SR)
sig = shimmer[i0:] * np.minimum(1, (np.arange(len(shimmer[i0:])) / SR) * 0.8) * np.exp(-np.arange(len(shimmer[i0:])) / SR / 6) * 0.05
bloom[i0:i0 + len(sig)] += sig
add(bloom)

# 10) Финальный magical chime (41 сек) + низкий удар перехода (45 сек)
final = np.zeros(N)
for f, a in [(880, 0.16), (1108.72, 0.12), (1318.5, 0.10), (1760, 0.07)]:
    final += impulse(41.0, 3.0, chime(f, amp=a))
final += impulse(45.0, 0.8, tick_osc(120, 0.25, q=0.9))  # низкий переходный удар
add(final)

# ---------- ЛОУПАСС + НОРМАЛИЗАЦИЯ + FADE ПО КРАЯМ ДЛЯ БЕСШОВНОГО ЛУПА ----------
# мягкий сглаживающий фильтр
t = np.convolve(t, np.ones(6) / 6, mode="same")

# кроссфейд концовок (loop): последние 1 сек смешиваем с первыми
cf = int(1.0 * SR)
ramp = np.linspace(0, 1, cf)
tail = t[-cf:].copy()
head = t[:cf].copy()
new_tail = tail * ramp + head * (1 - ramp)
new_head = head * ramp + tail * (1 - ramp)
t[:cf] = new_head * 0.0 + head  # начало оставляем чистым (дрон нарастает сам)
t[-cf:] = new_tail

peak = np.max(np.abs(t)) or 1.0
t = t / peak * 0.85

# лёгкая стерео-панорама (копируем в 2 канала с микро-задержкой на правом)
left = t
right = np.roll(t, 77) * 0.98

pcm = np.empty(N * 2, dtype=np.int16)
pcm[0::2] = np.clip(left * 32767, -32768, 32767).astype(np.int16)
pcm[1::2] = np.clip(right * 32767, -32768, 32767).astype(np.int16)

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audio_master.wav")
with wave.open(OUT, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("AUDIO DONE ->", OUT, f"{DUR}s")
