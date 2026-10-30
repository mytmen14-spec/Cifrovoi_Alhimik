import { useEffect, useRef, useState } from 'react';

export default function AlchemySection() {
  const [isVisible, setIsVisible] = useState(false);
  const [transforming, setTransforming] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89];

  return (
    <section ref={sectionRef} className="relative py-32 px-6">
      <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        <h2 className="font-orbitron text-3xl md:text-5xl font-bold text-center mb-4">
          <span className="text-[#FFD700]">АЛХИМИЯ</span>{' '}
          <span className="text-[#00FFD5]">ДЕНЕГ</span>
        </h2>
        <p className="text-center text-gray-400 font-montserrat mb-16 max-w-2xl mx-auto">
          Трансформируй пассивы в активы. Как древние алхимики превращали свинец в золото, 
          так и ты можешь трансформировать свои финансы.
        </p>

        {/* Alchemical Circle */}
        <div className="flex justify-center mb-16">
          <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
            {/* Sacred geometry background */}
            <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full animate-sacred-pulse">
              {/* Flower of Life pattern */}
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <circle
                  key={i}
                  cx={200 + 50 * Math.cos((angle * Math.PI) / 180)}
                  cy={200 + 50 * Math.sin((angle * Math.PI) / 180)}
                  r="50"
                  fill="none"
                  stroke="#9D4EDD"
                  strokeWidth="0.3"
                  opacity="0.3"
                />
              ))}
              <circle cx="200" cy="200" r="50" fill="none" stroke="#9D4EDD" strokeWidth="0.3" opacity="0.3" />
              
              {/* Outer circle */}
              <circle cx="200" cy="200" r="170" fill="none" stroke="#00FFD5" strokeWidth="0.5" opacity="0.3" />
              <circle cx="200" cy="200" r="160" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.2" />
            </svg>

            {/* Fibonacci numbers around the circle */}
            <div className="absolute inset-0 animate-rotate-reverse">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {fibonacci.map((num, i) => {
                  const angle = ((i * (360 / fibonacci.length) - 90) * Math.PI) / 180;
                  return (
                    <text
                      key={i}
                      x={200 + 155 * Math.cos(angle)}
                      y={200 + 155 * Math.sin(angle)}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="14"
                      fill="#FFD700"
                      opacity="0.7"
                      fontFamily="Orbitron"
                    >
                      {num}
                    </text>
                  );
                })}
              </svg>
            </div>

            {/* Center transformation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setTransforming(!transforming)}
                className="relative cursor-pointer"
              >
                <div className={`w-32 h-32 md:w-40 md:h-40 rounded-full border-2 flex items-center justify-center transition-all duration-1000 ${
                  transforming
                    ? 'border-[#FFD700] bg-[#FFD700]/10 shadow-[0_0_40px_rgba(255,215,0,0.3)]'
                    : 'border-gray-600 bg-[#0A0A0A]'
                }`}>
                  <div className="text-center">
                    <div className={`text-3xl md:text-4xl transition-all duration-1000 ${
                      transforming ? 'text-[#FFD700] animate-gold-glow' : 'text-gray-500'
                    }`}>
                      {transforming ? '☉' : '☿'}
                    </div>
                    <div className={`text-[10px] font-orbitron mt-1 transition-colors duration-1000 ${
                      transforming ? 'text-[#FFD700]' : 'text-gray-500'
                    }`}>
                      {transforming ? 'Au — ЗОЛОТО' : 'Pb — СВИНЕЦ'}
                    </div>
                  </div>
                </div>
                
                {/* Transformation arrows */}
                {transforming && (
                  <div className="absolute -top-4 -right-4 text-[#FFD700] animate-bounce">
                    ✦
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Transformation explanation */}
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="hologram-bg rounded-xl p-6 border-l-2 border-l-gray-600">
              <h4 className="font-orbitron text-gray-400 text-sm mb-3">☿ СВИНЕЦ (ПАССИВЫ)</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2"><span className="text-gray-600">▸</span> Кредитные долги</li>
                <li className="flex items-center gap-2"><span className="text-gray-600">▸</span> Подписки без ценности</li>
                <li className="flex items-center gap-2"><span className="text-gray-600">▸</span> Вещи, теряющие стоимость</li>
                <li className="flex items-center gap-2"><span className="text-gray-600">▸</span> Эмоциональные покупки</li>
              </ul>
            </div>
            <div className={`hologram-bg rounded-xl p-6 border-l-2 transition-all duration-1000 ${
              transforming ? 'border-l-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.1)]' : 'border-l-gray-600'
            }`}>
              <h4 className={`font-orbitron text-sm mb-3 transition-colors duration-1000 ${
                transforming ? 'text-[#FFD700]' : 'text-gray-400'
              }`}>☉ ЗОЛОТО (АКТИВЫ)</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2"><span className="text-[#FFD700]">▸</span> Инвестиционный портфель</li>
                <li className="flex items-center gap-2"><span className="text-[#FFD700]">▸</span> Недвижимость</li>
                <li className="flex items-center gap-2"><span className="text-[#FFD700]">▸</span> Бизнес / стартап</li>
                <li className="flex items-center gap-2"><span className="text-[#FFD700]">▸</span> Знания и навыки</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Instruction */}
        <p className="text-center text-gray-500 text-sm mt-8 font-montserrat">
          ↑ Нажми на алхимический символ для трансформации
        </p>
      </div>
    </section>
  );
}
