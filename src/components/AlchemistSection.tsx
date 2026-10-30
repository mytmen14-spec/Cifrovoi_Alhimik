import { useEffect, useRef, useState } from 'react';

export default function AlchemistSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="alchemist" ref={sectionRef} className="relative py-32 px-6 cosmic-bg">
      <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        <h2 className="font-orbitron text-3xl md:text-5xl font-bold text-center mb-4">
          <span className="text-[#00FFD5]">ЦИФРОВОЙ</span>{' '}
          <span className="text-[#FFD700]">АЛХИМИК</span>
        </h2>
        <p className="text-center text-gray-400 font-montserrat mb-16 max-w-2xl mx-auto">
          Астро-финансовый интерфейс — голографический дисплей, который показывает натальную карту как финансовый график, числа судьбы как свечи трейдинга, планеты как активы в портфеле
        </p>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Character SVG */}
          <div className="relative w-80 h-96 flex-shrink-0">
            {/* Glow behind character */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#00FFD5]/10 via-[#9D4EDD]/5 to-transparent rounded-full blur-3xl" />
            
            <svg viewBox="0 0 300 400" className="relative w-full h-full">
              {/* Hood/Cloak */}
              <path
                d="M150,60 C100,60 70,100 65,150 L55,350 C55,360 65,370 80,370 L220,370 C235,370 245,360 245,350 L235,150 C230,100 200,60 150,60 Z"
                fill="#111"
                stroke="#00FFD5"
                strokeWidth="1"
                opacity="0.9"
              />
              {/* Inner cloak detail */}
              <path
                d="M150,80 C110,80 85,110 80,150 L75,340 L225,340 L220,150 C215,110 190,80 150,80 Z"
                fill="#0A0A0A"
                stroke="#9D4EDD"
                strokeWidth="0.5"
                opacity="0.5"
              />
              
              {/* Hood opening - face area (dark, mysterious) */}
              <ellipse cx="150" cy="120" rx="45" ry="50" fill="#050505" />
              
              {/* Glowing eyes */}
              <g className="animate-eye-glow">
                <ellipse cx="135" cy="115" rx="8" ry="5" fill="#00FFD5" opacity="0.9" />
                <ellipse cx="165" cy="115" rx="8" ry="5" fill="#00FFD5" opacity="0.9" />
                {/* Numbers inside eyes */}
                <text x="135" y="117" textAnchor="middle" fontSize="4" fill="#0A0A0A" fontFamily="monospace">∞</text>
                <text x="165" y="117" textAnchor="middle" fontSize="4" fill="#0A0A0A" fontFamily="monospace">∞</text>
              </g>
              
              {/* Neon circuit lines on hoodie */}
              <g stroke="#00FFD5" strokeWidth="0.5" opacity="0.4" fill="none">
                <path d="M120,200 L120,250 L140,250 L140,280" />
                <path d="M180,200 L180,250 L160,250 L160,280" />
                <path d="M130,220 L170,220" />
                <path d="M135,240 L165,240" />
                <circle cx="140" cy="280" r="3" />
                <circle cx="160" cy="280" r="3" />
              </g>
              
              {/* Translucent hands with digital veins */}
              <g opacity="0.7">
                <ellipse cx="80" cy="300" rx="15" ry="20" fill="#00FFD5" opacity="0.1" stroke="#00FFD5" strokeWidth="0.5" />
                <ellipse cx="220" cy="300" rx="15" ry="20" fill="#00FFD5" opacity="0.1" stroke="#00FFD5" strokeWidth="0.5" />
                {/* Digital veins */}
                <g stroke="#00FFD5" strokeWidth="0.5" opacity="0.6" fill="none">
                  <path d="M75,290 L78,295 L75,300 L78,305" />
                  <path d="M82,290 L85,295 L82,300 L85,305" />
                  <path d="M215,290 L218,295 L215,300 L218,305" />
                  <path d="M222,290 L225,295 L222,300 L225,305" />
                </g>
              </g>
              
              {/* Holographic ring around head */}
              <g className="animate-rotate-slow" style={{ transformOrigin: '150px 110px' }}>
                <ellipse cx="150" cy="110" rx="65" ry="15" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.6" strokeDasharray="5,3" />
                {/* Zodiac symbols on the ring */}
                {['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'].map((symbol, i) => {
                  const angle = (i * 30 * Math.PI) / 180;
                  return (
                    <text
                      key={i}
                      x={150 + 60 * Math.cos(angle)}
                      y={110 + 13 * Math.sin(angle)}
                      textAnchor="middle"
                      fontSize="6"
                      fill="#FFD700"
                      opacity="0.7"
                    >
                      {symbol}
                    </text>
                  );
                })}
              </g>
            </svg>
          </div>

          {/* Character description */}
          <div className="flex-1 space-y-6">
            <div className="hologram-bg rounded-xl p-6">
              <h3 className="font-orbitron text-[#00FFD5] text-lg mb-3">⬡ ВНЕШНОСТЬ</h3>
              <ul className="space-y-2 text-gray-300 font-montserrat text-sm">
                <li className="flex items-start gap-2"><span className="text-[#00FFD5]">▹</span> Андроидный вид: кожа с лёгким металлическим отливом</li>
                <li className="flex items-start gap-2"><span className="text-[#00FFD5]">▹</span> Глаза светятся бирюзой, внутри — вращающиеся числа</li>
                <li className="flex items-start gap-2"><span className="text-[#00FFD5]">▹</span> Тёмный плащ с капюшоном, лицо скрыто в тени</li>
                <li className="flex items-start gap-2"><span className="text-[#00FFD5]">▹</span> Под плащом — худи с неоновыми схемами</li>
                <li className="flex items-start gap-2"><span className="text-[#00FFD5]">▹</span> Руки полупрозрачные, видны "цифровые вены"</li>
              </ul>
            </div>

            <div className="hologram-bg rounded-xl p-6">
              <h3 className="font-orbitron text-[#FFD700] text-lg mb-3">◈ ГОЛОГРАФИЧЕСКОЕ КОЛЬЦО</h3>
              <p className="text-gray-300 font-montserrat text-sm">
                Вокруг головы вращается кольцо с 12 зодиакальными символами. 
                Каждый символ связан с финансовым активом — от Bitcoin до недвижимости.
              </p>
            </div>

            <div className="hologram-bg rounded-xl p-6">
              <h3 className="font-orbitron text-[#9D4EDD] text-lg mb-3">✦ УНИКАЛЬНОСТЬ</h3>
              <p className="text-gray-300 font-montserrat text-sm">
                Когда зритель видит этот интерфейс — он мгновенно понимает, 
                что это "тот самый канал". Мгновенная узнаваемость бренда.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
