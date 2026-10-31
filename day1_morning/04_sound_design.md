# 🔊 ЗВУКОВОЙ ДИЗАЙН — День 1 (Утро)
## Список SFX, эмбиент, тайминги и громкость

---

## 🎚️ УРОВНИ ГРОМКОСТИ (свод)

| Дорожка | Уровень | Примечание |
|---|---|---|
| Озвучка (VO) | **−6 dB** | Доминирует; sidechain-ducking всех остальных на −3…−4 dB под голос |
| Эмбиент / музыка | **−18 dB** | Фон; автоматизация громкости по блокам |
| SFX | **−12 dB** | Акценты; пиковые события (glitch, chime) до −9 dB |
| Мастер | −1 LUFS target ≈ −14 LUFS integrated (платформенная норма YouTube/TikTok) | Лимитер ceiling −1 dBTP |

---

## 🎵 ЭМБИЕНТ (фоновая музыка)

| Время | Название слоя | Описание | Автоматизация |
|---|---|---|---|
| 0:00–0:25 | `amb_drone_minor` | Dark ambient drone, минор (референсы: OST Hollow Knight «Main Theme», Stars of the Lid, Hans Zimmer «Time» low end), 65 BPM | Старт −20 dB → к 0:19 нарастание до −15 dB, добавляется тревожный диссонансный слой |
| 0:19–0:25 | `amb_tension_rise` | Нарастающее напряжение: high-pitched string shimmer + пульсирующий суб-бас (как сердцебиение 110 уд/мин) | Crescendo до crash-zoom |
| 0:25.0–0:25.4 | `silence_gap` | ⚠️ ПОЛНАЯ ТИШИНА (совпадает с чёрным кадром) | Мгновенный mute всех дорожек |
| 0:26–0:40 | `amb_uplifting` | Переход в мажор: тёплый cinematic pad, арфовые переборы, лёгкий choir, 65 BPM | Вход fade-in 1.5 с, пик громкости −14 dB на 0:35 |
| 0:41–0:45 | `amb_resolve_soft` | Эмбиент успокаивается, остаётся pad + ветер | Decrescendo до −18 dB |
| 0:45–0:48 | `amb_drone_minor` (возврат) | Возврат холодного дроуна из начала — для бесшовного loop | Совпадение тональности и тембра с точкой 0:00! |

**Ключевое требование для LOOP:** последние 3 секунды музыки = первые 3 секунды (та же запись, тот же фильтр). Тогда петля звучит непрерывно.

---

## 🎯 SFX — ПОЛНЫЙ СПИСОК С ТАЙМИНГАМИ

| # | Время | SFX | Библиотека / поиск по ключевым словам | Действие на экране | Громкость |
|---|---|---|---|---|---|
| 1 | 0:00.0 | Single metallic tick (компас) | `clock tick single reverb` | Первый щелчок стрелки | −9 dB |
| 2 | 0:00.5–0:03 | Spinning needle rapid ticking | `compass needle spin metal` | Стрелка бешено крутится | −12 dB |
| 3 | 0:00–0:10 | Low wind bed (тихий ветер) | `soft night wind loop` | Атмосфера леса | −22 dB |
| 4 | 0:02.0 | Whoosh + impact (появление текста) | `cinematic whoosh soft boom` | Pop-up «ТЫ НЕ ЛЕНИВЫЙ» | −10 dB |
| 5 | 0:04–0:10 | Whisper layer (шёпот, неразборчивый) | `ghost whispers reverb left-right pan` | Появление метафоры вкладок | −20 dB, панорама L↔R |
| 6 | 0:05–0:10 | Moth wing fluttering ×N | `moth butterfly wing flutter soft` | Мотыльки вылетают из головы | −14 dB, спавн каждые 0.3 с |
| 7 | 0:11–0:18 | Fading glow sound (угасание) | `magic power down shimmer reverse riser` | Цветы гаснут | −12 dB |
| 8 | 0:13, 0:15 | Crystal crack (хруст стекла) ×2 | `glass crack small tingle` | Трещины на лепестках | −11 dB |
| 9 | 0:16–0:18 | Heartbeat slow sub-bass | `heartbeat deep slow` | Глаза Наблюдателя тускнеют | −18 dB |
| 10 | 0:19.0 | Crash-zoom whoosh | `fast riser impact braam short` | Резкий zoom в лицо | −9 dB |
| 11 | 0:19–0:24 | Digital glitch bursts ×6 | `data glitch static short` | Мерцание «вкладок» | −13 dB |
| 12 | 0:20–0:24 | UI clicking cascade | `mouse clicks many fast` | Десятки вкладок открываются | −15 dB |
| 13 | 0:25.0 | Hard stop (обрыв всего звука) | — | Чёрный экран | silence |
| 14 | 0:26–0:32 | Pen on paper ASMR ×6 | `pen writing paper scratch soft` | Росчерки в блокноте | −12 dB, синхронно с исчезновением мотыльков |
| 15 | 0:27, 28, 29, 30, 31, 32 | Crystal chime ×6 | `crystal bell sparkle high` | Каждый мотылёк рассыпается | −13 dB (каскад, нисходящая мелодия) |
| 16 | 0:33–0:35 | Blooming swell | `orchestral bloom warm rise sparkle` | Люмены вспыхивают каскадом | −11 dB |
| 17 | 0:35 | Shimmer sweep L→R | `gold dust shimmer pan` | Вихрь частиц | −14 dB |
| 18 | 0:37.0 | Soft magical boom (под «Твой мозг снова твой») | `cinematic soft boom reverb` | Пик кульминации | −10 dB |
| 19 | 0:41–0:45 | Gentle wind return | `soft breeze loop` | Zoom out, CTA | −20 dB |
| 20 | 0:43.5 | Subtle pop (плашка CTA) | `ui pop soft` | «Сохрани…» | −14 dB |
| 21 | 0:45.0 | Magical chime final | `music box single note echo` | Обрыв фразы «правило…» | −11 dB |
| 22 | 0:45.5–0:48 | Compass tick + spin start | `compass needle spin metal` (тот же файл, что #2) | Стрелка снова крутится → loop | −12 dB → совпадает с 0:00 |

---

## 🧩 ИСТОЧНИКИ ЗВУКОВ

- **Freesound.org** (CC-лицензии): `whisper`, `moth wings`, `glass crack`, `pen on paper`, `compass`
- **Epidemic Sound / Artlist**: dark ambient, cinematic risers, crystal chimes
- **ElevenLabs SFX** (текст→звук): промпты вида *"magical glowing flower fading with crystalline cracking"*
- **Плагин-совет:** Valhalla Supermassive (reverb/delay) для шёпота и chime — даёт «анимашный» простор.

---

## ✅ ФИНАЛЬНАЯ ЦЕПОЧКА МАСТЕРИНГА

```
VO:  HPF 80 Hz → de-esser → компрессор 3:1 → −6 dB
AMB: LPF 12 kHz → sidechain от VO (−4 dB) → −18 dB
SFX: HPF 200 Hz → реверб 1.8 s → −12 dB
BUS: лимитер ceiling −1 dBTP → export 48 kHz WAV
```
