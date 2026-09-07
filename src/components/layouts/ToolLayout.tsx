import type { ReactNode } from "react";

type ToolLayoutProps = {
  children: ReactNode;
  /** Desktop right rail — usually the terms / how-it-works panel. */
  sidebar?: ReactNode;
  className?: string;
};

/**
 * Three-column shell for dedicated tool pages.
 * Desktop: spacer | center tool | terms rail
 * Mobile/tablet: single centered column
 */
export function ToolLayout({
  children,
  sidebar,
  className = "",
}: ToolLayoutProps) {
  return (
    <div
      className={`w-full overflow-x-clip px-3 py-6 sm:px-6 sm:py-10 ${className}`}
    >
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 justify-center gap-5 sm:gap-6 md:grid-cols-1 lg:grid-cols-[200px_minmax(0,820px)_300px]">
        <div className="hidden min-w-0 lg:block" />

        <div className="mx-auto w-full min-w-0 max-w-[820px] tablet-readable calc-stage lg:max-w-none">
          {children}
        </div>

        <div className="hidden min-w-0 lg:block">
          {sidebar ? (
            <aside aria-label="Terms and how this tool works">
              <div className="sticky top-24 space-y-4">{sidebar}</div>
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
}
