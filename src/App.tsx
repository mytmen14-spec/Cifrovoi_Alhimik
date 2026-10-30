import { useState, useEffect, useRef } from 'react';
import HeroSection from './components/HeroSection';
import AlchemistSection from './components/AlchemistSection';
import InterfaceSection from './components/InterfaceSection';
import ZodiacPortfolio from './components/ZodiacPortfolio';
import DestinyCalculator from './components/DestinyCalculator';
import SynchronizationSection from './components/SynchronizationSection';
import AlchemySection from './components/AlchemySection';
import ChannelPlan from './components/ChannelPlan';
import Particles from './components/Particles';
import VideoPlayer from './components/VideoPlayer';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setNavVisible(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      <Particles />
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        navVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#00FFD5]/10">
          <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="font-orbitron text-sm font-bold">
              <span className="text-[#00FFD5]">CYBER</span>
              <span className="text-[#FFD700] ml-1">ALCHEMY</span>
            </div>
            <div className="hidden md:flex items-center gap-6 font-montserrat text-xs text-gray-400">
              <a href="#video" className="hover:text-[#FFD700] transition-colors text-[#FFD700]">▶ ВИДЕО</a>
              <a href="#alchemist" className="hover:text-[#00FFD5] transition-colors">АЛХИМИК</a>
              <a href="#interface" className="hover:text-[#00FFD5] transition-colors">ИНТЕРФЕЙС</a>
              <a href="#zodiac" className="hover:text-[#00FFD5] transition-colors">ЗОДИАК</a>
              <a href="#destiny" className="hover:text-[#00FFD5] transition-colors">ЧИСЛО СУДЬБЫ</a>
              <a href="#plan" className="hover:text-[#00FFD5] transition-colors">ПЛАН</a>
            </div>
            <div className="font-orbitron text-[10px] text-[#00FFD5]/50">∞</div>
          </div>
        </div>
      </nav>

      <HeroSection />
      
      {/* Video Section */}
      <section id="video" className="relative py-20 px-6">
        <div className="max-w-md mx-auto">
          <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-center mb-2">
            <span className="text-[#00FFD5]">СМОТРЕТЬ</span>{' '}
            <span className="text-[#FFD700]">ИНТРО</span>
          </h2>
          <p className="text-center text-gray-400 font-montserrat text-sm mb-8">
            60 секунд • 8 сцен • Звуковые эффекты • Скачивание в MP4
          </p>
          <VideoPlayer />
          <div className="mt-6 grid grid-cols-4 gap-2">
            {['ПРОБУЖДЕНИЕ', 'ИНТЕРФЕЙС', 'ТРАНСФ.', 'ЗОДИАК', 'ЧИСЛО', 'СИНХРО.', 'ПРИЗЫВ', 'ЛОГО'].map((name, i) => (
              <div key={i} className="text-center">
                <div className="w-full h-1 rounded-full mb-1" style={{
                  background: `linear-gradient(90deg, ${['#00FFD5', '#00FFD5', '#FFD700', '#9D4EDD', '#FFD700', '#00FFD5', '#9D4EDD', '#FFD700'][i]}, transparent)`
                }} />
                <span className="text-[8px] text-gray-500 font-orbitron">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AlchemistSection />
      <InterfaceSection />
      <AlchemySection />
      <ZodiacPortfolio />
      <DestinyCalculator />
      <SynchronizationSection />
      <ChannelPlan />
      
      {/* Footer */}
      <footer className="relative py-12 border-t border-[#00FFD5]/20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="font-orbitron text-2xl font-bold text-teal animate-glow-text mb-4">
            ∞ CYBER ALCHEMY ∞
          </div>
          <p className="text-gray-400 font-montserrat text-sm">
            Древняя мудрость встречает современные деньги
          </p>
          <div className="mt-6 flex justify-center gap-6">
            {['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map((sign, i) => (
              <span key={i} className="text-lg text-[#00FFD5]/40 hover:text-[#00FFD5] transition-colors cursor-pointer">
                {sign}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
