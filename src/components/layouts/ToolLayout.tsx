import type { ReactNode } from "react";
import { AdBannerSlot } from "@/components/ads/AdBannerSlot";

type ToolLayoutProps = {
  children: ReactNode;
  /** Optional live ad nodes; placeholders render when omitted. */
  leftAd?: ReactNode;
  rightAd?: ReactNode;
  className?: string;
};

/**
 * Ad-ready three-column shell for dedicated tool pages.
 * Desktop: left rail (250px) | constrained center (max 800px) | right rail (250px)
 * Mobile/tablet: single centered column (rails hidden)
 */
export function ToolLayout({
  children,
  leftAd,
  rightAd,
  className = "",
}: ToolLayoutProps) {
  return (
    <div
      className={`w-full overflow-x-hidden px-4 py-8 sm:px-6 sm:py-10 ${className}`}
    >
      <div className="mx-auto grid w-full max-w-[1340px] grid-cols-1 justify-center gap-6 lg:grid-cols-[250px_minmax(0,800px)_250px]">
        <div className="hidden min-w-0 lg:block">
          <AdBannerSlot side="left">{leftAd}</AdBannerSlot>
        </div>

        <div className="mx-auto w-full min-w-0 max-w-[800px] lg:max-w-none">
          {children}
        </div>

        <div className="hidden min-w-0 lg:block">
          <AdBannerSlot side="right">{rightAd}</AdBannerSlot>
        </div>
      </div>
    </div>
  );
}
