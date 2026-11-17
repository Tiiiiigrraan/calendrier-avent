import React, { useRef, useState, useEffect } from 'react';
import {
  ImagePlus,
  Trash2,
  FlipHorizontal,
  Crosshair,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  Move,
} from 'lucide-react';
import { TileFace } from './BentoTile';
import { stickerStyle } from './TileStickers';

// Preview proportions match .bento-grid (1x1 tile = 1 wide x 1.3 tall, gap ≈ 0.11 col)
const PREVIEW = {
  normal: { aspect: '1 / 1.3', width: 210 },
  wide: { aspect: '2.11 / 1.3', width: 400 },
  tall: { aspect: '1 / 2.71', width: 170 },
};

const MAX_STICKER_PX = 600;

/** Load an image file and downscale it, keeping transparency (WebP with alpha, PNG fallback). */
export function compressStickerFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || 300;
        const h = img.naturalHeight || 300;
        const ratio = Math.min(1, MAX_STICKER_PX / Math.max(w, h));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(w * ratio));
        canvas.height = Math.max(1, Math.round(h * ratio));
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        let url = canvas.toDataURL('image/webp', 0.86);
        if (!url.startsWith('data:image/webp')) url = canvas.toDataURL('image/png');
        resolve(url);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const round1 = (v) => Math.round(v * 10) / 10;

function snapAngle(deg, force) {
  let a = ((deg + 540) % 360) - 180; // normalise to [-180, 180)
  const nearest = Math.round(a / 15) * 15;
  if (force || Math.abs(a - nearest) < 3) a = nearest;
  return a === -180 ? 180 : Math.round(a);
}

export function StickerEditor({ dayData, onChange, storageBytes, storageBudget }) {
  const stickers = dayData.stickers || [];
  const size = dayData.size || 'normal';
  const preview = PREVIEW[size] || PREVIEW.normal;

  const boxRef = useRef(null);
  const fileRef = useRef(null);
  const [selectedId, setSelectedId] = useState(stickers[0]?.id ?? null);
  const [busy, setBusy] = useState(false);

  // Keep selection valid when switching day
  useEffect(() => {
    if (!stickers.find((s) => s.id === selectedId)) setSelectedId(stickers[stickers.length - 1]?.id ?? null);
  }, [dayData.day, stickers.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const selected = stickers.find((s) => s.id === selectedId) || null;

  const setStickers = (next) => onChange({ stickers: next });
  const updateSticker = (id, changes) =>
    setStickers(stickers.map((s) => (s.id === id ? { ...s, ...changes } : s)));

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    try {
      const src = await compressStickerFile(file);
      const id = `stk_${Date.now().toString(36)}`;
      setStickers([...stickers, { id, src, x: 50, y: 55, width: 60, rotation: 0, flipX: false, layer: 'front' }]);
      setSelectedId(id);
    } catch (err) {
      console.error('Sticker upload error:', err);
      alert("Impossible de lire cette image. Essaie un fichier PNG, WebP ou JPG.");
    } finally {
      setBusy(false);
    }
  };

  // ----- Direct manipulation (drag / resize / rotate) -----
  const startGesture = (e, sticker, mode) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(sticker.id);
    const rect = boxRef.current.getBoundingClientRect();
    const cx = rect.left + (sticker.x / 100) * rect.width;
    const cy = rect.top + (sticker.y / 100) * rect.height;
    const start = { px: e.clientX, py: e.clientY, ...sticker };
    const startDist = Math.hypot(e.clientX - cx, e.clientY - cy) || 1;

    const onMove = (ev) => {
      if (mode === 'move') {
        const x = clamp(start.x + ((ev.clientX - start.px) / rect.width) * 100, -20, 120);
        const y = clamp(start.y + ((ev.clientY - start.py) / rect.height) * 100, -20, 120);
        updateStickerLive(sticker.id, { x: round1(x), y: round1(y) });
      } else if (mode === 'resize') {
        const dist = Math.hypot(ev.clientX - cx, ev.clientY - cy);
        updateStickerLive(sticker.id, { width: round1(clamp(start.width * (dist / startDist), 5, 250)) });
      } else if (mode === 'rotate') {
        const deg = (Math.atan2(ev.clientY - cy, ev.clientX - cx) * 180) / Math.PI + 90;
        updateStickerLive(sticker.id, { rotation: snapAngle(deg, ev.shiftKey) });
      }
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  // Gestures need the freshest stickers array, not the one captured at pointerdown
  const latest = useRef(stickers);
  latest.current = stickers;
  const updateStickerLive = (id, changes) =>
    onChange({ stickers: latest.current.map((s) => (s.id === id ? { ...s, ...changes } : s)) });

  const handleKeyDown = (e) => {
    if (!selected) return;
    const step = e.shiftKey ? 5 : 0.5;
    const moves = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) {
      e.preventDefault();
      const [dx, dy] = moves[e.key];
      updateSticker(selected.id, { x: round1(selected.x + dx), y: round1(selected.y + dy) });
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      setStickers(stickers.filter((s) => s.id !== selected.id));
    }
  };

  const move = (dir) => {
    const i = stickers.findIndex((s) => s.id === selectedId);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= stickers.length) return;
    const next = [...stickers];
    [next[i], next[j]] = [next[j], next[i]];
    setStickers(next);
  };

  const pct = storageBudget ? Math.min(100, (storageBytes / storageBudget) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-[#4F6358]">Mes images sur la case</p>
          <p className="text-[11px] text-[#4F6358]/80">
            PNG transparent conseillé. Glisse pour déplacer, coin ↘ pour la taille, poignée ronde pour tourner
            (Maj = pas de 15°).
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="px-3 py-2 rounded-xl bg-[#132A1F] hover:bg-[#1E3F2F] text-[#F9F4EA] text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
        >
          <ImagePlus className="w-3.5 h-3.5" />
          <span>{busy ? 'Chargement…' : 'Ajouter une image'}</span>
        </button>
        <input ref={fileRef} type="file" accept="image/png,image/webp,image/jpeg,image/svg+xml,image/gif" className="hidden" onChange={handleUpload} />
      </div>

      <div className="flex flex-col md:flex-row gap-5 items-start">
        {/* Live tile preview */}
        <div className="shrink-0 mx-auto md:mx-0 p-4 rounded-2xl bg-[#142E22] max-w-full">
          <div
            ref={boxRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPointerDown={() => setSelectedId(null)}
            className="relative rounded-2xl shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] touch-none"
            style={{ width: preview.width, maxWidth: '100%', aspectRatio: preview.aspect }}
            aria-label="Aperçu de la case, utilise les flèches pour déplacer l'image sélectionnée"
          >
            <TileFace dayData={dayData} stickers={stickers} />
            {/* Invisible hit-targets on top so any sticker (front or back) can be dragged */}
            <div className="absolute inset-0 z-20 overflow-hidden rounded-2xl">
              {stickers.map((s) => (
                <img
                  key={s.id}
                  src={s.src}
                  alt=""
                  draggable={false}
                  onPointerDown={(e) => startGesture(e, s, 'move')}
                  className="absolute max-w-none select-none cursor-move opacity-0"
                  style={stickerStyle(s)}
                />
              ))}
            </div>
            {/* Selection frame + handles (outside overflow so handles stay grabbable) */}
            {selected && (
              <div
                className="absolute z-30 pointer-events-none"
                style={{ ...stickerStyle(selected), transform: `translate(-50%, -50%) rotate(${selected.rotation || 0}deg)` }}
              >
                <img src={selected.src} alt="" className="invisible w-full" draggable={false} />
                <div className="absolute inset-0 border-2 border-dashed border-[#D4AF37] rounded-sm" />
                <button
                  type="button"
                  onPointerDown={(e) => startGesture(e, selected, 'rotate')}
                  className="pointer-events-auto absolute left-1/2 -top-7 -translate-x-1/2 w-4 h-4 rounded-full bg-[#D4AF37] border-2 border-white shadow cursor-grab touch-none"
                  aria-label="Tourner"
                />
                <span className="absolute left-1/2 -top-3 h-3 w-px bg-[#D4AF37]" />
                <button
                  type="button"
                  onPointerDown={(e) => startGesture(e, selected, 'resize')}
                  className="pointer-events-auto absolute -right-2 -bottom-2 w-4 h-4 rounded-sm bg-white border-2 border-[#D4AF37] shadow cursor-nwse-resize touch-none"
                  aria-label="Redimensionner"
                />
              </div>
            )}
          </div>
          <p className="mt-2 text-center text-[10px] text-[#F9F4EA]/60">Aperçu fidèle de la case {dayData.day}</p>
        </div>

        {/* Precise controls */}
        <div className="flex-1 w-full space-y-3">
          {stickers.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {stickers.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  className={`w-12 h-12 rounded-lg border-2 bg-[#FAF6EE] p-1 cursor-pointer ${
                    s.id === selectedId ? 'border-[#9E2A2B]' : 'border-transparent'
                  }`}
                  title={`Image ${i + 1}`}
                >
                  <img src={s.src} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {selected ? (
            <>
              <div>
                <span className="block text-[11px] font-bold text-[#4F6358] mb-1">
                  Plan par rapport au chiffre / à l’illustration de la case
                </span>
                <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#FAF6EE] border border-[#132A1F]/10">
                  {[
                    { id: 'front', label: 'Premier plan (Devant)' },
                    { id: 'back', label: 'Arrière-plan (Derrière)' },
                  ].map((opt) => {
                    const active = (selected.layer || 'front') === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => updateSticker(selected.id, { layer: opt.id })}
                        className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                          active
                            ? 'bg-[#132A1F] text-[#F9F4EA] shadow-xs'
                            : 'text-[#4F6358] hover:text-[#132A1F]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {[
                { key: 'x', label: 'Position horizontale', min: -20, max: 120, step: 0.5, unit: '%' },
                { key: 'y', label: 'Position verticale', min: -20, max: 120, step: 0.5, unit: '%' },
                { key: 'width', label: 'Taille', min: 5, max: 250, step: 0.5, unit: '%' },
                { key: 'rotation', label: 'Rotation', min: -180, max: 180, step: 1, unit: '°' },
              ].map((c) => (
                <label key={c.key} className="block">
                  <span className="flex items-center justify-between text-[11px] font-bold text-[#4F6358] mb-0.5">
                    <span>{c.label}</span>
                    <span className="flex items-center gap-1">
                      <input
                        type="number"
                        min={c.min}
                        max={c.max}
                        step={c.step}
                        value={selected[c.key] ?? 0}
                        onChange={(e) => {
                          const v = parseFloat(e.target.value);
                          if (!Number.isNaN(v)) updateSticker(selected.id, { [c.key]: clamp(v, c.min, c.max) });
                        }}
                        className="w-16 px-1.5 py-0.5 rounded-md bg-[#FAF6EE] border border-[#132A1F]/15 text-right text-xs"
                      />
                      <span className="w-3">{c.unit}</span>
                    </span>
                  </span>
                  <input
                    type="range"
                    min={c.min}
                    max={c.max}
                    step={c.step}
                    value={selected[c.key] ?? 0}
                    onChange={(e) => updateSticker(selected.id, { [c.key]: parseFloat(e.target.value) })}
                    className="w-full accent-[#9E2A2B]"
                  />
                </label>
              ))}

              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { icon: Crosshair, label: 'Centrer', run: () => updateSticker(selected.id, { x: 50, y: 50 }) },
                  { icon: FlipHorizontal, label: 'Miroir', run: () => updateSticker(selected.id, { flipX: !selected.flipX }) },
                  {
                    icon: RotateCcw,
                    label: 'Réinitialiser',
                    run: () => updateSticker(selected.id, { x: 50, y: 55, width: 60, rotation: 0, flipX: false }),
                  },
                  ...(stickers.length > 1
                    ? [
                        { icon: ArrowUp, label: 'Monter calque', run: () => move(1) },
                        { icon: ArrowDown, label: 'Descendre calque', run: () => move(-1) },
                      ]
                    : []),
                ].map(({ icon: Icon, label, run }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={run}
                    className="px-2.5 py-1.5 rounded-lg bg-[#FAF6EE] hover:bg-[#EFE6D3] border border-[#132A1F]/10 text-[11px] font-semibold text-[#132A1F] flex items-center gap-1 cursor-pointer"
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setStickers(stickers.filter((s) => s.id !== selected.id))}
                  className="px-2.5 py-1.5 rounded-lg bg-[#9E2A2B]/10 hover:bg-[#9E2A2B]/20 text-[11px] font-semibold text-[#9E2A2B] flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  Supprimer
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-[#132A1F]/20 p-4 text-xs text-[#4F6358] flex items-center gap-2">
              <Move className="w-4 h-4 shrink-0" />
              {stickers.length
                ? 'Clique sur une image dans l’aperçu pour la régler.'
                : 'Ajoute un dessin (ex : ton Shrek en PNG) pour le placer sur la case.'}
            </div>
          )}

          <label className="flex items-center gap-2 text-xs font-semibold text-[#132A1F] cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={Boolean(dayData.hideDefaultArt)}
              onChange={(e) => onChange({ hideDefaultArt: e.target.checked })}
              className="accent-[#9E2A2B]"
            />
            Masquer le grand chiffre / l’illustration (le petit numéro reste en coin)
          </label>

          {storageBudget && (
            <div className="pt-1">
              <div className="flex justify-between text-[10px] text-[#4F6358] mb-0.5">
                <span>Espace navigateur utilisé</span>
                <span>
                  {Math.round(storageBytes / 1024)} Ko / ~{Math.round(storageBudget / 1024)} Ko
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-[#132A1F]/10 overflow-hidden">
                <div
                  className={`h-full rounded-full ${pct > 85 ? 'bg-[#9E2A2B]' : 'bg-[#2E6F40]'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
