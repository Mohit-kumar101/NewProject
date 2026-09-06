/** Original SVG illustrations for presentation slides (no external stock). */

export function PresentationArt({
  variant = "growth",
  className = "",
}: {
  variant?: "growth" | "compass" | "shield" | "city" | "spark";
  className?: string;
}) {
  if (variant === "compass") {
    return (
      <svg
        className={className}
        viewBox="0 0 320 220"
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="c1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2979FF" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <circle cx="160" cy="110" r="78" stroke="url(#c1)" strokeWidth="3" opacity="0.5" />
        <circle cx="160" cy="110" r="54" stroke="#00B8D4" strokeWidth="2" opacity="0.7" />
        <path d="M160 48 L172 110 L160 172 L148 110 Z" fill="#00E5FF" opacity="0.85" />
        <path d="M160 48 L148 110 L160 90 Z" fill="#FF8C42" opacity="0.9" />
        <circle cx="160" cy="110" r="8" fill="#0b1220" />
      </svg>
    );
  }

  if (variant === "shield") {
    return (
      <svg className={className} viewBox="0 0 320 220" fill="none" aria-hidden>
        <defs>
          <linearGradient id="s1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4D8DFF" />
            <stop offset="100%" stopColor="#00B8D4" />
          </linearGradient>
        </defs>
        <path
          d="M160 36 L250 70 V118 C250 162 210 192 160 206 C110 192 70 162 70 118 V70 Z"
          fill="url(#s1)"
          opacity="0.35"
        />
        <path
          d="M160 52 L232 80 V118 C232 152 200 176 160 188 C120 176 88 152 88 118 V80 Z"
          stroke="#00E5FF"
          strokeWidth="3"
        />
        <path
          d="M130 118 L150 138 L198 90"
          stroke="#FF8C42"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (variant === "city") {
    return (
      <svg className={className} viewBox="0 0 320 220" fill="none" aria-hidden>
        <rect x="36" y="110" width="40" height="70" rx="4" fill="#2979FF" opacity="0.45" />
        <rect x="86" y="78" width="48" height="102" rx="4" fill="#00B8D4" opacity="0.55" />
        <rect x="144" y="54" width="56" height="126" rx="4" fill="#4D8DFF" opacity="0.5" />
        <rect x="210" y="92" width="44" height="88" rx="4" fill="#FF8C42" opacity="0.45" />
        <rect x="262" y="120" width="34" height="60" rx="4" fill="#00E5FF" opacity="0.4" />
        <path
          d="M20 190 H300"
          stroke="#94a3b8"
          strokeWidth="2"
          opacity="0.5"
        />
        <circle cx="250" cy="48" r="16" fill="#FF8C42" opacity="0.7" />
      </svg>
    );
  }

  if (variant === "spark") {
    return (
      <svg className={className} viewBox="0 0 320 220" fill="none" aria-hidden>
        <circle cx="160" cy="110" r="70" fill="#00E5FF" opacity="0.12" />
        <path
          d="M160 40 L175 95 L230 95 L185 128 L202 182 L160 150 L118 182 L135 128 L90 95 L145 95 Z"
          fill="#FF8C42"
          opacity="0.85"
        />
      </svg>
    );
  }

  // growth default
  return (
    <svg className={className} viewBox="0 0 320 220" fill="none" aria-hidden>
      <defs>
        <linearGradient id="g1" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2979FF" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <path
        d="M30 170 C70 170 80 120 120 120 C160 120 150 70 200 70 C240 70 250 40 290 40 V190 H30 Z"
        fill="url(#g1)"
      />
      <path
        d="M30 170 C70 170 80 120 120 120 C160 120 150 70 200 70 C240 70 250 40 290 40"
        stroke="#00E5FF"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="290" cy="40" r="8" fill="#FF8C42" />
    </svg>
  );
}
