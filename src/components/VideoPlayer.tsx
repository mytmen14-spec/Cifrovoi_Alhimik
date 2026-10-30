import { useState, useEffect, useRef, useCallback } from 'react';
import { exportVideo, isExportSupported, downloadFromUrl, downloadBlob, type ExportStatus } from '../videoExporter';

// ============ AUDIO ENGINE ============
class AudioEngine {
  ctx: AudioContext | null = null;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.1) {
    const ctx = this.init();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  cosmicHum() {
    this.playTone(80, 2, 'sine', 0.05);
    this.playTone(120, 2, 'sine', 0.03);
  }

  digitalActivation() {
    const ctx = this.init();
    [200, 400, 600, 800, 1000].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.15, 'square', 0.04), i * 50);
    });
  }

  bassDrop() {
    const ctx = this.init();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }

  hologramActivate() {
    [300, 500, 700, 900].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.3, 'sine', 0.05), i * 80);
    });
  }

  goldenChime() {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 0.8, 'sine', 0.06), i * 100);
    });
  }

  numberTick() {
    this.playTone(1200, 0.05, 'square', 0.03);
  }

  whoosh() {
    const ctx = this.init();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  syncChord() {
    [261, 329, 392, 523].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 1.5, 'sine', 0.04), i * 150);
    });
  }

  logoAppear() {
    [392, 523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 1, 'sine', 0.05), i * 120);
    });
  }

  glitch() {
    const ctx = this.init();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(100, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  }
}

const audio = new AudioEngine();

// ============ SCENE DATA ============
const scenes = [
  { id: 1, name: 'ПРОБУЖДЕНИЕ', start: 0, end: 5, subtitle: 'ДРЕВНЯЯ МУДРОСТЬ ВСТРЕЧАЕТ СОВРЕМЕННЫЕ ДЕНЬГИ' },
  { id: 2, name: 'ИНТЕРФЕЙС', start: 5, end: 12, subtitle: 'ТВОЯ НАТАЛЬНАЯ КАРТА = ТВОЙ ФИНАНСОВЫЙ КОД' },
  { id: 3, name: 'ТРАНСФОРМАЦИЯ', start: 12, end: 20, subtitle: 'АЛХИМИЯ ДЕНЕГ: ТРАНСФОРМИРУЙ ПАССИВЫ В АКТИВЫ' },
  { id: 4, name: 'ЗОДИАК КАК ПОРТФЕЛЬ', start: 20, end: 28, subtitle: 'ТВОЙ ЗОДИАК ПОДСКАЖЕТ, КУДА ИНВЕСТИРОВАТЬ' },
  { id: 5, name: 'ЧИСЛО СУДЬБЫ', start: 28, end: 38, subtitle: 'ТВОЁ ЧИСЛО СУДЬБЫ = ТВОЯ ФИНАНСОВАЯ СТРАТЕГИЯ' },
  { id: 6, name: 'СИНХРОНИЗАЦИЯ', start: 38, end: 48, subtitle: 'СИНХРОНИЗИРУЙ ВСЕЛЕННУЮ, РЫНОК И СЕБЯ' },
  { id: 7, name: 'ПРИЗЫВ', start: 48, end: 55, subtitle: 'УЗНАЙ СВОЙ АСТРАЛЬНО-ФИНАНСОВЫЙ КОД' },
  { id: 8, name: 'ЛОГОТИП', start: 55, end: 60, subtitle: 'CYBER ALCHEMY' },
];

// ============ SCENE COMPONENTS ============

function Scene1Awakening({ progress }: { progress: number }) {
  const p = Math.min(progress / 5, 1);
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Initial dot of light */}
      <div
        className="absolute rounded-full bg-[#00FFD5] transition-all duration-1000"
        style={{
          width: `${10 + p * 600}px`,
          height: `${10 + p * 600}px`,
          opacity: p < 0.3 ? 1 : Math.max(0, 1 - (p - 0.3) * 2),
          boxShadow: `0 0 ${20 + p * 100}px #00FFD5`,
        }}
      />
      {/* Sacred geometry appears */}
      <svg
        viewBox="0 0 400 400"
        className="absolute w-[500px] h-[500px] transition-all duration-1000"
        style={{ opacity: p > 0.3 ? Math.min((p - 0.3) * 3, 0.6) : 0 }}
      >
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <circle
            key={i}
            cx={200 + 60 * Math.cos((angle * Math.PI) / 180)}
            cy={200 + 60 * Math.sin((angle * Math.PI) / 180)}
            r="60"
            fill="none"
            stroke="#00FFD5"
            strokeWidth="0.5"
            style={{
              strokeDasharray: 380,
              strokeDashoffset: 380 - p * 380,
              transition: 'stroke-dashoffset 1s ease'
            }}
          />
        ))}
        <circle cx="200" cy="200" r="60" fill="none" stroke="#FFD700" strokeWidth="0.5"
          style={{ strokeDasharray: 380, strokeDashoffset: 380 - p * 380 }} />
      </svg>
      {/* Character silhouette */}
      <div
        className="absolute transition-all duration-1000"
        style={{ opacity: p > 0.5 ? Math.min((p - 0.5) * 4, 1) : 0, transform: `scale(${0.8 + p * 0.2})` }}
      >
        <svg viewBox="0 0 200 300" className="w-48 h-72">
          <path
            d="M100,40 C70,40 50,70 45,100 L35,260 C35,270 45,280 60,280 L140,280 C155,280 165,270 165,260 L155,100 C150,70 130,40 100,40 Z"
            fill="#111" stroke="#00FFD5" strokeWidth="1" opacity="0.9"
          />
          <ellipse cx="100" cy="80" rx="30" ry="35" fill="#050505" />
          {/* Eyes glow */}
          <ellipse cx="88" cy="75" rx="6" ry="4" fill="#00FFD5" opacity={p > 0.6 ? 1 : 0}>
            <animate attributeName="opacity" values="0;1;0.8;1" dur="0.5s" begin="0s" fill="freeze" />
          </ellipse>
          <ellipse cx="112" cy="75" rx="6" ry="4" fill="#00FFD5" opacity={p > 0.6 ? 1 : 0}>
            <animate attributeName="opacity" values="0;1;0.8;1" dur="0.5s" begin="0.1s" fill="freeze" />
          </ellipse>
        </svg>
      </div>
      {/* Interface activation ring */}
      <div
        className="absolute transition-all duration-1000"
        style={{ opacity: p > 0.7 ? Math.min((p - 0.7) * 5, 0.5) : 0 }}
      >
        <svg viewBox="0 0 300 300" className="w-80 h-80 animate-rotate-slow">
          <circle cx="150" cy="150" r="130" fill="none" stroke="#FFD700" strokeWidth="0.5" strokeDasharray="5,5" />
          {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((s, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            return (
              <text key={i} x={150 + 125 * Math.cos(angle)} y={150 + 125 * Math.sin(angle)}
                textAnchor="middle" dominantBaseline="central" fontSize="12" fill="#FFD700" opacity="0.7">
                {s}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function Scene2Interface({ progress }: { progress: number }) {
  const p = Math.min((progress - 5) / 7, 1);
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-full max-w-3xl px-8">
        {/* Left panel - Natal chart */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-1000"
          style={{ opacity: p > 0.1 ? Math.min((p - 0.1) * 3, 1) : 0, transform: `translateX(${p < 0.1 ? -100 : 0}px) translateY(-50%)` }}>
          <svg viewBox="0 0 200 200" className="w-40 h-40 md:w-56 md:h-56">
            <circle cx="100" cy="100" r="90" fill="none" stroke="#00FFD5" strokeWidth="0.5" opacity="0.4" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.3" />
            <circle cx="100" cy="100" r="50" fill="none" stroke="#9D4EDD" strokeWidth="0.5" opacity="0.3" />
            {[
              { angle: 0, label: '☉', name: 'BTC' },
              { angle: 60, label: '☽', name: 'GOLD' },
              { angle: 120, label: '☿', name: 'AAPL' },
              { angle: 180, label: '♀', name: 'LUX' },
              { angle: 240, label: '♂', name: 'OIL' },
              { angle: 300, label: '♃', name: 'ETH' },
            ].map((planet, i) => {
              const x = 100 + 70 * Math.cos((planet.angle * Math.PI) / 180);
              const y = 100 + 70 * Math.sin((planet.angle * Math.PI) / 180);
              return (
                <g key={i} style={{ opacity: p > 0.3 + i * 0.1 ? 1 : 0, transition: 'opacity 0.3s' }}>
                  <circle cx={x} cy={y} r="10" fill="rgba(0,255,213,0.1)" stroke="#00FFD5" strokeWidth="0.5" />
                  <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#FFD700">{planet.label}</text>
                  <text x={x} y={y + 14} textAnchor="middle" fontSize="5" fill="#00FFD5" opacity="0.7">{planet.name}</text>
                </g>
              );
            })}
          </svg>
        </div>
        {/* Right panel - Trading chart */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-1000"
          style={{ opacity: p > 0.3 ? Math.min((p - 0.3) * 3, 1) : 0, transform: `translateX(${p < 0.3 ? 100 : 0}px) translateY(-50%)` }}>
          <svg viewBox="0 0 200 200" className="w-40 h-40 md:w-56 md:h-56">
            {/* Fibonacci levels */}
            {[50, 80, 110, 140, 170].map((y, i) => (
              <g key={i}>
                <line x1="20" y1={y} x2="180" y2={y} stroke="#FFD700" strokeWidth="0.3" strokeDasharray="3,3" opacity="0.4" />
                <text x="185" y={y + 3} fontSize="6" fill="#FFD700" opacity="0.6">{[4.236, 2.618, 1.618, 1.0, 0.618][i]}</text>
              </g>
            ))}
            {/* Candles */}
            {[
              { x: 35, o: 140, c: 120, h: 110, l: 150, bull: false },
              { x: 55, o: 120, c: 130, h: 110, l: 140, bull: true },
              { x: 75, o: 130, c: 110, h: 100, l: 140, bull: false },
              { x: 95, o: 110, c: 95, h: 85, l: 120, bull: false },
              { x: 115, o: 95, c: 110, h: 85, l: 120, bull: true },
              { x: 135, o: 110, c: 90, h: 80, l: 120, bull: false },
              { x: 155, o: 90, c: 105, h: 80, l: 115, bull: true },
            ].map((candle, i) => {
              const color = candle.bull ? '#00FFD5' : '#FF4444';
              const delay = 0.4 + i * 0.08;
              return (
                <g key={i} style={{ opacity: p > delay ? 1 : 0, transition: 'opacity 0.3s' }}>
                  <line x1={candle.x} y1={candle.h} x2={candle.x} y2={candle.l} stroke={color} strokeWidth="1" />
                  <rect x={candle.x - 5} y={Math.min(candle.o, candle.c)} width="10"
                    height={Math.abs(candle.c - candle.o)} fill={color} opacity="0.8" rx="1" />
                </g>
              );
            })}
          </svg>
        </div>
        {/* Center character */}
        <div className="flex justify-center">
          <svg viewBox="0 0 200 300" className="w-36 h-52 md:w-48 md:h-72"
            style={{ opacity: p > 0.2 ? 1 : 0, transition: 'opacity 0.5s' }}>
            <path d="M100,40 C70,40 50,70 45,100 L35,260 C35,270 45,280 60,280 L140,280 C155,280 165,270 165,260 L155,100 C150,70 130,40 100,40 Z"
              fill="#111" stroke="#00FFD5" strokeWidth="0.5" />
            <ellipse cx="100" cy="80" rx="30" ry="35" fill="#050505" />
            <ellipse cx="88" cy="75" rx="6" ry="4" fill="#00FFD5" />
            <ellipse cx="112" cy="75" rx="6" ry="4" fill="#00FFD5" />
            {/* Hand gesture */}
            <g style={{ opacity: p > 0.6 ? 1 : 0, transition: 'opacity 0.5s' }}>
              <ellipse cx="45" cy="180" rx="10" ry="14" fill="rgba(0,255,213,0.1)" stroke="#00FFD5" strokeWidth="0.5" />
              <line x1="45" y1="180" x2="20" y2="160" stroke="#00FFD5" strokeWidth="0.5" opacity="0.5" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Scene3Transformation({ progress }: { progress: number }) {
  const p = Math.min((progress - 12) / 8, 1);
  const transformed = p > 0.5;
  const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Sacred geometry background */}
      <svg viewBox="0 0 400 400" className="absolute w-[600px] h-[600px] opacity-20 animate-rotate-slow">
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <circle key={i} cx={200 + 50 * Math.cos((angle * Math.PI) / 180)} cy={200 + 50 * Math.sin((angle * Math.PI) / 180)}
            r="50" fill="none" stroke="#9D4EDD" strokeWidth="0.3" />
        ))}
        <circle cx="200" cy="200" r="50" fill="none" stroke="#9D4EDD" strokeWidth="0.3" />
      </svg>

      {/* Fibonacci numbers running around */}
      <div className="absolute animate-rotate-reverse">
        <svg viewBox="0 0 400 400" className="w-[350px] h-[350px]">
          {fibonacci.map((num, i) => {
            const angle = ((i * (360 / fibonacci.length) - 90) * Math.PI) / 180;
            return (
              <text key={i} x={200 + 160 * Math.cos(angle)} y={200 + 160 * Math.sin(angle)}
                textAnchor="middle" dominantBaseline="central" fontSize="16" fill="#FFD700"
                opacity={p > i * 0.08 ? 0.8 : 0} style={{ transition: 'opacity 0.3s' }}
                fontFamily="Orbitron">
                {num}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Alchemical circle */}
      <div className="relative">
        <div className={`w-40 h-40 md:w-56 md:h-56 rounded-full border-2 flex items-center justify-center transition-all duration-1000 ${
          transformed
            ? 'border-[#FFD700] bg-[#FFD700]/10 shadow-[0_0_60px_rgba(255,215,0,0.4)]'
            : 'border-gray-600 bg-[#0A0A0A]/80'
        }`}>
          <div className="text-center">
            <div className={`text-5xl md:text-6xl transition-all duration-1000 ${
              transformed ? 'text-[#FFD700] animate-gold-glow' : 'text-gray-500'
            }`}>
              {transformed ? '☉' : '☿'}
            </div>
            <div className={`text-xs font-orbitron mt-2 transition-colors duration-1000 ${
              transformed ? 'text-[#FFD700]' : 'text-gray-500'
            }`}>
              {transformed ? 'Au — ЗОЛОТО' : 'Pb — СВИНЕЦ'}
            </div>
          </div>
        </div>

        {/* Transformation particles */}
        {transformed && Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="absolute w-1 h-1 bg-[#FFD700] rounded-full"
            style={{
              left: '50%', top: '50%',
              animation: `particle-float 2s ease-out ${i * 0.15}s infinite`,
              transform: `rotate(${i * 30}deg) translateY(-80px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Scene4Zodiac({ progress }: { progress: number }) {
  const p = Math.min((progress - 20) / 8, 1);
  const signs = [
    { sign: '♈', asset: '₿', name: 'BTC' },
    { sign: '♉', asset: '🥇', name: 'GOLD' },
    { sign: '♊', asset: '💻', name: 'TECH' },
    { sign: '♋', asset: '🏠', name: 'REAL' },
    { sign: '♌', asset: '💎', name: 'LUX' },
    { sign: '♍', asset: '📊', name: 'IDX' },
    { sign: '♎', asset: '⚖️', name: 'BAL' },
    { sign: '♏', asset: '🔮', name: 'CRYPT' },
    { sign: '♐', asset: '🌍', name: 'GLB' },
    { sign: '♑', asset: '🏢', name: 'BLD' },
    { sign: '♒', asset: '🚀', name: 'INN' },
    { sign: '♓', asset: '🎨', name: 'ART' },
  ];
  const activeIdx = Math.floor(p * 12) % 12;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
        {/* Rotating outer ring */}
        <div className="absolute inset-0 animate-rotate-slow">
          <svg viewBox="0 0 450 450" className="w-full h-full">
            <circle cx="225" cy="225" r="210" fill="none" stroke="#00FFD5" strokeWidth="0.5" opacity="0.3" />
          </svg>
        </div>

        {/* Zodiac signs */}
        {signs.map((z, i) => {
          const angle = ((i * 30 - 90) * Math.PI) / 180;
          const radius = 150;
          const x = 50 + (radius * Math.cos(angle)) / 3;
          const y = 50 + (radius * Math.sin(angle)) / 3;
          const isActive = i === activeIdx && p > 0.1;

          return (
            <div key={i} className="absolute transition-all duration-500"
              style={{
                left: `${x}%`, top: `${y}%`,
                transform: `translate(-50%, -50%) scale(${isActive ? 1.4 : 1})`,
                opacity: p > i * 0.07 ? 1 : 0,
              }}>
              <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex flex-col items-center justify-center border transition-all duration-300 ${
                isActive
                  ? 'border-[#FFD700] bg-[#FFD700]/20 shadow-[0_0_20px_rgba(255,215,0,0.5)]'
                  : 'border-[#00FFD5]/30 bg-[#0A0A0A]/80'
              }`}>
                <span className="text-sm">{z.sign}</span>
                <span className="text-[8px]">{z.asset}</span>
              </div>
              {isActive && (
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[8px] font-orbitron text-[#FFD700]">{z.name}</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full border border-[#FFD700]/30 flex items-center justify-center bg-[#0A0A0A]/90">
            <span className="font-orbitron text-[10px] md:text-xs text-[#FFD700] text-center">ТВОЙ<br/>ПОРТФЕЛЬ</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene5Destiny({ progress }: { progress: number }) {
  const p = Math.min((progress - 28) / 10, 1);
  const dateStr = '15.04.1998';
  const steps = ['1+5+0+4+1+9+9+8', '= 37', '3+7 = 10', '1+0 = 1'];
  const currentStep = Math.floor(p * 5);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center max-w-md px-6">
        {/* Date appears */}
        <div className={`mb-8 transition-all duration-700 ${p > 0.1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="font-orbitron text-3xl md:text-5xl text-[#00FFD5] tracking-wider">
            {dateStr.split('').map((ch, i) => (
              <span key={i} className="inline-block transition-all duration-300"
                style={{ opacity: p > 0.1 + i * 0.02 ? 1 : 0, transform: `translateY(${p > 0.1 + i * 0.02 ? 0 : 10}px)` }}>
                {ch}
              </span>
            ))}
          </div>
        </div>

        {/* Calculation steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step, i) => (
            <div key={i} className={`transition-all duration-500 ${
              currentStep > i ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}>
              <span className="font-mono text-lg md:text-xl text-gray-300">{step}</span>
            </div>
          ))}
        </div>

        {/* Final number */}
        <div className={`transition-all duration-1000 ${p > 0.7 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <div className="inline-block w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-[#FFD700] flex items-center justify-center animate-pulse-glow">
            <span className="font-orbitron text-4xl md:text-5xl text-[#FFD700] animate-gold-glow">1</span>
          </div>
          <div className="mt-4 font-orbitron text-sm text-[#FFD700]">ЛИДЕР • НОВЫЕ НАЧИНАНИЯ • РИСК</div>
        </div>

        {/* Sacred geometry around number */}
        {p > 0.7 && (
          <svg viewBox="0 0 200 200" className="absolute w-48 h-48 md:w-64 md:h-64 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-rotate-slow opacity-30">
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <circle key={i} cx={100 + 40 * Math.cos((angle * Math.PI) / 180)} cy={100 + 40 * Math.sin((angle * Math.PI) / 180)}
                r="40" fill="none" stroke="#FFD700" strokeWidth="0.3" />
            ))}
          </svg>
        )}
      </div>
    </div>
  );
}

function Scene6Synchronization({ progress }: { progress: number }) {
  const p = Math.min((progress - 38) / 10, 1);
  const synced = p > 0.6;
  const zodiacSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const candles = ['▮', '▯', '▮', '▯', '▮', '▮', '▯', '▮'];

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
        {/* Outer ring - Zodiac */}
        <div className="absolute inset-0" style={{
          animation: synced ? 'rotate-slow 20s linear infinite' : 'ring-rotate-1 4s linear infinite',
          transition: 'all 2s ease'
        }}>
          <svg viewBox="0 0 450 450" className="w-full h-full">
            <circle cx="225" cy="225" r="210" fill="none" stroke="#9D4EDD" strokeWidth="1" opacity="0.5" />
            {zodiacSymbols.map((s, i) => {
              const angle = ((i * 30 - 90) * Math.PI) / 180;
              return (
                <text key={i} x={225 + 200 * Math.cos(angle)} y={225 + 200 * Math.sin(angle)}
                  textAnchor="middle" dominantBaseline="central" fontSize="16" fill="#9D4EDD" opacity="0.8">
                  {s}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Middle ring - Numbers */}
        <div className="absolute inset-[18%]" style={{
          animation: synced ? 'rotate-slow 20s linear infinite' : 'ring-rotate-2 3s linear infinite',
          transition: 'all 2s ease'
        }}>
          <svg viewBox="0 0 300 300" className="w-full h-full">
            <circle cx="150" cy="150" r="130" fill="none" stroke="#00FFD5" strokeWidth="1" opacity="0.5" />
            {numbers.map((n, i) => {
              const angle = ((i * 40 - 90) * Math.PI) / 180;
              return (
                <text key={i} x={150 + 120 * Math.cos(angle)} y={150 + 120 * Math.sin(angle)}
                  textAnchor="middle" dominantBaseline="central" fontSize="18" fill="#00FFD5" opacity="0.8"
                  fontFamily="Orbitron">
                  {n}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Inner ring - Finance */}
        <div className="absolute inset-[35%]" style={{
          animation: synced ? 'rotate-slow 20s linear infinite' : 'ring-rotate-3 2s linear infinite',
          transition: 'all 2s ease'
        }}>
          <svg viewBox="0 0 150 150" className="w-full h-full">
            <circle cx="75" cy="75" r="60" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.5" />
            {candles.map((c, i) => {
              const angle = ((i * 45 - 90) * Math.PI) / 180;
              return (
                <text key={i} x={75 + 52 * Math.cos(angle)} y={75 + 52 * Math.sin(angle)}
                  textAnchor="middle" dominantBaseline="central" fontSize="14" fill="#FFD700" opacity="0.8">
                  {c}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Center - Infinity */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`transition-all duration-1000 ${synced ? 'scale-125' : 'scale-100'}`}>
            <svg viewBox="0 0 100 50" className="w-20 h-10 md:w-28 md:h-14">
              <path d="M25,25 C25,15 35,10 42,17 L50,25 L58,17 C65,10 75,15 75,25 C75,35 65,40 58,33 L50,25 L42,33 C35,40 25,35 25,25 Z"
                fill="none" stroke="#FFD700" strokeWidth="2.5" className={synced ? 'animate-infinity-glow' : ''} />
            </svg>
          </div>
        </div>

        {/* Sync flash */}
        {synced && (
          <div className="absolute inset-0 bg-[#FFD700]/5 rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );
}

function Scene7CallToAction({ progress }: { progress: number }) {
  const p = Math.min((progress - 48) / 7, 1);
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center px-6">
        {/* Character looking at camera */}
        <div className="mb-8 transition-all duration-700" style={{ opacity: p > 0.1 ? 1 : 0 }}>
          <svg viewBox="0 0 200 250" className="w-40 h-52 mx-auto">
            <path d="M100,30 C70,30 50,60 45,90 L35,220 C35,230 45,240 60,240 L140,240 C155,240 165,230 165,220 L155,90 C150,60 130,30 100,30 Z"
              fill="#111" stroke="#00FFD5" strokeWidth="0.5" />
            <ellipse cx="100" cy="70" rx="30" ry="35" fill="#050505" />
            <ellipse cx="88" cy="65" rx="7" ry="5" fill="#00FFD5">
              <animate attributeName="ry" values="5;4;5" dur="2s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="112" cy="65" rx="7" ry="5" fill="#00FFD5">
              <animate attributeName="ry" values="5;4;5" dur="2s" repeatCount="indefinite" />
            </ellipse>
            {/* Hand gesture - come here */}
            <g style={{ opacity: p > 0.3 ? 1 : 0, transition: 'opacity 0.5s' }}>
              <ellipse cx="160" cy="150" rx="12" ry="16" fill="rgba(0,255,213,0.1)" stroke="#00FFD5" strokeWidth="0.5" />
              <path d="M160,140 Q170,130 165,120" fill="none" stroke="#00FFD5" strokeWidth="0.5" opacity="0.7">
                <animate attributeName="d" values="M160,140 Q170,130 165,120;M160,140 Q175,125 170,115;M160,140 Q170,130 165,120" dur="1.5s" repeatCount="indefinite" />
              </path>
            </g>
          </svg>
        </div>

        {/* Holographic messages */}
        <div className="space-y-4">
          <div className={`hologram-bg rounded-lg px-6 py-3 transition-all duration-500 ${p > 0.3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="font-orbitron text-xs text-[#00FFD5]">СЛЕДУЮЩЕЕ ВИДЕО:</p>
            <p className="font-montserrat text-sm text-white mt-1">РАСЧЁТ ТВОЕГО ЧИСЛА СУДЬБЫ</p>
          </div>
          <div className={`hologram-bg rounded-lg px-6 py-3 transition-all duration-500 ${p > 0.5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <p className="font-orbitron text-xs text-[#FFD700]">ПОДПИШИСЬ:</p>
            <p className="font-montserrat text-sm text-white mt-1">ЧТОБЫ УЗНАТЬ СВОЙ КОД</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Scene8Logo({ progress }: { progress: number }) {
  const p = Math.min((progress - 55) / 5, 1);
  const glitching = p > 0.7 && p < 0.85;

  return (
    <div className="absolute inset-0 flex items-center justify-center"
      style={{ transform: glitching ? `translateX(${Math.random() * 4 - 2}px)` : 'none' }}>
      <div className="text-center transition-all duration-1000" style={{ opacity: p > 0.1 ? Math.min((p - 0.1) * 3, 1) : 0 }}>
        {/* Logo */}
        <div className="mb-6">
          <svg viewBox="0 0 200 100" className="w-48 h-24 mx-auto animate-infinity-glow">
            <path d="M50,50 C50,30 70,20 85,35 L100,50 L115,35 C130,20 150,30 150,50 C150,70 130,80 115,65 L100,50 L85,65 C70,80 50,70 50,50 Z"
              fill="none" stroke="#FFD700" strokeWidth="3" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <circle key={i} cx={100 + 35 * Math.cos((angle * Math.PI) / 180)} cy={50 + 15 * Math.sin((angle * Math.PI) / 180)}
                r="1.5" fill="#00FFD5" opacity={0.6 + Math.sin(i) * 0.4} />
            ))}
          </svg>
        </div>

        {/* Channel name */}
        <h1 className="font-orbitron text-3xl md:text-4xl font-black mb-2">
          <span className="text-[#00FFD5]">CYBER</span>
          <span className="text-[#FFD700] ml-3">ALCHEMY</span>
        </h1>
        <p className="text-gray-400 font-montserrat text-sm">ДРЕВНЯЯ МУДРОСТЬ • СОВРЕМЕННЫЕ ДЕНЬГИ</p>

        {/* Glitch overlay */}
        {glitching && (
          <div className="absolute inset-0 bg-[#00FFD5]/5 mix-blend-overlay"
            style={{ clipPath: `inset(${Math.random() * 50}% 0 ${Math.random() * 50}% 0)` }} />
        )}

        {/* Fade to black at end */}
        <div className="absolute inset-0 bg-black transition-opacity duration-1000"
          style={{ opacity: p > 0.85 ? (p - 0.85) * 6.67 : 0 }} />
      </div>
    </div>
  );
}

// ============ MAIN VIDEO PLAYER ============

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [exportStatus, setExportStatus] = useState<ExportStatus | null>(null);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const totalDuration = 60;

  const handleExport = useCallback(async () => {
    if (exportStatus?.state === 'rendering' || exportStatus?.state === 'encoding') {
      console.log('Export already in progress');
      return;
    }
    
    // Check support
    if (!isExportSupported()) {
      alert('Ваш браузер не поддерживает экспорт видео. Попробуйте Chrome, Edge или Firefox.');
      return;
    }
    
    console.log('🎬 Starting video export...');
    console.log('📊 Browser support:', {
      MediaRecorder: typeof MediaRecorder !== 'undefined',
      captureStream: typeof HTMLCanvasElement.prototype.captureStream === 'function',
    });
    
    setExportStatus({ state: 'rendering', progress: 0, message: 'Запуск...', format: 'webm' });
    
    try {
      await exportVideo((status) => {
        console.log('📹 Export progress:', status.state, status.progress + '%', status.message);
        setExportStatus(status);
      });
      console.log('✅ Export completed successfully!');
    } catch (err) {
      console.error('❌ Export failed:', err);
      setExportStatus({ 
        state: 'error', 
        progress: 0, 
        message: `Ошибка: ${err instanceof Error ? err.message : 'Неизвестная ошибка'}`, 
        format: 'webm' 
      });
    }
  }, [exportStatus]);

  const getCurrentScene = useCallback(() => {
    return scenes.find(s => currentTime >= s.start && currentTime < s.end) || scenes[scenes.length - 1];
  }, [currentTime]);

  const playSound = useCallback((time: number) => {
    if (time >= 0 && time < 0.1) { audio.cosmicHum(); audio.digitalActivation(); }
    if (time >= 4.5 && time < 4.7) audio.bassDrop();
    if (time >= 5 && time < 5.1) audio.hologramActivate();
    if (time >= 12 && time < 12.1) audio.whoosh();
    if (time >= 16 && time < 16.1) audio.goldenChime();
    if (time >= 20 && time < 20.1) audio.hologramActivate();
    if (time >= 28 && time < 28.1) { audio.numberTick(); audio.hologramActivate(); }
    if (time >= 35 && time < 35.1) audio.goldenChime();
    if (time >= 44 && time < 44.1) audio.syncChord();
    if (time >= 48 && time < 48.1) audio.digitalActivation();
    if (time >= 55 && time < 55.1) audio.logoAppear();
    if (time >= 58.5 && time < 58.7) audio.glitch();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    lastTimeRef.current = performance.now();

    const animate = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentTime(prev => {
        const next = prev + delta;
        if (next >= totalDuration) {
          setIsPlaying(false);
          return totalDuration;
        }
        playSound(next);
        return next;
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, playSound]);

  const handleStart = () => {
    audio.init();
    setHasStarted(true);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  const handlePlayPause = () => {
    if (currentTime >= totalDuration) {
      setCurrentTime(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    setCurrentTime(x * totalDuration);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const scene = getCurrentScene();
  const sceneProgress = (currentTime - scene.start) / (scene.end - scene.start);

  const renderScene = () => {
    switch (scene.id) {
      case 1: return <Scene1Awakening progress={currentTime} />;
      case 2: return <Scene2Interface progress={currentTime} />;
      case 3: return <Scene3Transformation progress={currentTime} />;
      case 4: return <Scene4Zodiac progress={currentTime} />;
      case 5: return <Scene5Destiny progress={currentTime} />;
      case 6: return <Scene6Synchronization progress={currentTime} />;
      case 7: return <Scene7CallToAction progress={currentTime} />;
      case 8: return <Scene8Logo progress={currentTime} />;
      default: return null;
    }
  };

  // Start screen
  if (!hasStarted) {
    return (
      <div className="relative w-full aspect-[9/16] max-h-[85vh] bg-[#0A0A0A] rounded-2xl overflow-hidden border border-[#00FFD5]/20 mx-auto cursor-pointer group"
        onClick={handleStart}>
        {/* Background */}
        <div className="absolute inset-0 cosmic-bg grid-overlay" />
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          {/* Logo */}
          <svg viewBox="0 0 200 100" className="w-36 h-18 mb-6 animate-infinity-glow">
            <path d="M50,50 C50,30 70,20 85,35 L100,50 L115,35 C130,20 150,30 150,50 C150,70 130,80 115,65 L100,50 L85,65 C70,80 50,70 50,50 Z"
              fill="none" stroke="#FFD700" strokeWidth="2.5" />
          </svg>
          <h2 className="font-orbitron text-2xl md:text-3xl font-bold mb-2">
            <span className="text-[#00FFD5]">CYBER</span>
            <span className="text-[#FFD700] ml-2">ALCHEMY</span>
          </h2>
          <p className="text-gray-400 text-xs font-montserrat mb-8">ИНТРО • 60 СЕК</p>

          {/* Play button */}
          <div className="w-20 h-20 rounded-full border-2 border-[#00FFD5]/50 flex items-center justify-center group-hover:border-[#00FFD5] group-hover:shadow-[0_0_30px_rgba(0,255,213,0.3)] transition-all duration-300">
            <svg className="w-8 h-8 text-[#00FFD5] ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <p className="text-[#00FFD5]/50 text-xs mt-4 font-montserrat animate-pulse">НАЖМИ ДЛЯ ЗАПУСКА</p>

          {/* Export button on start screen */}
          {exportStatus?.state === 'done' && (exportStatus.blob || exportStatus.blobUrl) ? (
            <div className="mt-6 space-y-2 w-full max-w-xs px-4">
              <button
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (exportStatus.blob) {
                    downloadBlob(exportStatus.blob);
                  } else if (exportStatus.blobUrl) {
                    downloadFromUrl(exportStatus.blobUrl);
                  }
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#FFD700]/30 to-[#00FFD5]/30 border border-[#FFD700]/60 rounded-lg font-orbitron text-xs text-[#FFD700] hover:bg-[#FFD700]/20 transition-all duration-300"
              >
                ⬇ СКАЧАТЬ ФАЙЛ
              </button>
              {exportStatus.blobUrl && (
                <button
                  onClick={(e) => { e.stopPropagation(); window.open(exportStatus.blobUrl!, '_blank'); }}
                  className="w-full px-4 py-2 border border-[#00FFD5]/30 rounded-lg font-orbitron text-[10px] text-[#00FFD5]/70 hover:bg-[#00FFD5]/10 transition-colors"
                >
                  ↗ ОТКРЫТЬ В НОВОЙ ВКЛАДКЕ
                </button>
              )}
              <p className="text-[8px] text-gray-500 text-center font-montserrat">
                Не скачивается? Откройте в новой вкладке → ПКМ → Сохранить
              </p>
            </div>
          ) : exportStatus?.state === 'rendering' || exportStatus?.state === 'encoding' ? (
            <div className="mt-6 w-full max-w-xs px-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-orbitron text-[10px] text-[#FFD700]">{exportStatus.message}</span>
                <span className="font-orbitron text-[10px] text-[#00FFD5]">{exportStatus.progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00FFD5] to-[#FFD700] rounded-full transition-all duration-300 animate-pulse"
                  style={{ width: `${exportStatus.progress}%` }}
                />
              </div>
              <p className="text-[8px] text-gray-500 mt-1 text-center font-montserrat">
                Не закрывайте вкладку
              </p>
            </div>
          ) : exportStatus?.state === 'error' ? (
            <div className="mt-6 text-center px-4">
              <p className="text-red-400 text-[10px] font-orbitron mb-2">{exportStatus.message}</p>
              <button
                onClick={(e) => { e.stopPropagation(); handleExport(); }}
                className="px-4 py-2 border border-red-400/30 rounded-lg font-orbitron text-[10px] text-red-400 hover:bg-red-400/10 transition-colors"
              >
                ПОВТОРИТЬ
              </button>
            </div>
          ) : isExportSupported() ? (
            <button
              onClick={(e) => { e.stopPropagation(); handleExport(); }}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-[#FFD700]/20 to-[#00FFD5]/20 border border-[#FFD700]/50 rounded-lg font-orbitron text-xs text-[#FFD700] hover:bg-[#FFD700]/10 transition-all duration-300"
            >
              ⬇ СКАЧАТЬ WEBM
            </button>
          ) : (
            <p className="mt-6 px-6 py-3 text-gray-500 text-xs font-montserrat text-center">
              Экспорт не поддерживается в вашем браузере
            </p>
          )}

          {/* Decorative corners */}
          <div className="absolute top-4 left-4 w-12 h-12 border-l border-t border-[#00FFD5]/20" />
          <div className="absolute top-4 right-4 w-12 h-12 border-r border-t border-[#FFD700]/20" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-l border-b border-[#9D4EDD]/20" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-r border-b border-[#00FFD5]/20" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[9/16] max-h-[85vh] bg-[#0A0A0A] rounded-2xl overflow-hidden border border-[#00FFD5]/20 mx-auto">
      {/* Scene content */}
      <div className="absolute inset-0 cosmic-bg">
        {renderScene()}
      </div>

      {/* Subtitle bar */}
      <div className="absolute bottom-20 left-0 right-0 px-6 z-20">
        <div className="text-center">
          <p className="font-montserrat font-bold text-lg md:text-xl text-white inline-block px-4 py-2 bg-[#0A0A0A]/70 rounded-lg backdrop-blur-sm">
            {scene.subtitle.split(' ').map((word, i) => (
              <span key={i} className={`inline-block mx-2 transition-all duration-300 ${
                sceneProgress > i * 0.15 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              } ${['ДРЕВНЯЯ', 'МУДРОСТЬ', 'ФИНАНСОВЫЙ', 'КОД', 'ТРАНСФОРМАЦИЯ', 'АСТРАЛЬНО', 'СУДЬБЫ', 'ВСЕЛЕННУЮ'].includes(word) ? 'text-[#FFD700]' : 'text-white'}`}>
                {word}{' '}
              </span>
            ))}
          </p>
        </div>
      </div>

      {/* Scene indicator */}
      <div className="absolute top-4 left-4 z-20">
        <div className="font-orbitron text-[10px] text-[#00FFD5]/70 bg-[#0A0A0A]/60 px-2 py-1 rounded backdrop-blur-sm">
          СЦЕНА {scene.id}/8 • {scene.name}
        </div>
      </div>

      {/* Time indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className="font-orbitron text-[10px] text-[#FFD700]/70 bg-[#0A0A0A]/60 px-2 py-1 rounded backdrop-blur-sm">
          {Math.floor(currentTime).toString().padStart(2, '0')}:{((currentTime % 1) * 100).toFixed(0).padStart(2, '0')} / 01:00
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[#0A0A0A]/90 to-transparent pt-8 pb-3 px-4">
        {/* Timeline */}
        <div className="relative h-1 bg-gray-800 rounded-full mb-3 cursor-pointer group" onClick={handleSeek}>
          {/* Scene markers */}
          {scenes.map((s, i) => (
            <div key={i} className="absolute top-0 bottom-0 w-[1px] bg-gray-600"
              style={{ left: `${(s.start / totalDuration) * 100}%` }} />
          ))}
          {/* Progress */}
          <div className="absolute top-0 left-0 bottom-0 rounded-full bg-gradient-to-r from-[#00FFD5] to-[#FFD700] transition-all duration-100"
            style={{ width: `${(currentTime / totalDuration) * 100}%` }} />
          {/* Playhead */}
          <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.5)] transition-all duration-100 group-hover:scale-125"
            style={{ left: `${(currentTime / totalDuration) * 100}%`, transform: 'translate(-50%, -50%)' }} />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <button onClick={handlePlayPause} className="w-8 h-8 rounded-full border border-[#00FFD5]/50 flex items-center justify-center hover:bg-[#00FFD5]/10 transition-colors">
              {isPlaying ? (
                <svg className="w-3 h-3 text-[#00FFD5]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-[#00FFD5] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            {/* Restart */}
            <button onClick={handleRestart} className="w-8 h-8 rounded-full border border-[#FFD700]/50 flex items-center justify-center hover:bg-[#FFD700]/10 transition-colors">
              <svg className="w-3 h-3 text-[#FFD700]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Scene name */}
          <div className="font-orbitron text-[10px] text-gray-400">
            {scene.name}
          </div>

          {/* Sound indicator */}
          <div className="flex items-center gap-1">
            <div className="w-1 h-2 bg-[#00FFD5]/50 rounded-full animate-pulse" />
            <div className="w-1 h-3 bg-[#00FFD5]/70 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="w-1 h-4 bg-[#00FFD5] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-1 h-3 bg-[#00FFD5]/70 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="w-1 h-2 bg-[#00FFD5]/50 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </div>

        {/* Export button */}
        {isExportSupported() && (
          <div className="mt-3 flex items-center justify-center">
            {exportStatus && (exportStatus.state === 'rendering' || exportStatus.state === 'encoding') ? (
              <div className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-orbitron text-[10px] text-[#FFD700]">{exportStatus.message}</span>
                  <span className="font-orbitron text-[10px] text-[#00FFD5]">{exportStatus.progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#00FFD5] to-[#FFD700] rounded-full transition-all duration-300 animate-pulse"
                    style={{ width: `${exportStatus.progress}%` }}
                  />
                </div>
                <p className="text-[8px] text-gray-500 mt-1 text-center font-montserrat">
                  Не закрывайте вкладку • Откройте консоль (F12) для подробностей
                </p>
              </div>
            ) : exportStatus?.state === 'done' ? (
              <div className="w-full space-y-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="font-orbitron text-[10px] text-[#00FFD5]">✓ ГОТОВО</span>
                </div>
                {(exportStatus.blob || exportStatus.blobUrl) && (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        if (exportStatus.blob) {
                          downloadBlob(exportStatus.blob);
                        } else if (exportStatus.blobUrl) {
                          downloadFromUrl(exportStatus.blobUrl);
                        }
                      }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-[#FFD700]/30 to-[#00FFD5]/30 border border-[#FFD700]/60 rounded-lg font-orbitron text-[10px] text-[#FFD700] hover:bg-[#FFD700]/20 transition-all duration-300"
                    >
                      ⬇ СКАЧАТЬ ФАЙЛ
                    </button>
                    {exportStatus.blobUrl && (
                      <button
                        onClick={() => window.open(exportStatus.blobUrl!, '_blank')}
                        className="w-full px-3 py-1.5 border border-[#00FFD5]/30 rounded-lg font-orbitron text-[9px] text-[#00FFD5]/70 hover:bg-[#00FFD5]/10 transition-colors"
                      >
                        ↗ ОТКРЫТЬ В НОВОЙ ВКЛАДКЕ
                      </button>
                    )}
                    <p className="text-[8px] text-gray-500 text-center font-montserrat">
                      Если не скачивается — откройте в новой вкладке и сохраните через ПКМ
                    </p>
                  </div>
                )}
                <button
                  onClick={handleExport}
                  className="w-full px-3 py-1 text-[10px] font-orbitron border border-[#00FFD5]/30 rounded text-[#00FFD5] hover:bg-[#00FFD5]/10 transition-colors"
                >
                  🔄 СОЗДАТЬ ЗАНОВО
                </button>
              </div>
            ) : exportStatus?.state === 'error' ? (
              <div className="text-center">
                <span className="font-orbitron text-[10px] text-red-400">{exportStatus.message}</span>
                <button
                  onClick={handleExport}
                  className="ml-2 px-3 py-1 text-[10px] font-orbitron border border-red-400/30 rounded text-red-400 hover:bg-red-400/10 transition-colors"
                >
                  ПОВТОРИТЬ
                </button>
              </div>
            ) : (
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-gradient-to-r from-[#FFD700]/20 to-[#00FFD5]/20 border border-[#FFD700]/50 rounded-lg font-orbitron text-[10px] text-[#FFD700] hover:bg-[#FFD700]/10 transition-all duration-300"
              >
                ⬇ СКАЧАТЬ WEBM (1080×1920)
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
