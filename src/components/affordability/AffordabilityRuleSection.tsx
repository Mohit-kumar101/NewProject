import {
  getRuleExplainer,
  type AffordabilityRuleSet,
} from "@/lib/formulas_affordability";

export function AffordabilityRuleSection({
  ruleSet,
}: {
  ruleSet: AffordabilityRuleSet;
}) {
  const rule = getRuleExplainer(ruleSet);

  return (
    <section className="mt-16 max-w-3xl space-y-4">
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
        {rule.title}
      </h2>
      <p className="text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))] sm:text-base">
        {rule.summary}
      </p>
      <ul className="space-y-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-4 sm:px-5">
        {rule.bullets.map((bullet) => (
          <li
            key={bullet}
            className="flex gap-3 text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_78%,var(--muted))]"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
