import React from 'react';

export const ILLUSTRATION_OPTIONS = [
  { id: 'none', label: 'Aucune (Chiffre mis en avant)' },
  { id: 'snowflake', label: 'Flocon de neige doré' },
  { id: 'gingerbread', label: 'Bonhomme en pain d’épices' },
  { id: 'socks', label: 'Chaussettes de Noël' },
  { id: 'bauble', label: 'Boule de Noël & grelot' },
  { id: 'star', label: 'Étoile dorée en relief' },
  { id: 'bow', label: 'Grand nœud rouge velours' },
  { id: 'swirlTree', label: 'Sapin ruban stylisé' },
  { id: 'holly', label: 'Feuilles de houx & baies' },
  { id: 'pineTree', label: 'Sapin enneigé crème' },
  { id: 'polarBear', label: 'Petit ours polaire' },
  { id: 'mittens', label: 'Moufles rouges reliées' },
  { id: 'giftBox', label: 'Cadeau précieux au ruban' },
  { id: 'candyCane', label: 'Sucre d’orge bicolore' },
  { id: 'loveLetter', label: 'Enveloppe cachetée d’or' },
];

export function HolidayIllustration({ type, className = 'w-16 h-16' }) {
  switch (type) {
    case 'snowflake':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
          <g stroke="#D4AF37" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <g key={deg} transform={`rotate(${deg} 50 50)`}>
                <line x1="50" y1="50" x2="50" y2="8" />
                <path d="M50 20 L41 12 M50 20 L59 12" />
                <path d="M50 32 L39 24 M50 32 L61 24" />
                <path d="M50 42 L45 38 M50 42 L55 38" />
              </g>
            ))}
            <circle cx="50" cy="50" r="4" fill="#D4AF37" stroke="none" />
          </g>
        </svg>
      );

    case 'gingerbread':
      return (
        <svg viewBox="0 0 100 110" className={className} fill="none" aria-hidden="true">
          {/* Head */}
          <circle cx="50" cy="24" r="16" fill="#B5723B" />
          {/* Body & Limbs */}
          <rect x="37" y="38" width="26" height="36" rx="10" fill="#B5723B" />
          <rect x="16" y="40" width="68" height="14" rx="7" fill="#B5723B" />
          <rect x="33" y="66" width="14" height="32" rx="7" transform="rotate(10 33 66)" fill="#B5723B" />
          <rect x="53" y="66" width="14" height="32" rx="7" transform="rotate(-10 53 66)" fill="#B5723B" />
          {/* Icing details */}
          <circle cx="44" cy="21" r="2.2" fill="#2A1E17" />
          <circle cx="56" cy="21" r="2.2" fill="#2A1E17" />
          <path d="M44 29 Q50 34 56 29" stroke="#F9F4EA" strokeWidth="2.5" strokeLinecap="round" />
          {/* Bowtie */}
          <path d="M42 36 L58 43 L58 36 L42 43 Z" fill="#9E2A2B" />
          <circle cx="50" cy="39.5" r="2.5" fill="#D4AF37" />
          {/* Buttons */}
          <circle cx="50" cy="51" r="3" fill="#F9F4EA" />
          <circle cx="50" cy="61" r="3" fill="#9E2A2B" />
          {/* Icing squiggles on limbs */}
          <path d="M22 44 Q24 47 22 50" stroke="#F9F4EA" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M78 44 Q76 47 78 50" stroke="#F9F4EA" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M32 88 Q38 90 43 89" stroke="#F9F4EA" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M57 89 Q62 90 68 88" stroke="#F9F4EA" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'socks':
      return (
        <svg viewBox="0 0 110 110" className={className} fill="none" aria-hidden="true">
          {/* Top Right Sock */}
          <g transform="translate(55, 8) rotate(18)">
            <path d="M12 10 H34 V40 C34 49 26 54 17 54 H6 C0 54 -2 46 3 41 L12 34 Z" fill="#9E2A2B" />
            <rect x="9" y="2" width="28" height="11" rx="4" fill="#F9F4EA" />
            <path d="M12 48 C18 45 26 48 31 51" stroke="#F9F4EA" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          </g>
          {/* Bottom Left Sock */}
          <g transform="translate(8, 48) rotate(-14)">
            <path d="M10 10 H32 V36 H50 C57 36 60 42 58 48 C56 54 50 55 46 55 H18 C13 55 10 51 10 46 Z" fill="#9E2A2B" />
            <rect x="7" y="2" width="28" height="11" rx="4" fill="#F9F4EA" />
            <circle cx="15" cy="46" r="7" fill="#F9F4EA" opacity="0.85" />
          </g>
        </svg>
      );

    case 'bauble':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
          {/* Hanging cord */}
          <path d="M62 22 C74 8 88 18 76 34" stroke="#D4AF37" strokeWidth="2.2" fill="none" />
          {/* Cap */}
          <rect x="52" y="20" width="14" height="8" rx="2" transform="rotate(20 52 20)" fill="#D4AF37" />
          {/* Main sphere */}
          <circle cx="50" cy="56" r="30" fill="#F5ECDC" />
          {/* Decorative band */}
          <path d="M22 46 Q50 64 78 46" stroke="#D9C5A3" strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="46" cy="70" r="4" fill="#B5986B" />
          <path d="M46 70 L68 80" stroke="#B5986B" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'star':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
          {/* Faceted 3D Star like Image 1 Day 9 */}
          <polygon points="50,8 63,36 93,39 70,59 77,89 50,73 23,89 30,59 7,39 37,36" fill="#F7F1E3" />
          <polygon points="50,8 63,36 50,50" fill="#E3D2B4" />
          <polygon points="93,39 70,59 50,50" fill="#E3D2B4" />
          <polygon points="77,89 50,73 50,50" fill="#DEC8A2" />
          <polygon points="23,89 30,59 50,50" fill="#E9DAC0" />
          <polygon points="7,39 37,36 50,50" fill="#DEC8A2" />
        </svg>
      );

    case 'bow':
      return (
        <svg viewBox="0 0 120 90" className={className} fill="none" aria-hidden="true">
          {/* Ribbon tails */}
          <path d="M54 45 L34 82 L45 77 L52 85 L60 48" fill="#821D1E" />
          <path d="M64 45 L82 80 L71 76 L65 84 L58 48" fill="#821D1E" />
          {/* Left loop */}
          <path d="M58 42 C38 14 14 20 18 42 C21 60 42 56 58 44 Z" fill="#9E2A2B" />
          <path d="M55 42 C40 30 28 34 28 42" stroke="#781A1B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Right loop */}
          <path d="M62 42 C82 14 106 20 102 42 C99 60 78 56 62 44 Z" fill="#9E2A2B" />
          <path d="M65 42 C80 30 92 34 92 42" stroke="#781A1B" strokeWidth="2.5" strokeLinecap="round" />
          {/* Center knot */}
          <rect x="52" y="34" width="16" height="16" rx="5" transform="rotate(-6 52 34)" fill="#B53334" />
        </svg>
      );

    case 'swirlTree':
      return (
        <svg viewBox="0 0 90 120" className={className} fill="none" aria-hidden="true">
          {/* Stylized ribbon tree like Image 1 Day 16 */}
          <path
            d="M45 20 Q56 25 40 31 Q28 37 50 42 Q66 49 36 56 Q18 64 56 71 Q78 80 30 88 Q8 96 62 104"
            stroke="#F9F4EA"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="50" cy="42" r="2.6" fill="#D94E4E" />
          <circle cx="36" cy="56" r="2.6" fill="#D4AF37" />
          <circle cx="56" cy="71" r="2.6" fill="#D94E4E" />
          <circle cx="30" cy="88" r="2.6" fill="#D4AF37" />
          <rect x="41" y="106" width="8" height="8" rx="1.5" fill="#B5986B" />
          <polygon points="45,6 47.6,12.4 54.4,12.6 49,16.8 51,23 45,19.4 39,23 41,16.8 35.6,12.6 42.4,12.4" fill="#D4AF37" />
        </svg>
      );

    case 'holly':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
          {/* Holly leaves */}
          <path d="M50 52 C34 34 26 16 14 20 C16 34 26 48 50 52 Z" fill="#A5BFA8" />
          <path d="M50 52 C68 34 82 26 86 14 C72 16 58 26 50 52 Z" fill="#8FA998" />
          <path d="M50 52 C36 68 24 80 16 84 C20 70 30 58 50 52 Z" fill="#8FA998" />
          {/* Berries */}
          <circle cx="48" cy="48" r="6" fill="#F9F4EA" />
          <circle cx="56" cy="54" r="5.5" fill="#D4AF37" />
          <circle cx="45" cy="58" r="5" fill="#D4AF37" />
        </svg>
      );

    case 'pineTree':
      return (
        <svg viewBox="0 0 100 130" className={className} fill="none" aria-hidden="true">
          {/* Layered creamy pine tree like Image 1 Day 18 */}
          <rect x="43" y="102" width="14" height="18" rx="2" fill="#F5ECDC" />
          <path d="M50 12 L24 50 H36 L18 80 H32 L12 106 H88 L68 80 H82 L64 50 H76 L50 12 Z" fill="#F9F4EA" />
        </svg>
      );

    case 'polarBear':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
          {/* Ears */}
          <circle cx="26" cy="28" r="10" fill="#FFFFFF" />
          <circle cx="26" cy="28" r="5" fill="#E5D5BC" />
          <circle cx="74" cy="28" r="10" fill="#FFFFFF" />
          <circle cx="74" cy="28" r="5" fill="#E5D5BC" />
          {/* Head */}
          <circle cx="50" cy="54" r="30" fill="#FFFFFF" />
          {/* Snout */}
          <ellipse cx="50" cy="60" rx="11" ry="13" fill="#E8D6BA" />
          <ellipse cx="50" cy="54" rx="5" ry="3.8" fill="#9E2A2B" />
          <path d="M50 58 V65 M45 65 Q50 68 55 65" stroke="#2A1E17" strokeWidth="2.2" strokeLinecap="round" />
          {/* Eyes & Cheeks */}
          <circle cx="38" cy="46" r="2.8" fill="#2A1E17" />
          <circle cx="62" cy="46" r="2.8" fill="#2A1E17" />
          <circle cx="32" cy="55" r="4.5" fill="#D97979" opacity="0.45" />
          <circle cx="68" cy="55" r="4.5" fill="#D97979" opacity="0.45" />
        </svg>
      );

    case 'mittens':
      return (
        <svg viewBox="0 0 110 130" className={className} fill="none" aria-hidden="true">
          {/* Connecting string */}
          <path d="M76 52 C76 74 34 62 34 86" stroke="#B5723B" strokeWidth="2.5" fill="none" />
          {/* Top Right Mitten */}
          <g transform="translate(54, 10)">
            <path d="M8 28 V14 C8 5 34 5 34 14 V28 H8 Z" fill="#9E2A2B" />
            <path d="M8 18 L2 14 C-2 11 2 6 6 9 L10 13" fill="#9E2A2B" />
            <rect x="5" y="28" width="32" height="10" rx="4" fill="#F9F4EA" />
            <path d="M8 24 H34" stroke="#F9F4EA" strokeWidth="2" strokeDasharray="3 3" />
          </g>
          {/* Bottom Left Mitten */}
          <g transform="translate(14, 78)">
            <rect x="5" y="0" width="32" height="10" rx="4" fill="#F9F4EA" />
            <path d="M8 10 V26 C8 36 34 36 34 26 V10 H8 Z" fill="#9E2A2B" />
            <path d="M34 20 L40 24 C44 27 40 32 36 29 L32 25" fill="#9E2A2B" />
            <path d="M8 15 H34" stroke="#F9F4EA" strokeWidth="2" strokeDasharray="3 3" />
          </g>
        </svg>
      );

    case 'giftBox':
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden="true">
          {/* 3D Isometric Gift like Image 1 Day 24 */}
          <polygon points="50,34 82,44 82,82 50,92 18,82 18,44" fill="#8FA998" />
          <polygon points="50,34 82,44 50,54 18,44" fill="#A5BFA8" />
          <polygon points="50,54 82,44 82,82 50,92" fill="#769180" />
          {/* Ribbon */}
          <polygon points="32,39 64,49 64,87 57,89 57,51 25,41" fill="#9E2A2B" />
          <polygon points="68,39 36,49 36,87 43,89 43,51 75,41" fill="#9E2A2B" />
          {/* Top bow */}
          <path d="M50 38 C36 22 24 28 32 38 C38 44 46 40 50 38 Z" fill="#9E2A2B" />
          <path d="M50 38 C64 22 76 28 68 38 C62 44 54 40 50 38 Z" fill="#B53334" />
        </svg>
      );

    case 'candyCane':
      return (
        <svg viewBox="0 0 90 110" className={className} fill="none" aria-hidden="true">
          <g transform="rotate(12 45 55)">
            <path
              d="M35 88 V34 C35 18 63 18 63 34 V40"
              stroke="#F9F4EA"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M35 88 V34 C35 18 63 18 63 34 V40"
              stroke="#9E2A2B"
              strokeWidth="12"
              strokeLinecap="butt"
              strokeDasharray="10 10"
            />
          </g>
        </svg>
      );

    case 'loveLetter':
      return (
        <svg viewBox="0 0 100 90" className={className} fill="none" aria-hidden="true">
          <rect x="12" y="18" width="76" height="54" rx="6" fill="#F9F4EA" stroke="#D4AF37" strokeWidth="2" />
          <path d="M14 20 L50 50 L86 20" stroke="#D9C5A3" strokeWidth="2.5" fill="none" />
          {/* Wax seal */}
          <circle cx="50" cy="48" r="10" fill="#9E2A2B" />
          <path d="M50 44 C48 41 44 42 44 45 C44 48 50 52 50 52 C50 52 56 48 56 45 C56 42 52 41 50 44 Z" fill="#D4AF37" />
        </svg>
      );

    default:
      return null;
  }
}
