import type { ReactNode } from "react";

/**
 * Shared chrome for all /tools routes.
 * Individual tool pages still own their content via ToolPageShell.
 */
export default function ToolsLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-[70vh]">{children}</div>;
}
