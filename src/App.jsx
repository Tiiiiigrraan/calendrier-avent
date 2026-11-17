import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Lock } from 'lucide-react';
import { DEFAULT_CALENDAR_DATA } from './data/defaultCalendar';
import {
  loadLocalCalendarData,
  pushCloudCalendarData,
  fetchCloudCalendarData,
  loadUnlockedDays,
  saveUnlockedDays,
  loadRedeemedCoupons,
  saveRedeemedCoupons,
} from './services/storageService';
import { Snowfall } from './components/Snowfall';
import { HeaderCountdown } from './components/HeaderCountdown';
import { BentoGrid } from './components/BentoGrid';
import { UnlockedVault } from './components/UnlockedVault';
import { SurpriseModal } from './components/SurpriseModal';
import { AdminModal } from './components/AdminModal';

function triggerHolidayConfetti() {
  try {
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#9E2A2B', '#F9F4EA', '#2E6F40'],
    });
    if (confetti.shapeFromText) {
      const star = confetti.shapeFromText({ text: '✦', scalar: 2 });
      const flake = confetti.shapeFromText({ text: '❄', scalar: 2 });
      confetti({
        particleCount: 18,
        spread: 90,
        startVelocity: 32,
        origin: { y: 0.6 },
        shapes: [star, flake],
        scalar: 2,
      });
    }
  } catch (e) {
    // Fallback if canvas-confetti fails
  }
}

export default function App() {
  const [calendarData, setCalendarData] = useState(() => loadLocalCalendarData());
  const [unlockedDays, setUnlockedDays] = useState(() => loadUnlockedDays());
  const [redeemedCoupons, setRedeemedCoupons] = useState(() => loadRedeemedCoupons());

  // Tabs inside main view: 'calendar' | 'vault'
  const [activeTab, setActiveTab] = useState('calendar');

  // Active opened day modal
  const [selectedDayModal, setSelectedDayModal] = useState(null);

  // Locked tile feedback
  const [shakingDay, setShakingDay] = useState(null);
  const [openingDay, setOpeningDay] = useState(null);
  const [lockedToast, setLockedToast] = useState(null);

  // Admin modal & authentication state
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminInitialDay, setAdminInitialDay] = useState(1);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Test mode is FALSE by default and only accessible after authenticating in Creator Mode
  const [isTestMode, setIsTestMode] = useState(false);

  const effectiveTestMode = isAdminAuthenticated && isTestMode;

  // Sync with Cloud on mount if configured
  useEffect(() => {
    let mounted = true;
    fetchCloudCalendarData().then((cloudData) => {
      if (mounted && cloudData && cloudData.days) {
        setCalendarData(cloudData);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Determine current December day for real date locking
  const now = new Date();
  const currentDecDay = now.getMonth() === 11 ? now.getDate() : 0;

  const handleSelectDay = useCallback(
    (dayData) => {
      const canOpen =
        effectiveTestMode || dayData.day <= currentDecDay || unlockedDays.includes(dayData.day);

      if (!canOpen) {
        setShakingDay(dayData.day);
        const rawMsg =
          calendarData.settings?.lockedMessage ||
          'Patience mon cœur… Cette case ne s’ouvrira que le {day} décembre ! 🎄';
        setLockedToast(rawMsg.replace('{day}', dayData.day));

        setTimeout(() => setShakingDay(null), 500);
        setTimeout(() => setLockedToast(null), 3200);
        return;
      }

      // Unlock if first time opening: swing the door open, then reveal
      if (!unlockedDays.includes(dayData.day)) {
        if (openingDay !== null) return;
        const updated = [...unlockedDays, dayData.day];
        setOpeningDay(dayData.day);
        setTimeout(() => {
          setUnlockedDays(updated);
          saveUnlockedDays(updated);
          triggerHolidayConfetti();
          setSelectedDayModal(dayData);
          setOpeningDay(null);
        }, 520);
        return;
      }

      setSelectedDayModal(dayData);
    },
    [effectiveTestMode, currentDecDay, unlockedDays, calendarData.settings, openingDay]
  );

  const handleToggleRedeemCoupon = useCallback((dayNumber) => {
    setRedeemedCoupons((prev) => {
      const exists = prev.includes(dayNumber);
      const updated = exists ? prev.filter((d) => d !== dayNumber) : [...prev, dayNumber];
      saveRedeemedCoupons(updated);
      return updated;
    });
  }, []);

  const handleSaveCalendarData = async (newData) => {
    setCalendarData(newData);
    if (selectedDayModal) {
      const refreshed = newData.days.find((d) => d.day === selectedDayModal.day);
      if (refreshed) setSelectedDayModal(refreshed);
    }
    return await pushCloudCalendarData(newData);
  };

  const handleResetDefault = () => {
    setCalendarData(DEFAULT_CALENDAR_DATA);
    pushCloudCalendarData(DEFAULT_CALENDAR_DATA);
  };

  const handleResetUnlockedProgress = () => {
    setUnlockedDays([]);
    saveUnlockedDays([]);
    setRedeemedCoupons([]);
    saveRedeemedCoupons([]);
  };

  const handleQuickEditDay = (dayNumber) => {
    setSelectedDayModal(null);
    setAdminInitialDay(dayNumber);
    setAdminOpen(true);
  };

  return (
    <div className="min-h-screen bg-forest-snowflake text-[#F9F4EA] relative flex flex-col justify-between">
      {/* Snowfall is always active */}
      <Snowfall enabled={true} />

      <div className="flex-1 flex flex-col">
        <HeaderCountdown
          settings={calendarData.settings}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unlockedCount={unlockedDays.length}
          isAdminAuthenticated={isAdminAuthenticated}
          isTestMode={effectiveTestMode}
          setIsTestMode={setIsTestMode}
          onOpenAdmin={() => {
            setAdminInitialDay(1);
            setAdminOpen(true);
          }}
        />

        <main className="flex-1">
          {activeTab === 'calendar' ? (
            <BentoGrid
              days={calendarData.days}
              totalDays={calendarData.settings?.totalDays || 25}
              unlockedDays={unlockedDays}
              currentDecDay={currentDecDay}
              isTestMode={effectiveTestMode}
              shakingDay={shakingDay}
              openingDay={openingDay}
              lockedToast={lockedToast}
              onSelectDay={handleSelectDay}
              onQuickEditDay={handleQuickEditDay}
            />
          ) : (
            <UnlockedVault
              days={calendarData.days}
              unlockedDays={unlockedDays}
              redeemedCoupons={redeemedCoupons}
              onToggleRedeem={handleToggleRedeemCoupon}
              onOpenDayModal={(d) => setSelectedDayModal(d)}
              onBackToCalendar={() => setActiveTab('calendar')}
            />
          )}
        </main>

        {/* Discreet Footer with hidden Creator trigger at the bottom */}
        <footer className="w-full max-w-6xl mx-auto px-6 py-4 border-t border-[#F9F4EA]/10 flex items-center justify-between gap-2 text-[11px] text-[#F9F4EA]/40 relative z-20">
          <span>Fait avec amour ❤️</span>
          <button
            type="button"
            onClick={() => {
              setAdminInitialDay(1);
              setAdminOpen(true);
            }}
            aria-label="Personnaliser"
            className="opacity-30 hover:opacity-80 transition-opacity p-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </footer>
      </div>

      {/* Day Surprise Reveal Modal */}
      <SurpriseModal
        dayData={selectedDayModal}
        recipientName={calendarData.settings?.recipientName}
        isRedeemed={selectedDayModal ? redeemedCoupons.includes(selectedDayModal.day) : false}
        onToggleRedeem={handleToggleRedeemCoupon}
        onClose={() => setSelectedDayModal(null)}
        isTestMode={effectiveTestMode}
        onEditThisDay={handleQuickEditDay}
      />

      {/* Secret Admin / Visual Editor Modal */}
      <AdminModal
        isOpen={adminOpen}
        initialDay={adminInitialDay}
        calendarData={calendarData}
        onSaveCalendarData={handleSaveCalendarData}
        onResetDefault={handleResetDefault}
        isTestMode={isTestMode}
        setIsTestMode={setIsTestMode}
        onResetUnlockedProgress={handleResetUnlockedProgress}
        onClose={() => setAdminOpen(false)}
        isAuthenticated={isAdminAuthenticated}
        setIsAuthenticated={setIsAdminAuthenticated}
      />
    </div>
  );
}
