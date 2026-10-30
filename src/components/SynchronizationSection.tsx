import { useEffect, useRef, useState } from 'react';

export default function SynchronizationSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [synced, setSynced] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const zodiacSymbols = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const candles = ['▮', '▯', '▮', '▯', '▮', '▮', '▯', '▮'];

  return (
    <section ref={sectionRef} className="relative py-32 px-6 cosmic-bg">
      <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        <h2 className="font-orbitron text-3xl md:text-5xl font-bold text-center mb-4">
          <span className="text-[#00FFD5]">СИНХРОНИЗАЦИЯ</span>{' '}
          <span className="text-[#9D4EDD]">ТРЁХ МИРОВ</span>
        </h2>
        <p className="text-center text-gray-400 font-montserrat mb-16 max-w-2xl mx-auto">
          Астрология × Нумерология × Инвестиции. Когда все три кольца вращаются в унисон — ты синхронизирован с Вселенной, рынком и собой.
        </p>

        {/* Three Rings */}
        <div className="flex justify-center mb-12">
          <div className="relative w-[340px] h-[340px] md:w-[500px] md:h-[500px]">
            {/* Outer ring - Zodiac */}
            <div
              className="absolute inset-0"
              style={{
                animation: synced ? 'rotate-slow 20s linear infinite' : 'ring-rotate-1 8s linear infinite',
                transition: 'all 2s ease'
              }}
            >
              <svg viewBox="0 0 500 500" className="w-full h-full">
                <circle cx="250" cy="250" r="230" fill="none" stroke="#9D4EDD" strokeWidth="1" opacity="0.4" />
                <circle cx="250" cy="250" r="215" fill="none" stroke="#9D4EDD" strokeWidth="0.5" opacity="0.2" />
                {zodiacSymbols.map((symbol, i) => {
                  const angle = ((i * 30 - 90) * Math.PI) / 180;
                  return (
                    <text
                      key={i}
                      x={250 + 222 * Math.cos(angle)}
                      y={250 + 222 * Math.sin(angle)}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="16"
                      fill="#9D4EDD"
                      opacity="0.8"
                    >
                      {symbol}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Middle ring - Numbers */}
            <div
              className="absolute inset-[15%]"
              style={{
                animation: synced ? 'rotate-slow 20s linear infinite' : 'ring-rotate-2 6s linear infinite',
                transition: 'all 2s ease'
              }}
            >
              <svg viewBox="0 0 350 350" className="w-full h-full">
                <circle cx="175" cy="175" r="155" fill="none" stroke="#00FFD5" strokeWidth="1" opacity="0.4" />
                <circle cx="175" cy="175" r="140" fill="none" stroke="#00FFD5" strokeWidth="0.5" opacity="0.2" />
                {numbers.map((num, i) => {
                  const angle = ((i * 40 - 90) * Math.PI) / 180;
                  return (
                    <text
                      key={i}
                      x={175 + 147 * Math.cos(angle)}
                      y={175 + 147 * Math.sin(angle)}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="18"
                      fill="#00FFD5"
                      opacity="0.8"
                      fontFamily="Orbitron"
                    >
                      {num}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Inner ring - Finance */}
            <div
              className="absolute inset-[30%]"
              style={{
                animation: synced ? 'rotate-slow 20s linear infinite' : 'ring-rotate-3 4s linear infinite',
                transition: 'all 2s ease'
              }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="85" fill="none" stroke="#FFD700" strokeWidth="1" opacity="0.4" />
                <circle cx="100" cy="100" r="72" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.2" />
                {candles.map((candle, i) => {
                  const angle = ((i * 45 - 90) * Math.PI) / 180;
                  return (
                    <text
                      key={i}
                      x={100 + 78 * Math.cos(angle)}
                      y={100 + 78 * Math.sin(angle)}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="14"
                      fill="#FFD700"
                      opacity="0.8"
                    >
                      {candle}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Center - Infinity */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setSynced(!synced)}
                className={`relative z-10 transition-all duration-500 ${synced ? 'scale-110' : 'hover:scale-105'}`}
              >
                <svg viewBox="0 0 100 50" className="w-24 h-12 md:w-32 md:h-16">
                  <path
                    d="M25,25 C25,15 35,10 42,17 L50,25 L58,17 C65,10 75,15 75,25 C75,35 65,40 58,33 L50,25 L42,33 C35,40 25,35 25,25 Z"
                    fill="none"
                    stroke={synced ? '#FFD700' : '#FFD700'}
                    strokeWidth="2.5"
                    className={synced ? 'animate-infinity-glow' : ''}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`font-orbitron text-[8px] md:text-[10px] ${synced ? 'text-[#FFD700]' : 'text-gray-400'}`}>
                    {synced ? 'SYNC' : 'TAP'}
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Sync status */}
        <div className="text-center">
          <div className={`inline-block px-6 py-3 rounded-full border transition-all duration-500 ${
            synced
              ? 'border-[#FFD700]/50 bg-[#FFD700]/10 text-[#FFD700]'
              : 'border-[#00FFD5]/30 bg-[#00FFD5]/5 text-[#00FFD5]/70'
          }`}>
            <span className="font-orbitron text-sm">
              {synced ? '✦ ВСЕЛЕННАЯ СИНХРОНИЗИРОВАНА ✦' : '○ Нажми на ∞ для синхронизации'}
            </span>
          </div>
        </div>

        {/* Description cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="hologram-bg rounded-xl p-6 text-center">
            <div className="text-3xl mb-3 text-[#9D4EDD]">♈♉♊♋♌♍♎♏♐♑♒♓</div>
            <h4 className="font-orbitron text-[#9D4EDD] text-sm mb-2">АСТРОЛОГИЯ</h4>
            <p className="text-gray-400 text-xs">Космические циклы влияют на рынки. Планетарные аспекты = рыночные тренды.</p>
          </div>
          <div className="hologram-bg rounded-xl p-6 text-center">
            <div className="text-3xl mb-3 text-[#00FFD5] font-orbitron">1 2 3 4 5 6 7 8 9</div>
            <h4 className="font-orbitron text-[#00FFD5] text-sm mb-2">НУМЕРОЛОГИЯ</h4>
            <p className="text-gray-400 text-xs">Числа управляют временем. Циклы Фибоначчи = ритмы рынка.</p>
          </div>
          <div className="hologram-bg rounded-xl p-6 text-center">
            <div className="text-3xl mb-3 text-[#FFD700]">📈📊💹</div>
            <h4 className="font-orbitron text-[#FFD700] text-sm mb-2">ИНВЕСТИЦИИ</h4>
            <p className="text-gray-400 text-xs">Финансовые инструменты — практическое применение космических знаний.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
