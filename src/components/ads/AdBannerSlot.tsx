import type { ReactNode } from "react";

type AdBannerSlotProps = {
  /** Visual placement for sticky rails and future ad targeting. */
  side?: "left" | "right";
  /** Optional live ad markup/script wrapper content. */
  children?: ReactNode;
  /** Accessible label for the ad region. */
  label?: string;
  className?: string;
};

/**
 * Sticky rail slot for ads or interim promotional content.
 * Pass children for live ads / fillers; dashed placeholder remains as fallback.
 */
export function AdBannerSlot({
  side = "right",
  children,
  label = "Sidebar",
  className = "",
}: AdBannerSlotProps) {
  return (
    <aside
      aria-label={label}
      data-ad-side={side}
      className={`w-full min-w-0 ${className}`}
    >
      <div className="sticky top-24 space-y-4">
        {children ? (
          children
        ) : (
          <div
            className="flex min-h-[280px] items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_70%,transparent)] px-3 text-center"
            role="presentation"
          >
            <div className="space-y-2">
              <div className="mx-auto h-1 w-10 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#2979FF] opacity-50" />
              <p className="text-[11px] font-medium tracking-[0.14em] text-[var(--muted)] uppercase">
                Reserved for ads
              </p>
              <p className="text-[10px] leading-relaxed text-[var(--muted)] opacity-70">
                {side === "left" ? "160×600 / 300×600" : "300×600 skyscraper"}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
