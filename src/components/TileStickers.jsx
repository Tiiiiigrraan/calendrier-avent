import React from 'react';

/**
 * Renders user stickers on top of a tile.
 * Coordinates are percentages of the tile, so placement is identical at any screen size
 * (tiles keep a constant aspect ratio, see .bento-grid in index.css).
 */
export function stickerStyle(s) {
  return {
    left: `${s.x}%`,
    top: `${s.y}%`,
    width: `${s.width}%`,
    transform: `translate(-50%, -50%) rotate(${s.rotation || 0}deg) scaleX(${s.flipX ? -1 : 1})`,
  };
}

export function TileStickers({ stickers, zIndex = 'z-[6]' }) {
  if (!stickers?.length) return null;
  return (
    <div className={`pointer-events-none absolute inset-0 ${zIndex}`} aria-hidden="true">
      {stickers.map((s) => (
        <img
          key={s.id}
          src={s.src}
          alt=""
          draggable={false}
          className="sticker-img absolute max-w-none select-none"
          style={stickerStyle(s)}
        />
      ))}
    </div>
  );
}
