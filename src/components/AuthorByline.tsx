import Link from "next/link";
import { SITE_AUTHOR } from "@/lib/siteIdentity";

export function AuthorByline({
  dateLabel,
  compact = false,
}: {
  dateLabel?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--muted)]"
          : "mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-[var(--border)] pt-4 text-sm text-[var(--muted)]"
      }
    >
      <span>
        By{" "}
        <Link
          href="/about"
          className="font-medium text-[var(--foreground)] underline-offset-2 hover:text-[var(--accent)] hover:underline"
        >
          {SITE_AUTHOR.name}
        </Link>
        <span className="text-[var(--muted)]"> · {SITE_AUTHOR.role}</span>
      </span>
      {dateLabel ? <span aria-hidden>·</span> : null}
      {dateLabel ? <time>{dateLabel}</time> : null}
    </div>
  );
}
