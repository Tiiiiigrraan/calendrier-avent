import React, { useState } from 'react';
import {
  X,
  Save,
  Lock,
  Sparkles,
  Image as ImageIcon,
  Ticket,
  Music,
  Palette,
  Cloud,
  Download,
  Upload,
  RotateCcw,
  Eye,
  CheckCircle2,
  Wand2,
  Trash2,
} from 'lucide-react';
import { ILLUSTRATION_OPTIONS } from './HolidayIllustrations';
import { TILE_THEMES } from './BentoTile';
import { CouponCard } from './CouponCard';
import { StickerEditor } from './StickerEditor';
import { getCloudConfig, saveCloudConfig, LOCAL_STORAGE_BUDGET } from '../services/storageService';

const SURPRISE_IDEA_BANK = [
  {
    title: "Bon pour un Massage Royal 💆‍♀️",
    message: "Ce soir, allonge-toi et ferme les yeux : tu as droit à 30 minutes de massage aux huiles chaudes sans aucune limite !",
    coupon: {
      enabled: true,
      category: "Bien-être absolu",
      offerTitle: "Massage de 30 min",
      offerSubtitle: "Dos, nuque ou pieds au choix",
      stampText: "RELAX",
      color: "cream",
    },
  },
  {
    title: "Soirée raclette / fondue aux chandelles 🧀",
    message: "Parce qu'il n'y a rien de plus réconfortant en décembre qu'un dîner d'hiver en amoureux bien au chaud.",
    coupon: {
      enabled: true,
      category: "Dîner d'Hiver",
      offerTitle: "Soirée Fromage & Vin",
      offerSubtitle: "Je m'occupe de toutes les courses",
      stampText: "MIAM",
      color: "red",
    },
  },
  {
    title: "Une chasse au trésor dans la maison 🔎",
    message: "Regarde derrière ton livre de chevet… un petit chocolat ou un indice t'y attend dès maintenant !",
    coupon: {
      enabled: false,
      category: "",
      offerTitle: "",
      offerSubtitle: "",
      stampText: "",
      color: "green",
    },
  },
  {
    title: "Brunch du dimanche au lit 🥞",
    message: "Ce week-end, interdiction de mettre un réveil : je t'apporte pancakes, fruits frais et café chaud au lit.",
    coupon: {
      enabled: true,
      category: "Matin Doux",
      offerTitle: "Brunch Royal au Lit",
      offerSubtitle: "Servi avec amour",
      stampText: "BRUNCH",
      color: "green",
    },
  },
  {
    title: "Rendez-vous surprise mystère ✨",
    message: "Prépare une tenue que tu aimes bien pour vendredi soir… je t'emmène dans un endroit secret !",
    coupon: {
      enabled: true,
      category: "Date Night",
      offerTitle: "Soirée Mystère à Deux",
      offerSubtitle: "Laisse-toi guider",
      stampText: "SECRET",
      color: "red",
    },
  },
];

// Helper to compress uploaded image to base64 so it fits smoothly in localStorage / Cloud JSON
function compressImageFile(file, maxWidth = 800, quality = 0.78) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(1, maxWidth / img.width);
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function AdminModal({
  isOpen,
  initialDay = 1,
  calendarData,
  onSaveCalendarData,
  onResetDefault,
  isTestMode,
  setIsTestMode,
  onResetUnlockedProgress,
  onClose,
  isAuthenticated,
  setIsAuthenticated,
}) {
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeSection, setActiveSection] = useState('days'); // 'days' | 'settings' | 'cloud'
  const [selectedDayNum, setSelectedDayNum] = useState(initialDay || 1);
  const [draftData, setDraftData] = useState(() => JSON.parse(JSON.stringify(calendarData)));
  const [cloudConfig, setCloudConfig] = useState(() => getCloudConfig());
  const [saveStatus, setSaveStatus] = useState(null);

  // Sync when modal opens with a specific day
  React.useEffect(() => {
    if (isOpen) {
      setDraftData(JSON.parse(JSON.stringify(calendarData)));
      if (initialDay) {
        setSelectedDayNum(initialDay);
        setActiveSection('days');
      }
    }
  }, [isOpen, initialDay, calendarData]);

  if (!isOpen) return null;

  const expectedPin = '2901';

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput.trim() === expectedPin) {
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const currentDayObj =
    draftData.days.find((d) => d.day === selectedDayNum) || draftData.days[0];

  // Rough size of what will be written to localStorage (UTF-16 → 2 bytes/char)
  const storageBytes = JSON.stringify(draftData).length * 2;

  const updateCurrentDay = (updater) => {
    setDraftData((prev) => ({
      ...prev,
      days: prev.days.map((d) =>
        d.day === selectedDayNum ? (typeof updater === 'function' ? updater(d) : { ...d, ...updater }) : d
      ),
    }));
  };

  const updateSettings = (changes) => {
    setDraftData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...changes },
    }));
  };

  const handleApplyRandomIdea = () => {
    const idea = SURPRISE_IDEA_BANK[Math.floor(Math.random() * SURPRISE_IDEA_BANK.length)];
    updateCurrentDay({
      title: idea.title,
      message: idea.message,
      coupon: { ...idea.coupon },
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      updateCurrentDay({ photoUrl: dataUrl });
    } catch (err) {
      console.error('Image upload error:', err);
    }
  };

  const handleSaveAll = async () => {
    setSaveStatus('saving');
    saveCloudConfig(cloudConfig);
    const result = await onSaveCalendarData(draftData);
    if (result?.quotaExceeded) {
      setSaveStatus('quota');
      alert(
        "L'espace de stockage du navigateur est plein : retire ou réduis quelques images (ou exporte en JSON / active la synchro Cloud). Les changements sont visibles mais ne survivront pas à un rechargement."
      );
    } else if (result?.synced) {
      setSaveStatus('synced');
    } else {
      setSaveStatus('saved-local');
    }
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(draftData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendrier-avent-${draftData.settings.recipientName || 'perso'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (parsed && Array.isArray(parsed.days)) {
          setDraftData(parsed);
          setSaveStatus('imported');
          setTimeout(() => setSaveStatus(null), 2500);
        }
      } catch (err) {
        alert('Fichier JSON invalide.');
      }
    };
    reader.readAsText(file);
  };

  // PIN Lock Screen
  if (!isAuthenticated) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
      >
        <div className="w-full max-w-md bg-paper-texture text-[#132A1F] rounded-3xl p-7 shadow-2xl border-2 border-[#D4AF37]/50 relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#132A1F]/10 hover:bg-[#9E2A2B] text-[#132A1F] hover:text-[#F9F4EA] flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-[#9E2A2B] text-[#F9F4EA] flex items-center justify-center mx-auto mb-4 shadow-md">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="font-serif-chic text-2xl font-bold text-center mb-1">
            Accès Privé
          </h2>
          <p className="text-xs text-center text-[#4F6358] mb-6">
            Saisis ton code personnel pour accéder à l’édition.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-pin-input" className="sr-only">
                Code secret
              </label>
              <input
                id="admin-pin-input"
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="••••"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#132A1F]/20 text-center text-xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-[#9E2A2B]"
              />
              {pinError && (
                <p className="text-xs text-[#9E2A2B] text-center mt-1.5 font-semibold">
                  Code incorrect.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#9E2A2B] hover:bg-[#821D1E] text-[#F9F4EA] font-semibold text-sm shadow-md transition-all cursor-pointer"
            >
              Déverrouiller l’éditeur
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Éditeur du calendrier de l'Avent"
    >
      <div className="w-full max-w-5xl h-[92vh] bg-[#FAF6EE] text-[#132A1F] rounded-3xl shadow-2xl border-2 border-[#D4AF37]/60 flex flex-col overflow-hidden">
        {/* Top Admin Header */}
        <div className="px-5 py-4 bg-[#132A1F] text-[#F9F4EA] flex flex-wrap items-center justify-between gap-3 border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#9E2A2B] flex items-center justify-center text-[#F2D078] font-serif-chic font-bold text-lg">
              ✦
            </div>
            <div>
              <h2 className="font-serif-chic text-lg sm:text-xl font-bold leading-tight">
                Atelier de Personnalisation du Calendrier
              </h2>
              <p className="text-xs text-[#F9F4EA]/70">
                Modifie chaque case à volonté • Sauvegarde instantanée
              </p>
            </div>
          </div>

          {/* Mode Test Switch + Save + Close */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsTestMode(!isTestMode)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                isTestMode
                  ? 'bg-[#D4AF37] text-[#132A1F] border-[#D4AF37]'
                  : 'bg-[#F9F4EA]/10 text-[#F9F4EA] border-[#F9F4EA]/20 hover:bg-[#F9F4EA]/20'
              }`}
              title="Permet d'ouvrir toutes les cases sans attendre le mois de décembre"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isTestMode ? 'Mode Test : ACTIF' : 'Activer Mode Test'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              className="px-4 py-2 rounded-xl bg-[#9E2A2B] hover:bg-[#B83334] text-[#F9F4EA] text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>
                {saveStatus === 'saving'
                  ? 'Enregistrement...'
                  : saveStatus === 'synced'
                  ? 'Synchronisé Cloud ✓'
                  : saveStatus === 'saved-local'
                  ? 'Enregistré ✓'
                  : saveStatus === 'quota'
                  ? 'Stockage plein ⚠'
                  : 'Enregistrer tout'}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer l'éditeur"
              className="w-9 h-9 rounded-xl bg-[#F9F4EA]/10 hover:bg-[#9E2A2B] text-[#F9F4EA] flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 py-2.5 bg-[#EFE7D6] border-b border-[#132A1F]/10 flex flex-wrap items-center gap-2">
          {[
            { id: 'days', label: '🎁 Contenu des 25 Cases' },
            { id: 'settings', label: '⚙️ Textes & Réglages Généraux' },
            { id: 'cloud', label: '☁️ Synchronisation Cloud & Sauvegarde' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeSection === tab.id
                  ? 'bg-[#132A1F] text-[#F9F4EA] shadow-xs'
                  : 'text-[#132A1F]/70 hover:bg-[#132A1F]/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {activeSection === 'days' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Day Selector Grid (1 to 25) */}
              <div className="lg:col-span-4 bg-white rounded-2xl p-4 border border-[#132A1F]/10 shadow-xs h-fit">
                <h3 className="font-serif-chic font-bold text-base text-[#132A1F] mb-1">
                  Choisis une case à personnaliser
                </h3>
                <p className="text-xs text-[#4F6358] mb-3">
                  Les points indiquent les cases qui contiennent un bon cadeau 🎟️ ou une photo 📸.
                </p>

                <div className="grid grid-cols-5 gap-2">
                  {draftData.days.slice(0, draftData.settings.totalDays || 25).map((d) => {
                    const isSelected = d.day === selectedDayNum;
                    const hasCoupon = d.coupon?.enabled;
                    const hasPhoto = Boolean(d.photoUrl);

                    return (
                      <button
                        key={d.day}
                        type="button"
                        onClick={() => setSelectedDayNum(d.day)}
                        className={`relative h-12 rounded-xl font-serif-chic font-bold text-base flex flex-col items-center justify-center transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-[#9E2A2B] text-[#F9F4EA] border-[#9E2A2B] shadow-md scale-105'
                            : 'bg-[#FAF6EE] hover:bg-[#EFE7D6] text-[#132A1F] border-[#132A1F]/15'
                        }`}
                      >
                        <span>{d.day}</span>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {hasCoupon && (
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected ? 'bg-[#F2D078]' : 'bg-[#9E2A2B]'
                              }`}
                              title="Bon cadeau actif"
                            />
                          )}
                          {hasPhoto && (
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSelected ? 'bg-white' : 'bg-[#1F5E3B]'
                              }`}
                              title="Photo ajoutée"
                            />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Editor for Selected Day */}
              <div className="lg:col-span-8 space-y-5">
                {/* Day Header & Random Idea Generator */}
                <div className="bg-white rounded-2xl p-5 border border-[#132A1F]/10 shadow-xs flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#9E2A2B]">
                      Édition de la surprise
                    </span>
                    <h3 className="font-serif-chic text-2xl font-bold text-[#132A1F]">
                      Case du {currentDayObj.day} Décembre
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleApplyRandomIdea}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EFE7D6] hover:bg-[#D4AF37]/30 text-[#132A1F] text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-[#9E2A2B]" />
                    <span>Générer une idée romantique</span>
                  </button>
                </div>

                {/* Block 1: Title & Personal Note */}
                <div className="bg-white rounded-2xl p-5 border border-[#132A1F]/10 shadow-xs space-y-4">
                  <h4 className="font-serif-chic font-bold text-lg text-[#132A1F] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#9E2A2B]" />
                    <span>1. Titre & Mot doux du jour</span>
                  </h4>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4F6358] mb-1">
                      Titre de la surprise
                    </label>
                    <input
                      type="text"
                      value={currentDayObj.title || ''}
                      onChange={(e) => updateCurrentDay({ title: e.target.value })}
                      placeholder="Ex: Un bon pour te faire chouchouter ✨"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#9E2A2B]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#4F6358] mb-1">
                      Ton message personnel / Lettre / Indice
                    </label>
                    <textarea
                      rows={3}
                      value={currentDayObj.message || ''}
                      onChange={(e) => updateCurrentDay({ message: e.target.value })}
                      placeholder="Écris un mot doux, un souvenir, ou un indice pour trouver un cadeau caché..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#9E2A2B]"
                    />
                  </div>
                </div>

                {/* Block 2: Perforated Coupon Ticket (inspired by Image 2) */}
                <div className="bg-white rounded-2xl p-5 border border-[#132A1F]/10 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif-chic font-bold text-lg text-[#132A1F] flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-[#9E2A2B]" />
                      <span>2. Bon Cadeau / Ticket Perforé (Optionnel)</span>
                    </h4>

                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(currentDayObj.coupon?.enabled)}
                        onChange={(e) =>
                          updateCurrentDay((d) => ({
                            ...d,
                            coupon: { ...(d.coupon || {}), enabled: e.target.checked },
                          }))
                        }
                        className="w-4 h-4 accent-[#9E2A2B] rounded"
                      />
                      <span className="text-xs font-bold text-[#132A1F]">
                        Activer un ticket cadeau
                      </span>
                    </label>
                  </div>

                  {currentDayObj.coupon?.enabled && (
                    <div className="space-y-4 pt-2 border-t border-[#132A1F]/10">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-[#4F6358] mb-1">
                            Catégorie (petit texte en haut)
                          </label>
                          <input
                            type="text"
                            value={currentDayObj.coupon.category || ''}
                            onChange={(e) =>
                              updateCurrentDay((d) => ({
                                ...d,
                                coupon: { ...d.coupon, category: e.target.value },
                              }))
                            }
                            placeholder="Ex: Weekend Pass, Bien-être, Gourmandise..."
                            className="w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#4F6358] mb-1">
                            Badge vertical à droite (Tampon)
                          </label>
                          <input
                            type="text"
                            value={currentDayObj.coupon.stampText || ''}
                            onChange={(e) =>
                              updateCurrentDay((d) => ({
                                ...d,
                                coupon: { ...d.coupon, stampText: e.target.value },
                              }))
                            }
                            placeholder="Ex: MASSAGE, CINÉMA, RESTO..."
                            className="w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm uppercase"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#4F6358] mb-1">
                            Titre du cadeau
                          </label>
                          <input
                            type="text"
                            value={currentDayObj.coupon.offerTitle || ''}
                            onChange={(e) =>
                              updateCurrentDay((d) => ({
                                ...d,
                                coupon: { ...d.coupon, offerTitle: e.target.value },
                              }))
                            }
                            placeholder="Ex: Massage de 30 minutes"
                            className="w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#4F6358] mb-1">
                            Sous-titre manuscrit
                          </label>
                          <input
                            type="text"
                            value={currentDayObj.coupon.offerSubtitle || ''}
                            onChange={(e) =>
                              updateCurrentDay((d) => ({
                                ...d,
                                coupon: { ...d.coupon, offerSubtitle: e.target.value },
                              }))
                            }
                            placeholder="Ex: Valable quand tu veux !"
                            className="w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm"
                          />
                        </div>
                      </div>

                      {/* Ticket Color Choice */}
                      <div>
                        <label className="block text-xs font-bold text-[#4F6358] mb-1.5">
                          Couleur du Ticket
                        </label>
                        <div className="flex gap-2">
                          {[
                            { id: 'green', label: 'Vert Sauge (Image 2)' },
                            { id: 'cream', label: 'Beige Doré (Image 2)' },
                            { id: 'red', label: 'Rouge Velours' },
                          ].map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() =>
                                updateCurrentDay((d) => ({
                                  ...d,
                                  coupon: { ...d.coupon, color: c.id },
                                }))
                              }
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                                currentDayObj.coupon.color === c.id
                                  ? 'bg-[#132A1F] text-[#F9F4EA] border-[#132A1F]'
                                  : 'bg-[#FAF6EE] text-[#132A1F] border-[#132A1F]/15'
                              }`}
                            >
                              {c.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Live Ticket Preview */}
                      <div className="pt-2">
                        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#4F6358] mb-2">
                          Aperçu en direct du ticket :
                        </span>
                        <CouponCard
                          coupon={currentDayObj.coupon}
                          dayNumber={currentDayObj.day}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Block 3: Photo Souvenir & Media Link */}
                <div className="bg-white rounded-2xl p-5 border border-[#132A1F]/10 shadow-xs space-y-4">
                  <h4 className="font-serif-chic font-bold text-lg text-[#132A1F] flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#9E2A2B]" />
                    <span>3. Photo Souvenir & Musique/Lien (Optionnels)</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#4F6358] mb-1">
                        Ajouter une photo (depuis ton appareil ou URL)
                      </label>
                      <div className="flex gap-2">
                        <label className="px-3 py-2 rounded-xl bg-[#132A1F] hover:bg-[#9E2A2B] text-[#F9F4EA] text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choisir une photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          value={currentDayObj.photoUrl || ''}
                          onChange={(e) => updateCurrentDay({ photoUrl: e.target.value })}
                          placeholder="Ou colle un lien d'image https://..."
                          className="w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-xs"
                        />
                      </div>
                      {currentDayObj.photoUrl && (
                        <div className="mt-2 flex items-center gap-3">
                          <img
                            src={currentDayObj.photoUrl}
                            alt="Aperçu"
                            className="w-14 h-14 object-cover rounded-lg border border-black/15"
                          />
                          <button
                            type="button"
                            onClick={() => updateCurrentDay({ photoUrl: '' })}
                            className="text-xs text-[#9E2A2B] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Retirer la photo
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4F6358] mb-1">
                        Légende sous le Polaroid
                      </label>
                      <input
                        type="text"
                        value={currentDayObj.photoCaption || ''}
                        onChange={(e) => updateCurrentDay({ photoCaption: e.target.value })}
                        placeholder="Ex: Notre week-end inoubliable ❤️"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#132A1F]/10">
                    <div>
                      <label className="block text-xs font-bold text-[#4F6358] mb-1">
                        Lien Musical / Vidéo / Secret (Spotify, YouTube...)
                      </label>
                      <input
                        type="url"
                        value={currentDayObj.mediaUrl || ''}
                        onChange={(e) => updateCurrentDay({ mediaUrl: e.target.value })}
                        placeholder="https://open.spotify.com/..."
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#4F6358] mb-1">
                        Texte du bouton de lien
                      </label>
                      <input
                        type="text"
                        value={currentDayObj.mediaLabel || ''}
                        onChange={(e) => updateCurrentDay({ mediaLabel: e.target.value })}
                        placeholder="Ex: Écouter notre chanson 🎵"
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Block 4: Tile Visual Customization in the Bento Grid */}
                <div className="bg-white rounded-2xl p-5 border border-[#132A1F]/10 shadow-xs space-y-4">
                  <h4 className="font-serif-chic font-bold text-lg text-[#132A1F] flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#9E2A2B]" />
                    <span>4. Apparence de la Case dans la Grille Bento</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-bold text-[#4F6358] mb-1">
                        Couleur & Motif
                      </label>
                      <select
                        value={currentDayObj.theme || 'red-dots'}
                        onChange={(e) => updateCurrentDay({ theme: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm font-medium"
                      >
                        {TILE_THEMES.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4F6358] mb-1">
                        Illustration de Noël
                      </label>
                      <select
                        value={currentDayObj.illustration || 'none'}
                        onChange={(e) => updateCurrentDay({ illustration: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm font-medium"
                      >
                        {ILLUSTRATION_OPTIONS.map((ill) => (
                          <option key={ill.id} value={ill.id}>
                            {ill.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#4F6358] mb-1">
                        Format de la tuile
                      </label>
                      <select
                        value={currentDayObj.size || 'normal'}
                        onChange={(e) => updateCurrentDay({ size: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm font-medium"
                      >
                        <option value="normal">Carrée (1×1)</option>
                        <option value="wide">Large horizontale (2×1)</option>
                        <option value="tall">Haute verticale (1×2)</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#132A1F]/10">
                    <StickerEditor
                      dayData={currentDayObj}
                      onChange={(changes) => updateCurrentDay(changes)}
                      storageBytes={storageBytes}
                      storageBudget={LOCAL_STORAGE_BUDGET}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GLOBAL SETTINGS */}
          {activeSection === 'settings' && (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 border border-[#132A1F]/10 shadow-xs space-y-5">
              <h3 className="font-serif-chic text-2xl font-bold text-[#132A1F]">
                Personnalisation Générale
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4F6358] mb-1">
                    Son Prénom ou Surnom affectueux
                  </label>
                  <input
                    type="text"
                    value={draftData.settings.recipientName || ''}
                    onChange={(e) => updateSettings({ recipientName: e.target.value })}
                    placeholder="Ex: Clara, Mon Cœur, Mon Amour..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4F6358] mb-1">
                    Titre du Calendrier
                  </label>
                  <input
                    type="text"
                    value={draftData.settings.calendarTitle || ''}
                    onChange={(e) => updateSettings({ calendarTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4F6358] mb-1">
                  Message affiché si elle clique sur une case trop tôt ({'{day}'} = numéro du jour)
                </label>
                <input
                  type="text"
                  value={draftData.settings.lockedMessage || ''}
                  onChange={(e) => updateSettings({ lockedMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4F6358] mb-1">
                  Nombre total de cases
                </label>
                <select
                  value={draftData.settings.totalDays || 25}
                  onChange={(e) => updateSettings({ totalDays: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm"
                >
                  <option value={24}>24 cases (1er au 24 décembre)</option>
                  <option value={25}>25 cases (1er au 25 décembre inclus)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#132A1F]/10 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#132A1F]">
                    Réinitialiser la progression d’ouverture
                  </p>
                  <p className="text-xs text-[#4F6358]">
                    Referme toutes les cases que tu as ouvertes pendant tes tests (sans effacer tes textes).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onResetUnlockedProgress}
                  className="px-4 py-2 rounded-xl bg-[#EFE7D6] hover:bg-[#9E2A2B] hover:text-[#F9F4EA] text-[#132A1F] text-xs font-bold transition-colors cursor-pointer"
                >
                  Refermer toutes les cases
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CLOUD SYNC & JSON BACKUP */}
          {activeSection === 'cloud' && (
            <div className="max-w-2xl mx-auto space-y-5">
              {/* Cloud Sync Configuration */}
              <div className="bg-white rounded-2xl p-6 border border-[#132A1F]/10 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5">
                  <Cloud className="w-5 h-5 text-[#9E2A2B]" />
                  <h3 className="font-serif-chic text-2xl font-bold text-[#132A1F]">
                    Synchronisation Cloud à distance
                  </h3>
                </div>
                <p className="text-xs text-[#4F6358] leading-relaxed">
                  Par défaut, tes modifications sont enregistrées immédiatement sur cet appareil. Si tu veux pouvoir modifier le contenu des cases à distance après avoir envoyé le lien à ta copine, connecte une base gratuite (Firebase Realtime DB, Supabase ou JSONBin.io).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#4F6358] mb-1">
                      Service Cloud
                    </label>
                    <select
                      value={cloudConfig.provider}
                      onChange={(e) =>
                        setCloudConfig((prev) => ({ ...prev, provider: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm font-medium"
                    >
                      <option value="none">Sauvegarde Locale uniquement (Sans configuration)</option>
                      <option value="firebase">Firebase Realtime Database (Google)</option>
                      <option value="supabase">Supabase REST API</option>
                      <option value="jsonbin">JSONBin.io / Endpoint JSON</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4F6358] mb-1">
                      Identifiant du calendrier
                    </label>
                    <input
                      type="text"
                      value={cloudConfig.calendarId || ''}
                      onChange={(e) =>
                        setCloudConfig((prev) => ({ ...prev, calendarId: e.target.value }))
                      }
                      placeholder="mon-calendrier-noel"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm"
                    />
                  </div>
                </div>

                {cloudConfig.provider !== 'none' && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-[#4F6358] mb-1">
                        URL du projet ({cloudConfig.provider})
                      </label>
                      <input
                        type="url"
                        value={cloudConfig.endpointUrl || ''}
                        onChange={(e) =>
                          setCloudConfig((prev) => ({ ...prev, endpointUrl: e.target.value }))
                        }
                        placeholder={
                          cloudConfig.provider === 'firebase'
                            ? 'https://mon-projet-default-rtdb.europe-west1.firebasedatabase.app'
                            : cloudConfig.provider === 'supabase'
                            ? 'https://xyzcompany.supabase.co'
                            : 'https://api.jsonbin.io/v3/b/...'
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm"
                      />
                    </div>

                    {(cloudConfig.provider === 'supabase' ||
                      cloudConfig.provider === 'jsonbin') && (
                      <div>
                        <label className="block text-xs font-bold text-[#4F6358] mb-1">
                          Clé API publique (Anon Key / Master Key)
                        </label>
                        <input
                          type="password"
                          value={cloudConfig.apiKey || ''}
                          onChange={(e) =>
                            setCloudConfig((prev) => ({ ...prev, apiKey: e.target.value }))
                          }
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/15 text-sm"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Export / Import JSON File */}
              <div className="bg-white rounded-2xl p-6 border border-[#132A1F]/10 shadow-xs space-y-4">
                <h3 className="font-serif-chic text-xl font-bold text-[#132A1F]">
                  Sauvegarde par Fichier (Export / Import en 1 clic)
                </h3>
                <p className="text-xs text-[#4F6358]">
                  Tu peux aussi télécharger ta configuration complète en fichier <code>.json</code> pour en garder une copie ou la charger dans le fichier <code>src/data/defaultCalendar.js</code> avant de mettre le site en ligne.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="px-4 py-2.5 rounded-xl bg-[#132A1F] hover:bg-[#1F5E3B] text-[#F9F4EA] text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-[#D4AF37]" />
                    <span>Exporter mes 25 surprises (.json)</span>
                  </button>

                  <label className="px-4 py-2.5 rounded-xl bg-[#EFE7D6] hover:bg-[#D4AF37]/30 text-[#132A1F] text-xs font-bold flex items-center gap-2 cursor-pointer">
                    <Upload className="w-4 h-4 text-[#9E2A2B]" />
                    <span>Importer un fichier (.json)</span>
                    <input
                      type="file"
                      accept=".json,application/json"
                      onChange={handleImportJson}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          'Remettre toutes les cases avec les idées par défaut ?'
                        )
                      ) {
                        onResetDefault();
                        onClose();
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl border border-[#9E2A2B]/30 text-[#9E2A2B] hover:bg-[#9E2A2B]/10 text-xs font-bold flex items-center gap-2 cursor-pointer ml-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Réinitialiser par défaut</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
