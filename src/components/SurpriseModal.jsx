import React, { useEffect, useRef } from 'react';
import { X, Sparkles, ExternalLink, Heart, Edit3, Music } from 'lucide-react';
import { CouponCard } from './CouponCard';
import { HolidayIllustration } from './HolidayIllustrations';

export function SurpriseModal({
  dayData,
  recipientName,
  isRedeemed,
  onToggleRedeem,
  onClose,
  isTestMode,
  onEditThisDay,
}) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (dayData) {
      closeBtnRef.current?.focus();
    }
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dayData, onClose]);

  if (!dayData) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="surprise-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-paper-texture text-[#132A1F] rounded-[28px] shadow-2xl border-2 border-[#D4AF37]/50 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Inner decorative gold border */}
        <div className="pointer-events-none absolute inset-2.5 rounded-[20px] border border-[#C5A059]/30" />

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E2A2B] text-[#F9F4EA] text-xs font-bold tracking-widest uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#F2D078]" />
            <span>{dayData.day} Décembre</span>
          </div>

          <div className="flex items-center gap-2">
            {isTestMode && (
              <button
                type="button"
                onClick={() => onEditThisDay(dayData.day)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#132A1F] text-[#F9F4EA] hover:bg-[#9E2A2B] text-xs font-semibold transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Personnaliser cette case</span>
              </button>
            )}
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              aria-label="Fermer la surprise"
              className="w-9 h-9 rounded-full bg-[#132A1F]/10 hover:bg-[#9E2A2B] text-[#132A1F] hover:text-[#F9F4EA] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Illustration Header */}
        {dayData.illustration && dayData.illustration !== 'none' && (
          <div className="flex justify-center my-3">
            <div className="w-20 h-20 rounded-2xl bg-[#132A1F]/8 border border-[#C5A059]/30 flex items-center justify-center p-2 shadow-inner">
              <HolidayIllustration type={dayData.illustration} className="w-14 h-14 text-[#9E2A2B]" />
            </div>
          </div>
        )}

        {/* Surprise Title & Personal Note */}
        <div className="text-center mb-6 relative z-10">
          <p className="font-script text-3xl text-[#9E2A2B] mb-1">
            Pour {recipientName || 'Mon Cœur'}
          </p>
          <h2
            id="surprise-modal-title"
            className="font-serif-chic text-2xl sm:text-3xl font-bold text-[#132A1F] leading-snug mb-4"
          >
            {dayData.title || `Surprise du ${dayData.day} décembre`}
          </h2>

          {dayData.message && (
            <div className="bg-white/65 border border-[#C5A059]/30 rounded-2xl p-5 shadow-xs text-[#24382D] text-base leading-relaxed whitespace-pre-line font-medium">
              {dayData.message}
            </div>
          )}
        </div>

        {/* Optional Polaroid Photo */}
        {dayData.photoUrl && (
          <div className="mb-6 relative z-10 flex justify-center">
            <div className="bg-white p-3 pb-5 rounded-xl shadow-lg border border-black/10 max-w-xs w-full -rotate-1 hover:rotate-0 transition-transform">
              <img
                src={dayData.photoUrl}
                alt={dayData.photoCaption || `Souvenir du ${dayData.day} décembre`}
                className="w-full h-56 object-cover rounded-lg"
              />
              {dayData.photoCaption && (
                <p className="font-script text-2xl text-center text-[#132A1F] mt-3">
                  {dayData.photoCaption}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Optional Perforated Coupon Ticket (like Image 2 right screen) */}
        {dayData.coupon?.enabled && (
          <div className="mb-6 relative z-10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-center text-[#4F6358] mb-2">
              🎟️ Ton Bon Cadeau Exclusif
            </p>
            <CouponCard
              coupon={dayData.coupon}
              dayNumber={dayData.day}
              isRedeemed={isRedeemed}
              onToggleRedeem={onToggleRedeem}
            />
          </div>
        )}

        {/* Optional Music / Video / External Link */}
        {dayData.mediaUrl && (
          <div className="mb-6 relative z-10 flex justify-center">
            <a
              href={dayData.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#132A1F] hover:bg-[#1F5E3B] text-[#F9F4EA] font-semibold text-sm shadow-md transition-all"
            >
              <Music className="w-4 h-4 text-[#D4AF37]" />
              <span>{dayData.mediaLabel || 'Découvrir la surprise musicale / vidéo'}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-75" />
            </a>
          </div>
        )}

        {/* Footer Close CTA */}
        <div className="mt-4 pt-4 border-t border-[#132A1F]/10 flex justify-center relative z-10">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#9E2A2B] hover:bg-[#821D1E] text-[#F9F4EA] text-sm font-semibold shadow-md transition-all cursor-pointer"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>Garder précieusement</span>
          </button>
        </div>
      </div>
    </div>
  );
}
