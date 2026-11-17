import React, { useState, useEffect } from 'react';
import { Eye, Calendar, Gift } from 'lucide-react';

function calculateTimeLeft(targetYear) {
  const now = new Date();
  const year = targetYear || now.getFullYear();
  const christmas = new Date(year, 11, 25, 0, 0, 0);
  const diff = christmas.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isChristmas: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isChristmas: false,
  };
}

export function HeaderCountdown({
  settings,
  activeTab,
  setActiveTab,
  unlockedCount,
  isAdminAuthenticated,
  isTestMode,
  setIsTestMode,
  onOpenAdmin,
}) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(settings.targetYear));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(settings.targetYear));
    }, 1000);
    return () => clearInterval(timer);
  }, [settings.targetYear]);

  return (
    <>
      {/* Sticky navigation (single source of navigation for the whole app) */}
      <div className="sticky top-0 z-40 w-full bg-[#142E22]/80 backdrop-blur-md border-b border-[#F9F4EA]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <nav
            className="flex items-center p-1 rounded-full bg-[#0E2219]/70 border border-[#F9F4EA]/12 shadow-inner"
            aria-label="Navigation principale"
          >
            {[
              { id: 'calendar', label: 'Le Calendrier', icon: Calendar },
              { id: 'vault', label: 'Mes Surprises', icon: Gift, count: unlockedCount },
            ].map(({ id, label, icon: Icon, count }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    active
                      ? 'bg-[#F9F4EA] text-[#9E2A2B] shadow-md'
                      : 'text-[#F9F4EA]/70 hover:text-[#F9F4EA]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                  {count !== undefined && (
                    <span
                      className={`min-w-5 h-5 px-1 rounded-full text-[10px] flex items-center justify-center ${
                        active ? 'bg-[#D4AF37] text-[#132A1F]' : 'bg-[#9E2A2B] text-[#F9F4EA]'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Only visible after entering Creator Mode */}
          {isAdminAuthenticated && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTestMode(!isTestMode)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all border ${
                  isTestMode
                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#F2D078]'
                    : 'bg-[#F9F4EA]/10 border-[#F9F4EA]/20 text-[#F9F4EA]/80 hover:text-[#F9F4EA]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isTestMode ? 'Mode Test Actif' : 'Mode Test'}</span>
              </button>
              <button
                type="button"
                onClick={onOpenAdmin}
                className="px-3 py-1.5 rounded-full bg-[#9E2A2B] text-[#F9F4EA] text-xs font-semibold cursor-pointer hover:bg-[#B83334] transition-colors"
              >
                Atelier Créateur
              </button>
            </div>
          )}
        </div>
      </div>

      <header className="w-full max-w-6xl mx-auto pb-6 px-4 sm:px-6 relative z-20">
        <Garland />

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mt-2">
          <div className="relative">
            <span className="twinkle absolute -left-3 -top-1 text-[#F2D078] text-xs" style={{ animationDuration: '3s' }}>✦</span>
            <span className="twinkle absolute left-[62%] -top-3 text-[#F2D078] text-[10px]" style={{ animationDuration: '3.6s', animationDelay: '1.2s' }}>✦</span>
            <span className="twinkle absolute -right-4 top-6 text-[#F2D078] text-sm" style={{ animationDuration: '4.2s', animationDelay: '2s' }}>✦</span>
            <p className="font-script text-2xl sm:text-3xl text-[#D4AF37] mb-0.5">
              {settings.headerSubtitle ?? 'En attendant Noël avec toi…'}
            </p>
            <h1 className="font-serif-chic text-3xl sm:text-5xl font-bold tracking-tight text-[#F9F4EA]">
              {settings.calendarTitle || "Calendrier de l'avent"}
            </h1>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-1.5 sm:gap-3 self-start lg:self-end">
            {[
              { value: timeLeft.days, label: 'Jours' },
              { value: timeLeft.hours, label: 'Heures' },
              { value: timeLeft.minutes, label: 'Minutes' },
              { value: timeLeft.seconds, label: 'Secondes' },
            ].map((item, idx) => {
              const text = String(item.value).padStart(2, '0');
              return (
                <React.Fragment key={item.label}>
                  <div className="w-14 sm:w-16 py-2 px-1 rounded-xl bg-[#F9F4EA]/8 border border-[#D4AF37]/30 flex flex-col items-center justify-center shadow-inner overflow-hidden">
                    <span className="font-serif-chic text-xl sm:text-2xl font-bold text-[#F9F4EA] tabular-nums leading-none">
                      <span key={text} className="digit-flip">{text}</span>
                    </span>
                    <span className="text-[10px] text-[#F9F4EA]/65 mt-1 font-medium">{item.label}</span>
                  </div>
                  {idx < 3 && <span className="text-[#D4AF37] font-bold text-lg select-none">:</span>}
                </React.Fragment>
              );
            })}
            <span className="hidden sm:inline-block text-sm font-medium text-[#F9F4EA]/85 ml-1">avant Noël</span>
          </div>
        </div>
      </header>
    </>
  );
}

const BULB_COLORS = ['#E5484D', '#F2D078', '#4FA36B', '#F9F4EA'];
const SWAGS = 5;

/** Thin fairy-light string with softly twinkling bulbs. */
function Garland() {
  const bulbs = [];
  for (let i = 0; i < SWAGS; i++) {
    [0.22, 0.5, 0.78].forEach((s, j) => {
      bulbs.push({
        x: ((i + s) / SWAGS) * 100,
        y: ((4 + 48 * s * (1 - s)) / 40) * 100,
        color: BULB_COLORS[(i * 3 + j) % BULB_COLORS.length],
        delay: ((i * 3 + j) * 0.37) % 2.4,
      });
    });
  }
  const d = Array.from({ length: SWAGS })
    .map((_, i) => {
      const x0 = (i * 1000) / SWAGS;
      const x1 = ((i + 1) * 1000) / SWAGS;
      return `${i === 0 ? `M${x0} 4 ` : ''}Q${(x0 + x1) / 2} 28 ${x1} 4`;
    })
    .join(' ');

  return (
    <div className="relative h-10 -mx-2 pointer-events-none" aria-hidden="true">
      <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        <path d={d} stroke="#D4AF37" strokeOpacity="0.35" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      {bulbs.map((b, i) => (
        <span
          key={i}
          className="absolute -translate-x-1/2"
          style={{ left: `${b.x}%`, top: `${b.y}%`, color: b.color }}
        >
          <span className="block w-1.5 h-1 mx-auto rounded-sm bg-[#8F7A45]" />
          <span
            className="bulb block w-2 h-3 rounded-full"
            style={{ backgroundColor: b.color, animationDelay: `${b.delay}s` }}
          />
        </span>
      ))}
    </div>
  );
}
