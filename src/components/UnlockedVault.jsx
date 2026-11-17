import React, { useState } from 'react';
import { CouponCard } from './CouponCard';
import { Gift, Heart, Sparkles, Calendar, ArrowLeft, Ticket } from 'lucide-react';

/**
 * Vue "Unlocked Surprises" inspirée de l'écran de droite de l'image 2 :
 * Carte crème élégante présentant tous les bons cadeaux (tickets perforés) et mots doux débloqués.
 */
export function UnlockedVault({
  days,
  unlockedDays,
  redeemedCoupons,
  onToggleRedeem,
  onOpenDayModal,
  onBackToCalendar,
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'coupons' | 'notes'

  const unlockedDayObjects = days
    .filter((d) => unlockedDays.includes(d.day))
    .sort((a, b) => a.day - b.day);

  const unlockedWithCoupons = unlockedDayObjects.filter((d) => d.coupon?.enabled);

  return (
    <section className="w-full max-w-3xl mx-auto px-4 sm:px-6 pb-28 relative z-20">
      {/* Cream Stationery Card matching Image 2 Right Screen */}
      <div className="bg-paper-texture text-[#132A1F] rounded-[32px] shadow-2xl border border-[#D4AF37]/40 p-6 sm:p-10 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-3 rounded-[24px] border border-[#C5A059]/25" />

        {/* Header matching "Unlocked Surprises" */}
        <div className="text-center mb-8 relative z-10">
          <button
            type="button"
            onClick={onBackToCalendar}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#4F6358] hover:text-[#9E2A2B] mb-4 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour à la grille</span>
          </button>

          <h2 className="font-serif-chic text-3xl sm:text-5xl font-extrabold text-[#C93B3B] leading-tight">
            Surprises
            <br />
            Débloquées
          </h2>
          <p className="text-sm text-[#4F6358] mt-2 max-w-md mx-auto font-medium">
            Tous les bons cadeaux, mots doux et souvenirs que tu as découverts cette saison — prêts à être utilisés ✨
          </p>

          {/* Filter Pills */}
          <div className="mt-5 inline-flex p-1 rounded-full bg-[#132A1F]/8 border border-[#132A1F]/10">
            {[
              { id: 'all', label: `Tout (${unlockedDayObjects.length})` },
              { id: 'coupons', label: `Bons Cadeaux (${unlockedWithCoupons.length})` },
              { id: 'notes', label: 'Mots Doux & Photos' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  filter === tab.id
                    ? 'bg-[#9E2A2B] text-[#F9F4EA] shadow-xs'
                    : 'text-[#132A1F]/70 hover:text-[#132A1F]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {unlockedDayObjects.length === 0 ? (
          <div className="text-center py-12 px-4 relative z-10">
            <div className="w-16 h-16 rounded-full bg-[#9E2A2B]/10 text-[#9E2A2B] flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8" />
            </div>
            <h3 className="font-serif-chic text-2xl font-bold text-[#132A1F] mb-2">
              Aucune surprise ouverte pour l’instant
            </h3>
            <p className="text-sm text-[#4F6358] max-w-sm mx-auto mb-6">
              Clique sur une case disponible du calendrier pour débloquer ta première surprise et la voir apparaître ici !
            </p>
            <button
              type="button"
              onClick={onBackToCalendar}
              className="px-6 py-3 rounded-full bg-[#C93B3B] hover:bg-[#9E2A2B] text-[#F9F4EA] text-sm font-semibold shadow-md transition-all cursor-pointer"
            >
              Aller au calendrier
            </button>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            {/* Section 1: Perforated Tickets (like Image 2 right screen) */}
            {(filter === 'all' || filter === 'coupons') && unlockedWithCoupons.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Ticket className="w-4 h-4 text-[#9E2A2B]" />
                  <h3 className="font-serif-chic text-lg font-bold text-[#132A1F]">
                    Tes Bons Cadeaux à utiliser ({unlockedWithCoupons.length})
                  </h3>
                </div>
                <div className="space-y-4">
                  {unlockedWithCoupons.map((d) => (
                    <CouponCard
                      key={d.day}
                      coupon={d.coupon}
                      dayNumber={d.day}
                      isRedeemed={redeemedCoupons.includes(d.day)}
                      onToggleRedeem={onToggleRedeem}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Section 2: Love Notes & Memories */}
            {(filter === 'all' || filter === 'notes') && (
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-4 h-4 text-[#9E2A2B]" />
                  <h3 className="font-serif-chic text-lg font-bold text-[#132A1F]">
                    Carnet des jours ouverts ({unlockedDayObjects.length})
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {unlockedDayObjects.map((d) => (
                    <button
                      key={d.day}
                      type="button"
                      onClick={() => onOpenDayModal(d)}
                      className="text-left p-4 rounded-2xl bg-white/75 hover:bg-white border border-[#C5A059]/35 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#132A1F] text-[#F9F4EA] text-[11px] font-bold">
                            {d.day} Décembre
                          </span>
                          {d.coupon?.enabled && (
                            <span className="text-[11px] font-semibold text-[#9E2A2B]">
                              + Bon cadeau
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif-chic font-bold text-lg text-[#132A1F] group-hover:text-[#9E2A2B] transition-colors">
                          {d.title}
                        </h4>
                        <p className="text-xs text-[#4F6358] line-clamp-2 mt-1">
                          {d.message}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-[#9E2A2B] mt-3 inline-flex items-center gap-1">
                        Relire la surprise →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
