import React from 'react';
import { Lock, Check, Gift, Edit3, Ticket } from 'lucide-react';
import { HolidayIllustration } from './HolidayIllustrations';
import { TileStickers } from './TileStickers';

export const TILE_THEMES = [
  {
    id: 'charcoal-snowflake',
    label: 'Noir Fusain Velours',
    className: 'bg-[#252926] text-[#F9F4EA]',
    numColor: 'text-[#F9F4EA]',
  },
  {
    id: 'charcoal-dots',
    label: 'Noir Fusain Pois Dorés',
    className: 'pattern-dots-charcoal text-[#F9F4EA]',
    numColor: 'text-[#F9F4EA]',
  },
  {
    id: 'red-dots',
    label: 'Rouge Bordeaux Pois',
    className: 'pattern-dots-red text-[#F9F4EA]',
    numColor: 'text-[#F9F4EA]',
  },
  {
    id: 'red-stripes',
    label: 'Rouge Bordeaux Rayé',
    className: 'pattern-stripes-red text-[#F9F4EA]',
    numColor: 'text-[#F9F4EA]',
  },
  {
    id: 'cream-solid',
    label: 'Crème Poudré Doux',
    className: 'bg-[#F5EFE0] text-[#222824]',
    numColor: 'text-[#222824]',
  },
  {
    id: 'cream-stripes',
    label: 'Crème & Or Rayé',
    className: 'pattern-stripes-cream text-[#222824]',
    numColor: 'text-[#222824]',
  },
  {
    id: 'cream-stars',
    label: 'Crème Étoilé Chic',
    className: 'pattern-stars-cream text-[#222824]',
    numColor: 'text-[#222824]',
  },
  {
    id: 'sage-solid',
    label: 'Vert Sauge Apaisant',
    className: 'bg-[#B2C6B5] text-[#222824]',
    numColor: 'text-[#222824]',
  },
  {
    id: 'sage-chevron',
    label: 'Vert Sauge Chevrons',
    className: 'pattern-chevron-sage text-[#222824]',
    numColor: 'text-[#222824]',
  },
  {
    id: 'green-stripes',
    label: 'Vert Sapin Rayé',
    className: 'pattern-stripes-green text-[#F9F4EA]',
    numColor: 'text-[#F9F4EA]',
  },
];

const NUMBER_FONT = {
  normal: 'min(40cqw, 4rem)',
  wide: 'min(24cqw, 4.5rem)',
  tall: 'min(48cqw, 4.5rem)',
};
const BADGE_FONT = {
  normal: 'min(25cqw, 2.4rem)',
  wide: 'min(15cqw, 2.6rem)',
  tall: 'min(28cqw, 2.6rem)',
};
const ILLUSTRATION_BOX = {
  normal: 'w-[66%] h-[54%]',
  wide: 'w-[44%] h-[66%]',
  tall: 'w-[92%] h-[56%]',
};

function handleTilt(e) {
  if (e.pointerType !== 'mouse') return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.setProperty('--rx', `${(0.5 - y) * 8}deg`);
  el.style.setProperty('--ry', `${(x - 0.5) * 8}deg`);
  el.style.setProperty('--mx', `${x * 100}%`);
  el.style.setProperty('--my', `${y * 100}%`);
  el.style.setProperty('--px', `${(x - 0.5) * 6}px`);
  el.style.setProperty('--py', `${(y - 0.5) * 6}px`);
  el.style.setProperty('--lift', '-3px');
}
function resetTilt(e) {
  const el = e.currentTarget;
  ['--rx', '--ry', '--px', '--py', '--lift'].forEach((p) => el.style.removeProperty(p));
}

/** Pure visual face of a tile — reused by the sticker editor preview. */
export function TileFace({ dayData, stickers, children }) {
  const { day, theme, illustration, badgeText, hideDefaultArt } = dayData;
  const size = dayData.size || 'normal';
  const themeObj = TILE_THEMES.find((t) => t.id === theme) || TILE_THEMES[0];
  const hasIllustration = illustration && illustration !== 'none' && illustration !== 'snowflake';
  const showCornerNumber = hasIllustration || badgeText || hideDefaultArt;
  const list = stickers ?? dayData.stickers ?? [];
  const backStickers = list.filter((s) => s.layer === 'back');
  const frontStickers = list.filter((s) => s.layer !== 'back');

  return (
    <div
      className={`absolute inset-0 overflow-hidden rounded-2xl ${themeObj.className}`}
      style={{ containerType: 'inline-size' }}
    >
      {/* Stickers placed BEHIND default illustration / big number */}
      <div className="pointer-events-none absolute inset-0 z-[1]" style={{ transform: 'translate(var(--px, 0px), var(--py, 0px))' }}>
        <TileStickers stickers={backStickers} zIndex="z-[1]" />
      </div>

      {!hideDefaultArt && (
        <div
          className={`pointer-events-none absolute inset-0 z-[3] flex items-center justify-center px-3 pb-3 ${
            showCornerNumber ? 'pt-9' : 'pt-3'
          }`}
        >
          {illustration === 'snowflake' && (
            <HolidayIllustration
              type="snowflake"
              className="absolute w-[78%] h-[78%] opacity-35 transition-transform duration-[2000ms] group-hover:rotate-[60deg]"
            />
          )}
          {badgeText ? (
            <p
              className="font-script leading-[0.95] tracking-wide text-center drop-shadow-xs break-words"
              style={{ fontSize: BADGE_FONT[size] }}
            >
              {badgeText}
            </p>
          ) : hasIllustration ? (
            <div className={`wiggle-on-hover flex items-center justify-center ${ILLUSTRATION_BOX[size]}`}>
              <HolidayIllustration type={illustration} className="w-full h-full" />
            </div>
          ) : (
            <span
              className={`relative font-serif-chic font-extrabold tracking-tight leading-none transition-transform duration-300 group-hover:scale-110 ${themeObj.numColor}`}
              style={{
                fontSize: NUMBER_FONT[size],
                textShadow: illustration === 'snowflake' ? '0 2px 10px rgba(0,0,0,0.45)' : undefined,
              }}
            >
              {day}
            </span>
          )}
        </div>
      )}

      {/* Stickers placed IN FRONT OF default illustration / big number */}
      <div className="pointer-events-none absolute inset-0 z-[6]" style={{ transform: 'translate(var(--px, 0px), var(--py, 0px))' }}>
        <TileStickers stickers={frontStickers} zIndex="z-[6]" />
      </div>

      {showCornerNumber && (
        <span
          className={`absolute top-3 left-3.5 z-10 font-serif-chic font-extrabold text-xl sm:text-2xl leading-none tracking-tight ${themeObj.numColor}`}
          style={{ textShadow: list?.length ? '0 1px 6px rgba(0,0,0,0.25)' : undefined }}
        >
          {day}
        </span>
      )}

      {children}
    </div>
  );
}

export function BentoTile({
  dayData,
  isUnlocked,
  isAvailableToday,
  isLockedFuture,
  isShaking,
  isOpening,
  onSelectDay,
  onQuickEditDay,
  isAdminPreview,
}) {
  const { day, coupon } = dayData;
  const size = dayData.size || 'normal';

  const spanClasses =
    size === 'wide' ? 'col-span-2 row-span-1' : size === 'tall' ? 'col-span-1 row-span-2' : 'col-span-1 row-span-1';

  const isToday = isAvailableToday && !isUnlocked;

  return (
    <div className={`relative ${spanClasses}`}>
      <div
        className={`tile-3d relative group w-full h-full select-none rounded-2xl ${isShaking ? 'animate-shake' : ''}`}
        onPointerMove={handleTilt}
        onPointerLeave={resetTilt}
      >
        {/* Inside of the "door", revealed while the cover swings open */}
        <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_45%,#F2D078_0%,#C5A059_55%,#8F6E2E_100%)] flex items-center justify-center shadow-inner">
          <span className="text-3xl text-[#FFF8E6]">✨</span>
        </div>

        <button
          type="button"
          onClick={() => onSelectDay(dayData)}
          className={`absolute inset-0 rounded-2xl text-left cursor-pointer shadow-md transition-shadow duration-300 group-hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] ${
            isOpening ? 'door-open' : ''
          } ${isToday ? 'today-glow' : ''} ${isShaking ? 'ring-2 ring-[#D94E4E]' : ''}`}
          aria-label={`Case numéro ${day}${isUnlocked ? ' (déjà ouverte)' : isToday ? ' (à ouvrir aujourd’hui)' : ''}`}
        >
          <TileFace dayData={dayData}>
            {/* Status (top-right) */}
            <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1">
              {coupon?.enabled && isUnlocked && (
                <span
                  className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#132A1F] flex items-center justify-center shadow-sm"
                  title="Contient un Bon Cadeau"
                >
                  <Ticket className="w-3.5 h-3.5" />
                </span>
              )}
              {isToday ? (
                <span className="pl-1 pr-2 py-0.5 rounded-full bg-[#D4AF37] text-[#132A1F] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <Gift className="w-3 h-3" />
                  <span>Ouvrir</span>
                </span>
              ) : isLockedFuture && !isUnlocked ? (
                <span className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-80 transition-opacity">
                  <Lock className="w-3 h-3" />
                </span>
              ) : null}
            </div>

            {/* Opened: golden folded corner */}
            {isUnlocked && (
              <span className="absolute bottom-0 right-0 z-10 w-9 h-9 pointer-events-none" title="Surprise découverte">
                <span className="absolute inset-0 bg-[linear-gradient(135deg,transparent_50%,#D4AF37_50%)] rounded-br-2xl" />
                <Check className="absolute bottom-1 right-1 w-3.5 h-3.5 text-[#132A1F]" strokeWidth={3} />
              </span>
            )}

            {/* Soft light that follows the mouse */}
            <span className="tile-shine pointer-events-none absolute inset-0 z-20" />
          </TileFace>
        </button>

        {isAdminPreview && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickEditDay(dayData.day);
            }}
            className="absolute bottom-2 left-2 z-30 px-2.5 py-1 rounded-lg bg-[#132A1F]/90 hover:bg-[#9E2A2B] text-[#F9F4EA] border border-[#D4AF37]/50 text-[11px] font-semibold flex items-center gap-1 shadow-md transition-colors cursor-pointer"
            title={`Modifier le contenu du jour ${day}`}
          >
            <Edit3 className="w-3 h-3 text-[#D4AF37]" />
            <span>Modifier</span>
          </button>
        )}
      </div>
    </div>
  );
}
