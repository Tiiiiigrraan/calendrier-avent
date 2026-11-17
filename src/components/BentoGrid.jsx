import React from 'react';
import { BentoTile } from './BentoTile';
import { Sparkles } from 'lucide-react';

export function BentoGrid({
  days,
  totalDays = 25,
  unlockedDays,
  currentDecDay,
  isTestMode,
  shakingDay,
  openingDay,
  lockedToast,
  onSelectDay,
  onQuickEditDay,
}) {
  const visibleDays = days.slice(0, totalDays);

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16 relative z-20">
      {lockedToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-max max-w-[90vw] px-5 py-3 rounded-2xl bg-[#9E2A2B] text-[#F9F4EA] border border-[#D4AF37] shadow-2xl flex items-center gap-2.5 text-sm font-medium animate-bounce"
        >
          <Sparkles className="w-4 h-4 text-[#F2D078] shrink-0" />
          <span>{lockedToast}</span>
        </div>
      )}

      {/* Bento grid: rows are derived from the column width so every tile keeps
          the same proportions on every screen (needed for exact sticker placement). */}
      <div className="bento-wrap">
        <div className="bento-grid grid grid-flow-dense">
          {visibleDays.map((dayData) => {
            const isUnlocked = unlockedDays.includes(dayData.day);
            const isLockedFuture = !isTestMode && dayData.day > currentDecDay;

            return (
              <BentoTile
                key={dayData.day}
                dayData={dayData}
                isUnlocked={isUnlocked}
                isAvailableToday={dayData.day === currentDecDay}
                isLockedFuture={isLockedFuture}
                isShaking={shakingDay === dayData.day}
                isOpening={openingDay === dayData.day}
                onSelectDay={onSelectDay}
                onQuickEditDay={onQuickEditDay}
                isAdminPreview={isTestMode}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
