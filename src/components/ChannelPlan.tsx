import { useEffect, useRef, useState } from 'react';

const episodes = [
  {
    num: 1,
    title: 'Введение в концепцию',
    desc: 'Знакомство с Цифровым Алхимиком и астрально-финансовым интерфейсом',
    color: '#00FFD5',
    icon: '∞'
  },
  {
    num: 2,
    title: 'Рассчитай своё число судьбы',
    desc: 'Нумерология + финансы: как число рождения определяет стратегию',
    color: '#FFD700',
    icon: '1'
  },
  {
    num: 3,
    title: 'Твой зодиак = твой портфель',
    desc: '12 знаков зодиака как 12 типов инвестиционных активов',
    color: '#9D4EDD',
    icon: '♈'
  },
  {
    num: 4,
    title: 'Планеты как активы',
    desc: 'Куда инвестировать по натальной карте: Солнце = BTC, Луна = золото',
    color: '#00FFD5',
    icon: '☉'
  },
  {
    num: 5,
    title: 'Алхимия денег',
    desc: 'Трансформируй пассивы в активы по законам древней алхимии',
    color: '#FFD700',
    icon: '☿→☉'
  },
  {
    num: 6,
    title: 'Сакральная геометрия рынка',
    desc: 'Уровни Фибоначчи, золотое сечение и паттерны на графиках',
    color: '#9D4EDD',
    icon: 'φ'
  },
];

export default function ChannelPlan() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeEpisode, setActiveEpisode] = useState(0);
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
    <section id="plan" ref={sectionRef} className="relative py-32 px-6 cosmic-bg">
      <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
        <h2 className="font-orbitron text-3xl md:text-5xl font-bold text-center mb-4">
          <span className="text-[#00FFD5]">ПЛАН</span>{' '}
          <span className="text-[#FFD700]">КАНАЛА</span>
        </h2>
        <p className="text-center text-gray-400 font-montserrat mb-16 max-w-2xl mx-auto">
          Каждое видео использует тот же визуальный стиль → зрители узнают канал с первого кадра → подписка.
        </p>

        {/* Episodes timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#00FFD5] via-[#FFD700] to-[#9D4EDD] opacity-30" />

          <div className="space-y-8">
            {episodes.map((ep, i) => (
              <div
                key={i}
                className={`relative flex items-center gap-6 cursor-pointer transition-all duration-300 ${
                  i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } ${activeEpisode === i ? 'scale-[1.02]' : 'hover:scale-[1.01]'}`}
                onMouseEnter={() => setActiveEpisode(i)}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 -translate-x-1/2 rounded-full border-2 z-10 transition-all duration-300"
                  style={{
                    borderColor: ep.color,
                    backgroundColor: activeEpisode === i ? ep.color : 'transparent',
                    boxShadow: activeEpisode === i ? `0 0 15px ${ep.color}` : 'none'
                  }}
                />

                {/* Content card */}
                <div className={`ml-14 md:ml-0 md:w-[45%] ${i % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                  <div
                    className={`hologram-bg rounded-xl p-6 transition-all duration-300 ${
                      activeEpisode === i ? 'border-opacity-60' : ''
                    }`}
                    style={{
                      borderColor: activeEpisode === i ? ep.color : undefined,
                      boxShadow: activeEpisode === i ? `0 0 20px ${ep.color}20` : 'none'
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-orbitron text-xs px-2 py-1 rounded" style={{ color: ep.color, backgroundColor: `${ep.color}15` }}>
                        EP.{ep.num}
                      </span>
                      <span className="text-xl" style={{ color: ep.color }}>{ep.icon}</span>
                    </div>
                    <h3 className="font-orbitron text-sm md:text-base mb-2" style={{ color: ep.color }}>
                      {ep.title}
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm">{ep.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why it works */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'УНИКАЛЬНОСТЬ', desc: 'Никто не объединяет зодиак с трейдингом так визуально', icon: '✦', color: '#00FFD5' },
            { title: 'УЗНАВАЕМОСТЬ', desc: 'Голографический интерфейс = мгновенный брендинг', icon: '◈', color: '#FFD700' },
            { title: 'ДВЕ АУДИТОРИИ', desc: 'Привлекает и эзотериков, и инвесторов', icon: '⬡', color: '#9D4EDD' },
            { title: 'СЕРИАЛЬНОСТЬ', desc: 'Каждое видео — новый элемент расчёта', icon: '∞', color: '#00FFD5' },
          ].map((item, i) => (
            <div key={i} className="hologram-bg rounded-xl p-6 text-center hover:scale-105 transition-transform duration-300">
              <div className="text-2xl mb-3" style={{ color: item.color }}>{item.icon}</div>
              <h4 className="font-orbitron text-xs mb-2" style={{ color: item.color }}>{item.title}</h4>
              <p className="text-gray-400 text-xs">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-block hologram-bg rounded-2xl p-8 max-w-lg">
            <h3 className="font-orbitron text-xl text-[#FFD700] mb-4 animate-gold-glow">
              ГОТОВ УЗНАТЬ СВОЙ КОД?
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Подпишись на канал и узнай свой астрально-финансовый код. 
              Древняя мудрость + современные деньги = твоя стратегия успеха.
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-[#00FFD5]/20 to-[#FFD700]/20 border border-[#00FFD5]/50 rounded-lg font-orbitron text-[#00FFD5] hover:bg-[#00FFD5]/10 transition-all duration-300 animate-pulse-glow">
              ПОДПИСАТЬСЯ ∞
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
