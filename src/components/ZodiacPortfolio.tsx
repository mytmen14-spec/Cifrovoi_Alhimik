import { useEffect, useRef, useState } from 'react';

const zodiacAssets = [
  { sign: '♈', name: 'Овен', asset: 'Bitcoin', icon: '₿', desc: 'Огонь, риск', color: '#FF4444' },
  { sign: '♉', name: 'Телец', asset: 'Золото', icon: '🥇', desc: 'Стабильность', color: '#FFD700' },
  { sign: '♊', name: 'Близнецы', asset: 'Tech Stocks', icon: '💻', desc: 'Коммуникация', color: '#00FFD5' },
  { sign: '♋', name: 'Рак', asset: 'Недвижимость', icon: '🏠', desc: 'Дом, семья', color: '#87CEEB' },
  { sign: '♌', name: 'Лев', asset: 'Люкс', icon: '💎', desc: 'Роскошь', color: '#FFD700' },
  { sign: '♍', name: 'Дева', asset: 'Index Fund', icon: '📊', desc: 'Анализ', color: '#9D4EDD' },
  { sign: '♎', name: 'Весы', asset: 'Баланс', icon: '⚖️', desc: 'Диверсификация', color: '#00FFD5' },
  { sign: '♏', name: 'Скорпион', asset: 'Crypto', icon: '🔮', desc: 'Волатильность', color: '#FF4444' },
  { sign: '♐', name: 'Стрелец', asset: 'Global', icon: '🌍', desc: 'Глобальные рынки', color: '#4169E1' },
  { sign: '♑', name: 'Козерог', asset: 'Real Estate', icon: '🏢', desc: 'Здания', color: '#8B4513' },
  { sign: '♒', name: 'Водолей', asset: 'Innovation', icon: '🚀', desc: 'Технологии', color: '#00CED1' },
  { sign: '♓', name: 'Рыбы', asset: 'Art & NFT', icon: '🎨', desc: 'Коллекционное', color: '#9D4EDD' },
];

export default function ZodiacPortfolio() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSign, setActiveSign] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="zodiac" ref={sectionRef} className="relative py-32 px-6 cosmic-bg">
      <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        <h2 className="font-orbitron text-3xl md:text-5xl font-bold text-center mb-4">
          <span className="text-[#9D4EDD]">ЗОДИАК</span>{' '}
          <span className="text-[#FFD700]">КАК ПОРТФЕЛЬ</span>
        </h2>
        <p className="text-center text-gray-400 font-montserrat mb-16 max-w-2xl mx-auto">
          Каждый знак зодиака соответствует определённому типу активов. 
          Твоя натальная карта подсказывает, куда инвестировать.
        </p>

        {/* Zodiac Wheel */}
        <div className="relative flex justify-center mb-16">
          <div className="relative w-[320px] h-[320px] md:w-[450px] md:h-[450px]">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 animate-rotate-slow">
              <svg viewBox="0 0 450 450" className="w-full h-full">
                <circle cx="225" cy="225" r="210" fill="none" stroke="#00FFD5" strokeWidth="0.5" opacity="0.3" />
                <circle cx="225" cy="225" r="180" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.2" />
                {/* Division lines */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  return (
                    <line
                      key={i}
                      x1={225 + 180 * Math.cos(angle)}
                      y1={225 + 180 * Math.sin(angle)}
                      x2={225 + 210 * Math.cos(angle)}
                      y2={225 + 210 * Math.sin(angle)}
                      stroke="#00FFD5"
                      strokeWidth="0.5"
                      opacity="0.4"
                    />
                  );
                })}
              </svg>
            </div>

            {/* Zodiac signs positioned around the wheel */}
            {zodiacAssets.map((zodiac, i) => {
              const angle = ((i * 30 - 90) * Math.PI) / 180;
              const radius = 160;
              const x = 50 + (radius * Math.cos(angle)) / 3.2;
              const y = 50 + (radius * Math.sin(angle)) / 3.2;
              
              return (
                <div
                  key={i}
                  className={`absolute cursor-pointer transition-all duration-300 ${
                    activeSign === i ? 'scale-125 z-10' : 'scale-100 hover:scale-110'
                  }`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) ${activeSign === i ? 'scale(1.25)' : 'scale(1)'}`,
                  }}
                  onMouseEnter={() => setActiveSign(i)}
                  onMouseLeave={() => setActiveSign(null)}
                >
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl border transition-all duration-300 ${
                      activeSign === i
                        ? 'border-[#FFD700] bg-[#FFD700]/20 shadow-[0_0_20px_rgba(255,215,0,0.4)]'
                        : 'border-[#00FFD5]/30 bg-[#0A0A0A]/80'
                    }`}
                  >
                    {zodiac.sign}
                  </div>
                </div>
              );
            })}

            {/* Center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border border-[#FFD700]/30 flex items-center justify-center bg-[#0A0A0A]/90">
                <div className="text-center">
                  <div className="text-[#FFD700] font-orbitron text-xs md:text-sm">ТВОЙ</div>
                  <div className="text-[#00FFD5] font-orbitron text-xs md:text-sm">КОД</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active sign detail */}
        {activeSign !== null && (
          <div className="max-w-md mx-auto hologram-bg rounded-xl p-6 text-center transition-all duration-300">
            <div className="text-4xl mb-2">{zodiacAssets[activeSign].icon}</div>
            <h3 className="font-orbitron text-lg mb-1" style={{ color: zodiacAssets[activeSign].color }}>
              {zodiacAssets[activeSign].sign} {zodiacAssets[activeSign].name}
            </h3>
            <p className="text-[#FFD700] font-montserrat font-bold">{zodiacAssets[activeSign].asset}</p>
            <p className="text-gray-400 text-sm mt-1">{zodiacAssets[activeSign].desc}</p>
          </div>
        )}

        {/* Grid of all signs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-12">
          {zodiacAssets.map((zodiac, i) => (
            <div
              key={i}
              className="hologram-bg rounded-lg p-4 text-center cursor-pointer hover:border-[#FFD700]/50 transition-all duration-300 group"
              onMouseEnter={() => setActiveSign(i)}
              onMouseLeave={() => setActiveSign(null)}
            >
              <div className="text-2xl mb-1">{zodiac.sign}</div>
              <div className="text-xs font-orbitron text-gray-400 group-hover:text-[#FFD700] transition-colors">
                {zodiac.asset}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
