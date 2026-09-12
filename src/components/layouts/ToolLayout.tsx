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
      className={`w-full overflow-x-clip px-4 py-6 sm:px-6 sm:py-8 ${className}`}
    >
      <div
        className={`mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:gap-8 ${
          sidebar ? "lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start" : ""
        }`}
      >
        <div className="mx-auto w-full min-w-0 max-w-3xl tablet-readable calc-stage lg:max-w-none">
          {children}
        </div>

        {sidebar ? (
          <div className="hidden min-w-0 lg:block">
            <aside aria-label="Terms and how this tool works">
              <div className="sticky top-24 space-y-4">{sidebar}</div>
            </aside>
          </div>
        ) : null}
      </div>
    </div>
  );
}
