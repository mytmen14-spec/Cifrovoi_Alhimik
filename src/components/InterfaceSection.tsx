import { useEffect, useRef, useState } from 'react';

export default function InterfaceSection() {
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
    <section id="interface" ref={sectionRef} className="relative py-32 px-6">
      <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        <h2 className="font-orbitron text-3xl md:text-5xl font-bold text-center mb-4">
          <span className="text-[#FFD700]">АСТРАЛЬНО-ФИНАНСОВЫЙ</span>{' '}
          <span className="text-[#00FFD5]">ИНТЕРФЕЙС</span>
        </h2>
        <p className="text-center text-gray-400 font-montserrat mb-16 max-w-2xl mx-auto">
          Голографический дисплей, реагирующий на каждое действие. Графики подсвечиваются при разговоре о деньгах, сакральная геометрия — при разговоре об эзотерике.
        </p>

        {/* Interface Mockup */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main holographic frame */}
          <div className="relative border border-[#00FFD5]/30 rounded-2xl p-8 hologram-bg overflow-hidden">
            {/* Scan line effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#00FFD5]/30 to-transparent"
                style={{ animation: 'hologram-scan 4s linear infinite' }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left: Natal Chart */}
              <div className="relative">
                <h3 className="font-orbitron text-[#00FFD5] text-sm mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00FFD5] animate-pulse" />
                  НАТАЛЬНАЯ КАРТА = ФИНАНСОВЫЙ КОД
                </h3>
                <svg viewBox="0 0 300 300" className="w-full max-w-[280px] mx-auto">
                  {/* Outer circle */}
                  <circle cx="150" cy="150" r="130" fill="none" stroke="#00FFD5" strokeWidth="0.5" opacity="0.3" />
                  <circle cx="150" cy="150" r="100" fill="none" stroke="#FFD700" strokeWidth="0.5" opacity="0.3" />
                  <circle cx="150" cy="150" r="70" fill="none" stroke="#9D4EDD" strokeWidth="0.5" opacity="0.3" />
                  
                  {/* Planet/Asset positions */}
                  {[
                    { angle: 0, label: '☉', asset: 'BTC', color: '#FFD700' },
                    { angle: 45, label: '☽', asset: 'GOLD', color: '#C0C0C0' },
                    { angle: 90, label: '☿', asset: 'AAPL', color: '#00FFD5' },
                    { angle: 135, label: '♀', asset: 'LUX', color: '#FF69B4' },
                    { angle: 180, label: '♂', asset: 'OIL', color: '#FF4444' },
                    { angle: 225, label: '♃', asset: 'REAL', color: '#9D4EDD' },
                    { angle: 270, label: '♄', asset: 'BOND', color: '#666' },
                    { angle: 315, label: '♅', asset: 'ETH', color: '#627EEA' },
                  ].map((planet, i) => {
                    const x = 150 + 100 * Math.cos((planet.angle * Math.PI) / 180);
                    const y = 150 + 100 * Math.sin((planet.angle * Math.PI) / 180);
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="12" fill={planet.color} opacity="0.15" />
                        <circle cx={x} cy={y} r="12" fill="none" stroke={planet.color} strokeWidth="0.5" />
                        <text x={x} y={y - 2} textAnchor="middle" fontSize="10" fill={planet.color}>
                          {planet.label}
                        </text>
                        <text x={x} y={y + 8} textAnchor="middle" fontSize="5" fill={planet.color} opacity="0.7">
                          {planet.asset}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Aspect lines */}
                  <line x1="150" y1="50" x2="250" y2="150" stroke="#00FFD5" strokeWidth="0.3" opacity="0.3" strokeDasharray="3,3" />
                  <line x1="50" y1="150" x2="150" y2="250" stroke="#FFD700" strokeWidth="0.3" opacity="0.3" strokeDasharray="3,3" />
                  
                  {/* Center */}
                  <circle cx="150" cy="150" r="5" fill="#00FFD5" opacity="0.5" />
                </svg>
              </div>

              {/* Right: Trading Chart */}
              <div className="relative">
                <h3 className="font-orbitron text-[#FFD700] text-sm mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
                  ГРАФИК + ЧИСЛА ФИБОНАЧЧИ
                </h3>
                <svg viewBox="0 0 300 300" className="w-full max-w-[280px] mx-auto">
                  {/* Grid */}
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <line key={`h${i}`} x1="30" y1={50 + i * 40} x2="280" y2={50 + i * 40} stroke="#00FFD5" strokeWidth="0.2" opacity="0.2" />
                  ))}
                  
                  {/* Fibonacci levels */}
                  {[
                    { y: 70, label: '4.236', color: '#FFD700' },
                    { y: 120, label: '2.618', color: '#FFD700' },
                    { y: 170, label: '1.618', color: '#00FFD5' },
                    { y: 220, label: '1.000', color: '#9D4EDD' },
                    { y: 260, label: '0.618', color: '#9D4EDD' },
                  ].map((fib, i) => (
                    <g key={i}>
                      <line x1="30" y1={fib.y} x2="280" y2={fib.y} stroke={fib.color} strokeWidth="0.5" opacity="0.4" strokeDasharray="5,5" />
                      <text x="285" y={fib.y + 3} fontSize="7" fill={fib.color} opacity="0.7">{fib.label}</text>
                    </g>
                  ))}
                  
                  {/* Candlesticks */}
                  {[
                    { x: 50, open: 200, close: 170, high: 155, low: 210, bull: false },
                    { x: 75, open: 170, close: 180, high: 160, low: 190, bull: true },
                    { x: 100, open: 180, close: 160, high: 150, low: 190, bull: false },
                    { x: 125, open: 160, close: 140, high: 130, low: 170, bull: false },
                    { x: 150, open: 140, close: 155, high: 130, low: 165, bull: true },
                    { x: 175, open: 155, close: 135, high: 125, low: 165, bull: false },
                    { x: 200, open: 135, close: 120, high: 110, low: 145, bull: false },
                    { x: 225, open: 120, close: 140, high: 110, low: 150, bull: true },
                    { x: 250, open: 140, close: 115, high: 105, low: 150, bull: false },
                  ].map((candle, i) => {
                    const color = candle.bull ? '#00FFD5' : '#FF4444';
                    return (
                      <g key={i}>
                        {/* Wick */}
                        <line x1={candle.x} y1={candle.high} x2={candle.x} y2={candle.low} stroke={color} strokeWidth="1" opacity="0.7" />
                        {/* Body */}
                        <rect
                          x={candle.x - 6}
                          y={Math.min(candle.open, candle.close)}
                          width="12"
                          height={Math.abs(candle.close - candle.open)}
                          fill={candle.bull ? color : color}
                          opacity="0.8"
                          rx="1"
                        />
                      </g>
                    );
                  })}
                  
                  {/* Moving average line */}
                  <path
                    d="M50,190 Q75,175 100,170 T150,150 T200,135 T250,130"
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="1.5"
                    opacity="0.6"
                  />
                </svg>
              </div>
            </div>

            {/* Bottom: Alchemical symbols */}
            <div className="mt-8 flex justify-center items-center gap-8">
              <div className="text-center">
                <div className="text-3xl text-gray-500 mb-1">☿</div>
                <div className="text-[10px] text-gray-500 font-orbitron">СВИНЕЦ (Pb)</div>
                <div className="text-[10px] text-gray-600">ПАССИВЫ</div>
              </div>
              <div className="flex items-center">
                <svg viewBox="0 0 60 20" className="w-16 h-6">
                  <path d="M5,10 L25,10 M20,5 L25,10 L20,15" stroke="#FFD700" strokeWidth="1.5" fill="none" />
                  <path d="M35,10 L55,10 M50,5 L55,10 L50,15" stroke="#FFD700" strokeWidth="1.5" fill="none" />
                  <circle cx="30" cy="10" r="4" fill="none" stroke="#FFD700" strokeWidth="1" />
                </svg>
              </div>
              <div className="text-center">
                <div className="text-3xl text-[#FFD700] animate-gold-glow mb-1">☉</div>
                <div className="text-[10px] text-[#FFD700] font-orbitron">ЗОЛОТО (Au)</div>
                <div className="text-[10px] text-[#FFD700]/60">АКТИВЫ</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
