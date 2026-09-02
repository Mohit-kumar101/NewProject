"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function SavedCalculationsList({
  items,
}: {
  items: {
    id: string;
    toolSlug: string;
    toolTitle: string;
    label: string | null;
    createdAt: string;
    resultJson: string;
  }[];
}) {
  const router = useRouter();

  async function remove(id: string) {
    await fetch(`/api/vaultline/saved-calculations/${id}`, {
      method: "DELETE",
    });
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--border)] px-4 py-10 text-center text-sm text-[var(--muted)]">
        No saved calculator results yet. Use{" "}
        <strong>Save to Vaultline</strong> on any calculator while signed in.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        let primary = "";
        try {
          const result = JSON.parse(item.resultJson) as {
            primaryValue?: string;
          };
          primary = result.primaryValue ?? "";
        } catch {
          primary = "";
        }
        return (
          <li
            key={item.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="font-semibold break-words-safe">
                  {item.label || item.toolTitle}
                </p>
                {primary ? (
                  <p className="mt-1 text-lg font-bold text-[var(--accent)]">
                    {primary}
                  </p>
                ) : null}
                <p className="mt-1 text-xs text-[var(--muted)]">
                  Saved {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Link
                  href={`/tools/${item.toolSlug}`}
                  className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm font-medium hover:border-[var(--accent)]"
                >
                  Open tool
                </Link>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="rounded-lg px-3 py-1.5 text-sm text-[var(--muted)] hover:text-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
