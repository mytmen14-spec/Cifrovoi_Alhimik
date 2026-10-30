import { useState, useEffect, useRef } from 'react';

const destinyMeanings: Record<number, { title: string; desc: string; strategy: string }> = {
  1: { title: 'ЛИДЕР', desc: 'Новые начинания, независимость, риск', strategy: 'Стартапы, венчур, первопроходец' },
  2: { title: 'ДИПЛОМАТ', desc: 'Партнёрство, баланс, терпение', strategy: 'Совместные проекты, медиация' },
  3: { title: 'ТВОРЕЦ', desc: 'Креативность, общение, экспрессия', strategy: 'Медиа, контент, маркетинг' },
  4: { title: 'СТРОИТЕЛЬ', desc: 'Стабильность, порядок, труд', strategy: 'Недвижимость, инфраструктура' },
  5: { title: 'ИССЛЕДОВАТЕЛЬ', desc: 'Свобода, перемены, приключения', strategy: 'Трейдинг, путешествия, крипто' },
  6: { title: 'ОПУН', desc: 'Ответственность, семья, гармония', strategy: 'Семейный бизнес, образование' },
  7: { title: 'МЫСЛИТЕЛЬ', desc: 'Анализ, мудрость, духовность', strategy: 'Аналитика, исследования, IT' },
  8: { title: 'МАГНАТ', desc: 'Власть, деньги, амбиции', strategy: 'Корпорации, инвестиции, банки' },
  9: { title: 'ГУМАНИСТ', desc: 'Завершение, мудрость, служение', strategy: 'Благотворительность, ESG' },
};

export default function DestinyCalculator() {
  const [date, setDate] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [steps, setSteps] = useState<string[]>([]);
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

  const calculate = () => {
    if (!date) return;
    const digits = date.replace(/\D/g, '').split('').map(Number);
    const allSteps: string[] = [];
    
    let sum = digits.reduce((a, b) => a + b, 0);
    allSteps.push(digits.join('+') + ' = ' + sum);
    
    while (sum > 9) {
      const newDigits = sum.toString().split('').map(Number);
      const newSum = newDigits.reduce((a, b) => a + b, 0);
      allSteps.push(newDigits.join('+') + ' = ' + newSum);
      sum = newSum;
    }
    
    setSteps(allSteps);
    setResult(sum === 0 ? 1 : sum);
  };

  return (
    <section id="destiny" ref={sectionRef} className="relative py-32 px-6">
      <div className={`max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        <h2 className="font-orbitron text-3xl md:text-5xl font-bold text-center mb-4">
          <span className="text-[#FFD700]">ЧИСЛО</span>{' '}
          <span className="text-[#00FFD5]">СУДЬБЫ</span>
        </h2>
        <p className="text-center text-gray-400 font-montserrat mb-12 max-w-2xl mx-auto">
          Твоё число судьбы = твоя финансовая стратегия. Введи дату рождения и узнай свой астрально-финансовый код.
        </p>

        {/* Calculator */}
        <div className="hologram-bg rounded-2xl p-8 max-w-lg mx-auto">
          <div className="mb-6">
            <label className="block text-[#00FFD5] font-orbitron text-sm mb-2">ДАТА РОЖДЕНИЯ</label>
            <input
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setResult(null); setSteps([]); }}
              className="w-full bg-[#0A0A0A] border border-[#00FFD5]/30 rounded-lg px-4 py-3 text-white font-montserrat focus:border-[#00FFD5] focus:outline-none transition-colors"
            />
          </div>
          
          <button
            onClick={calculate}
            disabled={!date}
            className="w-full py-3 bg-gradient-to-r from-[#FFD700]/20 to-[#00FFD5]/20 border border-[#FFD700]/50 rounded-lg font-orbitron text-[#FFD700] hover:bg-[#FFD700]/10 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            РАССЧИТАТЬ КОД
          </button>

          {/* Calculation steps */}
          {steps.length > 0 && (
            <div className="mt-8 space-y-3">
              <h4 className="font-orbitron text-xs text-gray-400 mb-4">ВЫЧИСЛЕНИЕ:</h4>
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-montserrat">
                  <span className="w-5 h-5 rounded-full bg-[#9D4EDD]/20 border border-[#9D4EDD]/50 flex items-center justify-center text-[10px] text-[#9D4EDD]">
                    {i + 1}
                  </span>
                  <span className="text-gray-300 font-mono">{step}</span>
                </div>
              ))}
            </div>
          )}

          {/* Result */}
          {result !== null && destinyMeanings[result] && (
            <div className="mt-8 text-center animate-slide-up">
              <div className="inline-block w-20 h-20 rounded-full border-2 border-[#FFD700] flex items-center justify-center mb-4 animate-pulse-glow">
                <span className="font-orbitron text-3xl text-[#FFD700] animate-gold-glow">{result}</span>
              </div>
              <h3 className="font-orbitron text-xl text-[#FFD700] mb-2">{destinyMeanings[result].title}</h3>
              <p className="text-gray-300 font-montserrat text-sm mb-3">{destinyMeanings[result].desc}</p>
              <div className="hologram-bg rounded-lg p-3 mt-4">
                <p className="text-[#00FFD5] text-xs font-orbitron mb-1">ФИНАНСОВАЯ СТРАТЕГИЯ:</p>
                <p className="text-gray-300 text-sm">{destinyMeanings[result].strategy}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sacred geometry decoration */}
        <div className="flex justify-center mt-12 opacity-20">
          <svg viewBox="0 0 200 200" className="w-32 h-32 animate-sacred-pulse">
            <circle cx="100" cy="100" r="80" fill="none" stroke="#FFD700" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="#00FFD5" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="#9D4EDD" strokeWidth="0.5" />
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <circle
                key={i}
                cx={100 + 40 * Math.cos((angle * Math.PI) / 180)}
                cy={100 + 40 * Math.sin((angle * Math.PI) / 180)}
                r="40"
                fill="none"
                stroke="#FFD700"
                strokeWidth="0.3"
              />
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
