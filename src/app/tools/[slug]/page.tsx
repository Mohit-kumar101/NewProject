import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorWorkspace } from "@/components/CalculatorWorkspace";
import { ToolPageShell } from "@/components/ToolPageShell";
import {
  calculators,
  getCalculatorBySlug,
  getRelatedCalculators,
} from "@/lib/calculators";
import { buildToolMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return calculators.map((calculator) => ({ slug: calculator.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);
  if (!calculator) {
    return { title: "Calculator Not Found" };
  }
  return buildToolMetadata(calculator);
}

function ScientificGuide() {
  return (
    <section className="mt-16 max-w-3xl space-y-5 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--foreground)]">
        Scientific Functions Explained
      </h2>
      <p>
        Trigonometric keys evaluate sine, cosine, and tangent of the current
        angle. Enable{" "}
        <span className="font-medium text-[var(--foreground)]">Inv</span> for
        arcsine, arccosine, and arctangent. Always match the{" "}
        <span className="font-medium text-[var(--foreground)]">Degrees °</span>{" "}
        or{" "}
        <span className="font-medium text-[var(--foreground)]">Radians</span>{" "}
        toggle to the unit used in your problem—mixing them is the most common
        source of trig errors.
      </p>
      <p>
        Logarithmic work uses{" "}
        <span className="font-medium text-[var(--foreground)]">ln</span> for the
        natural log (base{" "}
        <span className="font-medium text-[var(--foreground)]">e</span>) and{" "}
        <span className="font-medium text-[var(--foreground)]">log</span> for
        common log (base 10), with{" "}
        <span className="font-medium text-[var(--foreground)]">eˣ</span> and{" "}
        <span className="font-medium text-[var(--foreground)]">10ˣ</span> as the
        inverse exponential operations. Powers, roots, factorial, π, and e cover
        the rest of a standard scientific workflow.
      </p>
    </section>
  );
}

function NutritionGuide() {
  return (
    <section className="mt-16 max-w-3xl space-y-5 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
      <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--foreground)]">
        How Calorie & Macro Targets Are Estimated
      </h2>
      <p>
        This tool estimates resting metabolism with the Mifflin–St Jeor equation,
        then multiplies by your activity factor to approximate Total Daily Energy
        Expenditure (TDEE). Goal adjustments shift calories for fat loss,
        maintenance, or muscle gain, and macros are split using practical
        protein-forward targets.
      </p>
      <p>
        Results are planning estimates—not medical advice. Athletes, pregnancy,
        clinical conditions, and body-composition goals may need personalized
        guidance from a qualified professional.
      </p>
    </section>
  );
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);
  if (!calculator) notFound();

  const related = getRelatedCalculators(calculator, 6);

  const guideExtra =
    calculator.slug === "scientific-calculator" ? (
      <ScientificGuide />
    ) : calculator.slug === "ai-nutrition-calorie-calculator" ? (
      <NutritionGuide />
    ) : null;

  return (
    <ToolPageShell
      calculator={calculator}
      workspace={
        <CalculatorWorkspace calculator={calculator} related={related} />
      }
      guideExtra={guideExtra}
    />
  );
}
