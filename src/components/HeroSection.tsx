import { useState, useEffect } from 'react';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);

  const words = ['ДРЕВНЯЯ МУДРОСТЬ', 'ВСТРЕЧАЕТ', 'СОВРЕМЕННЫЕ ДЕНЬГИ'];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentWord(prev => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center cosmic-bg grid-overlay overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 opacity-15">
        <img
          src="https://image.qwenlm.ai/generated-images/c99c0942-1d40-4c32-86db-5f0661f736f4/_result.png"
          alt=""
          className="w-full h-full object-cover object-center"
          style={{ maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)' }}
        />
      </div>
      {/* Sacred Geometry Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10">
        <svg viewBox="0 0 400 400" className="w-[800px] h-[800px] animate-rotate-slow">
          {/* Flower of Life */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <circle
              key={i}
              cx={200 + 60 * Math.cos((angle * Math.PI) / 180)}
              cy={200 + 60 * Math.sin((angle * Math.PI) / 180)}
              r="60"
              fill="none"
              stroke="#00FFD5"
              strokeWidth="0.5"
            />
          ))}
          <circle cx="200" cy="200" r="60" fill="none" stroke="#FFD700" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="120" fill="none" stroke="#00FFD5" strokeWidth="0.3" />
          <circle cx="200" cy="200" r="180" fill="none" stroke="#9D4EDD" strokeWidth="0.3" />
        </svg>
      </div>

      {/* Main Content */}
      <div className={`relative z-10 text-center px-6 transition-all duration-1500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Infinity Symbol Logo */}
        <div className="mb-8 flex justify-center">
          <svg viewBox="0 0 200 100" className="w-48 h-24 animate-infinity-glow">
            <path
              d="M50,50 C50,30 70,20 85,35 L100,50 L115,35 C130,20 150,30 150,50 C150,70 130,80 115,65 L100,50 L85,65 C70,80 50,70 50,50 Z"
              fill="none"
              stroke="#FFD700"
              strokeWidth="3"
            />
            {/* Zodiac dots inside */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
              <circle
                key={i}
                cx={100 + 35 * Math.cos((angle * Math.PI) / 180)}
                cy={50 + 15 * Math.sin((angle * Math.PI) / 180)}
                r="1.5"
                fill="#00FFD5"
                opacity={0.6 + Math.sin(i) * 0.4}
              />
            ))}
          </svg>
        </div>

        {/* Title */}
        <h1 className="font-orbitron text-5xl md:text-7xl font-black mb-4">
          <span className="text-[#00FFD5] animate-glow-text">CYBER</span>
          <span className="text-[#FFD700] animate-gold-glow ml-4">ALCHEMY</span>
        </h1>

        {/* Subtitle with rotating words */}
        <div className="h-12 flex items-center justify-center mb-8">
          <p className="font-montserrat text-xl md:text-2xl text-gray-300 transition-all duration-500">
            {words.map((word, i) => (
              <span
                key={i}
                className={`inline-block mx-2 transition-all duration-500 ${
                  i === currentWord
                    ? 'text-[#FFD700] scale-110 font-bold'
                    : 'text-gray-500 scale-100'
                }`}
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-4 bg-gradient-to-r from-[#00FFD5]/20 to-[#9D4EDD]/20 border border-[#00FFD5]/50 rounded-lg font-orbitron text-[#00FFD5] hover:bg-[#00FFD5]/10 transition-all duration-300 animate-pulse-glow">
            УЗНАЙ СВОЙ КОД
          </button>
          <button className="px-8 py-4 bg-gradient-to-r from-[#FFD700]/20 to-[#9D4EDD]/20 border border-[#FFD700]/50 rounded-lg font-orbitron text-[#FFD700] hover:bg-[#FFD700]/10 transition-all duration-300">
            СМОТРЕТЬ ВИДЕО
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 animate-bounce">
          <svg className="w-6 h-6 mx-auto text-[#00FFD5]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-[#00FFD5]/30" />
      <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-[#FFD700]/30" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-[#9D4EDD]/30" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-[#00FFD5]/30" />
    </section>
  );
}
