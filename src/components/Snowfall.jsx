import React, { useMemo } from 'react';

// Four hand-drawn six-branch snowflake designs (viewBox 0 0 40 40, centred on 20,20).
// Each design is a single branch repeated 6 times by rotation.
const BRANCHES = {
  dendrite: (
    <>
      <path d="M20 20 V3" />
      <path d="M20 8 L16 4.5 M20 8 L24 4.5" />
      <path d="M20 13 L15 9.5 M20 13 L25 9.5" />
      <path d="M20 17 L17.5 15 M20 17 L22.5 15" />
    </>
  ),
  star: (
    <>
      <path d="M20 20 V4" />
      <path d="M20 10 L17 7 M20 10 L23 7" />
      <circle cx="20" cy="3.5" r="1.4" />
    </>
  ),
  crystal: (
    <>
      <path d="M20 20 V5" />
      <path d="M17.2 9 L20 5 L22.8 9" />
      <path d="M20 14 L16 11.5 M20 14 L24 11.5" />
    </>
  ),
  simple: (
    <>
      <path d="M20 20 V5" />
      <path d="M20 11 L17 8.5 M20 11 L23 8.5" />
    </>
  ),
};
const SHAPES = Object.keys(BRANCHES);

function Flake({ shape, color }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className="w-full h-full"
      fill="none"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 20 20)`}>
          {BRANCHES[shape]}
        </g>
      ))}
      <circle cx="20" cy="20" r="1.6" fill={color} stroke="none" />
    </svg>
  );
}

// Deterministic pseudo-random so the layout is stable between renders
function rand(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const LAYERS = [
  // far: small, slow, soft
  { count: 16, size: [7, 11], duration: [22, 32], opacity: [0.18, 0.3], blur: 0.6, sway: 14 },
  // mid
  { count: 12, size: [12, 18], duration: [15, 22], opacity: [0.3, 0.45], blur: 0, sway: 24 },
  // near: rare, big, detailed
  { count: 4, size: [22, 30], duration: [11, 15], opacity: [0.4, 0.55], blur: 0, sway: 36 },
];

export function Snowfall({ enabled = true }) {
  const { flakes, sparkles } = useMemo(() => {
    let seed = 1;
    const lerp = ([a, b], t) => a + (b - a) * t;
    const out = [];
    LAYERS.forEach((layer, li) => {
      for (let i = 0; i < layer.count; i++) {
        const r = () => rand(seed++);
        const duration = lerp(layer.duration, r());
        out.push({
          id: `${li}-${i}`,
          left: r() * 100,
          size: lerp(layer.size, r()),
          duration,
          delay: -r() * duration,
          swayDuration: 3 + r() * 3,
          swayAmp: layer.sway * (0.6 + r() * 0.4),
          spin: (r() > 0.5 ? 1 : -1) * (8 + r() * 10),
          opacity: lerp(layer.opacity, r()),
          blur: layer.blur,
          shape: SHAPES[Math.floor(r() * SHAPES.length)],
          gold: r() < 0.15,
        });
      }
    });
    const sp = Array.from({ length: 7 }).map((_, i) => ({
      id: i,
      left: rand(500 + i) * 100,
      top: rand(700 + i) * 90 + 5,
      size: 8 + rand(900 + i) * 6,
      delay: rand(1100 + i) * 4,
      duration: 2.6 + rand(1300 + i) * 2,
    }));
    return { flakes: out, sparkles: sp };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      {flakes.map((f) => (
        <div
          key={f.id}
          className="snow-fall absolute top-0"
          style={{
            left: `${f.left}%`,
            width: f.size,
            height: f.size,
            animationDuration: `${f.duration}s`,
            animationDelay: `${f.delay}s`,
          }}
        >
          <div
            className="snow-sway w-full h-full"
            style={{
              '--sway': `${f.swayAmp}px`,
              animationDuration: `${f.swayDuration}s`,
              animationDelay: `${f.delay}s`,
            }}
          >
            <div
              className="snow-spin w-full h-full"
              style={{
                opacity: f.opacity,
                filter: f.blur ? `blur(${f.blur}px)` : undefined,
                animationDuration: `${Math.abs(f.spin)}s`,
                animationDirection: f.spin < 0 ? 'reverse' : 'normal',
              }}
            >
              <Flake shape={f.shape} color={f.gold ? '#E9C766' : '#F9F4EA'} />
            </div>
          </div>
        </div>
      ))}

      {sparkles.map((s) => (
        <span
          key={`sp-${s.id}`}
          className="twinkle absolute text-[#F2D078]"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            fontSize: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  );
}
