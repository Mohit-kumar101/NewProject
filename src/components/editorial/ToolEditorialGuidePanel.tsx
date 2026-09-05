import Link from "next/link";
import { AuthorByline } from "@/components/AuthorByline";
import type { ToolEditorialGuide } from "@/lib/editorial/toolGuides";

export function ToolEditorialGuidePanel({
  guide,
  toolTitle,
}: {
  guide: ToolEditorialGuide;
  toolTitle: string;
}) {
  return (
    <section
      className="mt-16 max-w-3xl space-y-8"
      aria-labelledby="editorial-guide-heading"
    >
      <div>
        <p className="mb-2 text-xs font-semibold tracking-[0.16em] text-[var(--accent)] uppercase">
          Practical guide
        </p>
        <h2
          id="editorial-guide-heading"
          className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight"
        >
          Using the {toolTitle} well
        </h2>
        <AuthorByline compact dateLabel="Editorial · 2026" />
      </div>

      <div className="space-y-3">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
          Who this is for
        </h3>
        <p className="text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-base">
          {guide.whoItsFor}
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
          Worked example
        </h3>
        <p className="text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-base">
          {guide.workedExample}
        </p>
      </div>

      {guide.sections.map((section) => (
        <div key={section.heading} className="space-y-3">
          <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
            {section.heading}
          </h3>
          <p className="text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-base">
            {section.body}
          </p>
        </div>
      ))}

      <div className="space-y-3">
        <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight">
          Common pitfalls
        </h3>
        <ul className="space-y-2.5">
          {guide.pitfalls.map((item) => (
            <li
              key={item}
              className="flex gap-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_75%,var(--muted))] sm:text-base"
            >
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                aria-hidden
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {guide.relatedGuideSlug ? (
        <p className="text-sm text-[var(--muted)]">
          Deeper read:{" "}
          <Link
            href={`/guides/${guide.relatedGuideSlug}`}
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            open the full guide
          </Link>
          .
        </p>
      ) : null}
    </section>
  );
}
