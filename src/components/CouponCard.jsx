import React from 'react';
import { Check, Sparkles } from 'lucide-react';

/**
 * Ticket / Coupon perforé inspiré de l'image 2 (écran de droite "Unlocked Surprises")
 */
export function CouponCard({ coupon, dayNumber, isRedeemed = false, onToggleRedeem }) {
  if (!coupon || !coupon.enabled) return null;

  const colorStyles = {
    green: {
      bg: 'bg-[#73B288]',
      textMain: 'text-[#132A1F]',
      textAccent: 'text-[#9E2A2B]',
      border: 'border-[#132A1F]/20',
      badgeBg: 'bg-[#9E2A2B] text-[#F9F4EA]',
    },
    cream: {
      bg: 'bg-[#DFD6BA]',
      textMain: 'text-[#1A3326]',
      textAccent: 'text-[#9E2A2B]',
      border: 'border-[#1A3326]/20',
      badgeBg: 'bg-[#17281F] text-[#F9F4EA]',
    },
    red: {
      bg: 'bg-[#9E2A2B]',
      textMain: 'text-[#F9F4EA]',
      textAccent: 'text-[#F2D078]',
      border: 'border-[#F9F4EA]/25',
      badgeBg: 'bg-[#F9F4EA] text-[#9E2A2B]',
    },
  };

  const palette = colorStyles[coupon.color] || colorStyles.green;

  return (
    <div className="relative group select-none">
      {/* Perforated Ticket Body */}
      <div
        className={`ticket-card relative flex items-stretch rounded-xl overflow-hidden shadow-md transition-all duration-300 ${palette.bg} ${
          isRedeemed ? 'opacity-75 saturate-75' : 'hover:shadow-lg hover:-translate-y-0.5'
        }`}
      >
        {/* Left Main Section */}
        <div className="flex-1 px-6 py-4 text-center flex flex-col justify-center">
          <div className="flex items-center justify-center gap-1.5 mb-0.5">
            <span className={`text-[11px] font-bold uppercase tracking-widest opacity-75 ${palette.textMain}`}>
              {coupon.category || `Surprise Jour ${dayNumber}`}
            </span>
          </div>

          <h4 className={`font-serif-chic text-xl sm:text-2xl font-bold leading-tight ${palette.textMain}`}>
            {coupon.offerTitle || 'Bon Cadeau Surprise'}
          </h4>

          {coupon.offerSubtitle && (
            <p className={`font-script text-xl sm:text-2xl leading-snug mt-0.5 ${palette.textAccent}`}>
              {coupon.offerSubtitle}
            </p>
          )}

          {onToggleRedeem && (
            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={() => onToggleRedeem(dayNumber)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isRedeemed
                    ? 'bg-[#132A1F] text-[#F9F4EA]'
                    : 'bg-white/40 hover:bg-white/70 text-[#132A1F]'
                }`}
              >
                {isRedeemed ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Utilisé (cliquer pour réactiver)
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    Utiliser ce bon cadeau
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Dashed Vertical Perforation Line */}
        <div className={`w-0 border-l-2 border-dashed ${palette.border} my-2`} />

        {/* Right Stub Section (Vertical Stamp like Netflix/Multiplex in Image 2) */}
        <div className="w-20 sm:w-24 flex flex-col items-center justify-center p-3 relative">
          <span className={`text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1 ${palette.textMain}`}>
            N° {String(dayNumber).padStart(2, '0')}
          </span>
          <div
            className={`px-2.5 py-1.5 rounded font-serif-chic font-extrabold text-[11px] tracking-widest uppercase shadow-xs ${palette.badgeBg}`}
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            {coupon.stampText || 'CADEAU'}
          </div>
        </div>
      </div>
    </div>
  );
}
