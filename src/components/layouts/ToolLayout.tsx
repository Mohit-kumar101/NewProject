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
 * Desktop: left rail | center tool | right “Terms & how it works” (or ads)
 * Mobile/tablet: single centered column (rails hide)
 */
export function ToolLayout({
  children,
  leftAd,
  rightAd,
  className = "",
}: ToolLayoutProps) {
  return (
    <div
      className={`w-full overflow-x-clip px-3 py-6 sm:px-6 sm:py-10 ${className}`}
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 justify-center gap-5 sm:gap-6 md:grid-cols-1 lg:grid-cols-[200px_minmax(0,820px)_300px]">
        <div className="hidden min-w-0 lg:block">
          <AdBannerSlot side="left" label="Left sidebar">
            {leftAd}
          </AdBannerSlot>
        </div>

        <div className="mx-auto w-full min-w-0 max-w-[820px] tablet-readable lg:max-w-none">
          {children}
        </div>

        <div className="hidden min-w-0 lg:block">
          <AdBannerSlot side="right" label="Terms and how this tool works">
            {rightAd}
          </AdBannerSlot>
        </div>
      </div>
    </div>
  );
}
