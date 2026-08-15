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
 * Sticky rail slot for ads. Empty when no children — reserved layout space only.
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
      <div className="sticky top-24 space-y-4">{children ?? null}</div>
    </aside>
  );
}
