"use client";

import type { ReactNode } from "react";
import { HandoffArrivalBanner } from "@/components/shared/HandoffArrivalBanner";
import { HandoffCards } from "@/components/shared/HandoffCards";

export function PlannerHandoffChrome({
  slug,
  values,
  extras,
  onClear,
  children,
}: {
  slug: string;
  values: Record<string, number>;
  extras?: Record<string, number>;
  onClear: () => void;
  children: ReactNode;
}) {
  return (
    <div className="space-y-6">
      <HandoffArrivalBanner onClear={onClear} />
      {children}
      <HandoffCards slug={slug} values={values} extras={extras} />
    </div>
  );
}
