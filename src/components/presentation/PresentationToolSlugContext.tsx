"use client";

import { createContext, useContext, type ReactNode } from "react";

const PresentationToolSlugContext = createContext<string | null>(null);

export function PresentationToolSlugProvider({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  return (
    <PresentationToolSlugContext.Provider value={slug}>
      {children}
    </PresentationToolSlugContext.Provider>
  );
}

export function usePresentationToolSlug(
  fallback?: string
): string | undefined {
  const ctx = useContext(PresentationToolSlugContext);
  return ctx || fallback;
}
