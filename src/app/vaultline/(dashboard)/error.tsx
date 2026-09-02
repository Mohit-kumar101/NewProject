"use client";

import Link from "next/link";

export default function VaultlineError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
        Vaultline
      </p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-2xl font-bold">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        {error.message || "We could not load this page. Try again."}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#041018]"
        >
          Try again
        </button>
        <Link
          href="/vaultline"
          className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
