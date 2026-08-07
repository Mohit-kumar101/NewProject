import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalculatorWorkspace } from "@/components/CalculatorWorkspace";
import { FaqAccordion } from "@/components/FaqAccordion";
import { JsonLd } from "@/components/JsonLd";
import { ReviewSection } from "@/components/ReviewSection";
import { SuggestionBox } from "@/components/SuggestionBox";
import {
  SITE_NAME,
  SITE_URL,
  calculators,
  getCalculatorBySlug,
  getRelatedCalculators,
} from "@/lib/calculators";

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

  const isScientific = calculator.slug === "scientific-calculator";
  const pageTitle = isScientific
    ? "Free Online Scientific Calculator"
    : `${calculator.title} - Free Online Calculator`;
  const absoluteTitle = `${pageTitle} | ${SITE_NAME}`;
  const description = isScientific
    ? "Use our advanced online scientific calculator with trigonometric, logarithmic, exponential functions, degree/radian modes, and calculation history."
    : calculator.description.endsWith(".")
      ? `${calculator.description} Free, instant results—no signup required.`
      : `${calculator.description}. Free, instant results—no signup required.`;
  const url = `${SITE_URL}/tools/${calculator.slug}`;

  return {
    title: pageTitle,
    description,
    keywords: isScientific
      ? [
          "scientific calculator",
          "online scientific calculator",
          "trigonometry calculator",
          "logarithm calculator",
          "degree radian calculator",
          "CalculioHub",
        ]
      : [
          calculator.title,
          `${calculator.title} online`,
          `free ${calculator.title.toLowerCase()}`,
          calculator.category,
          "CalculioHub",
          "online calculator",
        ],
    alternates: { canonical: url },
    openGraph: {
      title: absoluteTitle,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);
  if (!calculator) notFound();

  const related = getRelatedCalculators(calculator, 6);
  const toolUrl = `${SITE_URL}/tools/${calculator.slug}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <JsonLd calculator={calculator} />

      <nav className="mb-6 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--accent)]">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--foreground)]">{calculator.title}</span>
      </nav>

      <header className="mb-10 max-w-3xl">
        <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-[var(--accent)] uppercase">
          {calculator.category}
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
          {calculator.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          {calculator.seoContent.intro}
        </p>
      </header>

      <CalculatorWorkspace calculator={calculator} related={related} />

      <section className="mt-16 max-w-3xl">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          How to Use
        </h2>
        <ol className="mt-5 space-y-3">
          {calculator.seoContent.howToUse.map((step, index) => (
            <li
              key={step}
              className="flex gap-3 text-sm leading-relaxed text-[var(--muted)] sm:text-base"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#00E5FF] to-[#2979FF] text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {calculator.slug === "scientific-calculator" && (
        <section className="mt-16 max-w-3xl space-y-5 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--foreground)]">
            Scientific Functions Explained
          </h2>
          <p>
            Trigonometric keys evaluate sine, cosine, and tangent of the current
            angle. Enable <span className="font-medium text-[var(--foreground)]">Inv</span>{" "}
            for arcsine, arccosine, and arctangent. Always match the{" "}
            <span className="font-medium text-[var(--foreground)]">Degrees °</span>{" "}
            or{" "}
            <span className="font-medium text-[var(--foreground)]">Radians</span>{" "}
            toggle to the unit used in your problem—mixing them is the most
            common source of trig errors.
          </p>
          <p>
            Logarithmic work uses{" "}
            <span className="font-medium text-[var(--foreground)]">ln</span> for
            natural log (base <span className="font-medium text-[var(--foreground)]">e</span>)
            and{" "}
            <span className="font-medium text-[var(--foreground)]">log</span> for
            common log (base 10), with{" "}
            <span className="font-medium text-[var(--foreground)]">eˣ</span> and{" "}
            <span className="font-medium text-[var(--foreground)]">10ˣ</span> as
            the inverse exponential operations. Powers, roots, factorial, π, and{" "}
            e cover the rest of a standard scientific workflow.
          </p>
        </section>
      )}

      <section className="mt-16 max-w-3xl">
        <h2 className="mb-5 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          Frequently Asked Questions
        </h2>
        <FaqAccordion faqs={calculator.seoContent.faqs} />
      </section>

      <div className="mx-auto mt-4 max-w-3xl">
        <ReviewSection toolTitle={calculator.title} toolUrl={toolUrl} />
        <SuggestionBox toolTitle={calculator.title} toolUrl={toolUrl} />
      </div>
    </div>
  );
}
