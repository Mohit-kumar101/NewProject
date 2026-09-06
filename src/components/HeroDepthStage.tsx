/** Decorative CSS-3D glass slabs for the homepage hero visual anchor. */
export function HeroDepthStage() {
  return (
    <div
      className="hero-stage relative mx-auto hidden h-[340px] w-full max-w-md lg:block"
      aria-hidden
    >
      <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-[color-mix(in_srgb,var(--accent)_18%,transparent)] via-transparent to-[color-mix(in_srgb,var(--glow-warm)_35%,transparent)] opacity-80 blur-2xl" />

      <div className="hero-slab hero-slab--a glass-3d-strong absolute top-8 left-6 z-20 h-44 w-56 rounded-3xl p-4">
        <p className="text-[10px] font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
          Live result
        </p>
        <p className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[var(--foreground)]">
          $2,480
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">Monthly runway</p>
        <div className="mt-5 h-16 overflow-hidden rounded-xl border border-[var(--glass-border)] bg-[color-mix(in_srgb,var(--background)_55%,transparent)] p-2">
          <svg viewBox="0 0 120 40" className="h-full w-full" fill="none">
            <path
              d="M0 28 C20 28 18 12 40 14 C62 16 58 30 80 22 C98 16 108 8 120 10"
              stroke="#00E5FF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M0 28 C20 28 18 12 40 14 C62 16 58 30 80 22 C98 16 108 8 120 10 V40 H0 Z"
              fill="url(#heroGlow)"
              opacity="0.35"
            />
            <defs>
              <linearGradient id="heroGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="100%" stopColor="#00E5FF" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div className="hero-slab hero-slab--b glass-3d absolute top-24 right-2 z-10 h-40 w-44 rounded-3xl p-4">
        <p className="text-[10px] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
          Split
        </p>
        <div className="mt-4 flex items-end gap-2">
          <div className="h-16 w-3 rounded-full bg-[color-mix(in_srgb,var(--accent)_35%,transparent)]" />
          <div className="h-24 w-3 rounded-full bg-[var(--accent)] shadow-[0_0_18px_var(--glow)]" />
          <div className="h-12 w-3 rounded-full bg-[color-mix(in_srgb,var(--accent-strong)_55%,transparent)]" />
          <div className="h-20 w-3 rounded-full bg-[color-mix(in_srgb,#ff8c42_70%,transparent)]" />
          <div className="h-10 w-3 rounded-full bg-[color-mix(in_srgb,var(--accent)_25%,transparent)]" />
        </div>
        <p className="mt-4 text-xs text-[var(--muted)]">Scenario compare</p>
      </div>

      <div className="hero-slab hero-slab--c glass-3d absolute right-10 bottom-4 z-30 flex h-28 w-48 items-center gap-3 rounded-3xl p-4">
        <div
          className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
          style={{
            background:
              "conic-gradient(from 210deg, #00e5ff 0%, #2979ff 55%, #ff8c42 78%, transparent 78%)",
            boxShadow: "0 0 24px var(--glow)",
          }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface-solid)] text-xs font-bold text-[var(--foreground)]">
            78%
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-[var(--foreground)]">
            Goal pace
          </p>
          <p className="mt-1 text-[11px] leading-snug text-[var(--muted)]">
            On track this month
          </p>
        </div>
      </div>
    </div>
  );
}
