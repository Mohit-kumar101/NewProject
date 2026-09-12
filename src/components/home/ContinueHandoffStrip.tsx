"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCalculatorBySlug } from "@/lib/calculators";
import {
  clearLastHandoff,
  readLastHandoff,
  type LastHandoff,
} from "@/lib/handoffs";

export function ContinueHandoffStrip() {
  const [item, setItem] = useState<LastHandoff | null>(null);
  const [fromTitle, setFromTitle] = useState<string>("");

  useEffect(() => {
    const last = readLastHandoff();
    if (!last) return;
    setItem(last);
    const tool = getCalculatorBySlug(last.fromSlug);
    setFromTitle(tool?.title ?? "your last calculator");
  }, []);

  if (!item) return null;

  return (
    <section className="border-b border-[var(--border)] bg-[var(--surface)]/50 py-6">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 sm:px-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
            Continue where you left off
          </p>
          <p className="mt-1 text-sm text-[var(--foreground)]">
            {item.question}{" "}
            <span className="text-[var(--muted)]">
              — from {fromTitle}, carrying {item.carried}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={item.href}
            className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#041018]"
          >
            Open with my numbers
          </Link>
          <button
            type="button"
            onClick={() => {
              clearLastHandoff();
              setItem(null);
            }}
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)]"
          >
            Dismiss
          </button>
        </div>
      </div>
    </section>
  );
}
