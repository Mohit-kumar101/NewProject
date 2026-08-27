/**
 * Optional affiliate / partner CTA.
 * Set NEXT_PUBLIC_AFFILIATE_* env vars to activate — empty = hidden.
 */

const FITNESS_URL = process.env.NEXT_PUBLIC_AFFILIATE_FITNESS_URL?.trim();
const FITNESS_LABEL =
  process.env.NEXT_PUBLIC_AFFILIATE_FITNESS_LABEL?.trim() ||
  "Recommended fitness partner";
const MONEY_URL = process.env.NEXT_PUBLIC_AFFILIATE_MONEY_URL?.trim();
const MONEY_LABEL =
  process.env.NEXT_PUBLIC_AFFILIATE_MONEY_LABEL?.trim() ||
  "Recommended money partner";

export function AffiliateSlot({
  cluster,
}: {
  cluster: "fitness" | "money" | "generic";
}) {
  const url =
    cluster === "fitness"
      ? FITNESS_URL
      : cluster === "money"
        ? MONEY_URL
        : FITNESS_URL || MONEY_URL;
  const label =
    cluster === "fitness"
      ? FITNESS_LABEL
      : cluster === "money"
        ? MONEY_LABEL
        : FITNESS_LABEL;

  if (!url) return null;

  return (
    <aside className="mt-8 max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
      <p className="text-[11px] font-semibold tracking-[0.14em] text-[var(--muted)] uppercase">
        Partner offer
      </p>
      <p className="mt-1 text-sm text-[var(--foreground)]">
        {label}{" "}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="font-semibold text-[var(--accent)] hover:underline"
        >
          Learn more →
        </a>
      </p>
      <p className="mt-2 text-[11px] text-[var(--muted)]">
        We may earn a commission at no extra cost to you. Calculators stay free.
      </p>
    </aside>
  );
}
