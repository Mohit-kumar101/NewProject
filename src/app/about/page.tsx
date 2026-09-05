import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageShell, InfoSection } from "@/components/InfoPageShell";
import { SITE_NAME, SITE_SUPPORT_EMAIL, SITE_URL } from "@/lib/calculators";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { SITE_AUTHOR, personSchema } from "@/lib/siteIdentity";

export const metadata: Metadata = buildPageMetadata({
  title: "About Us",
  description: `Meet ${SITE_AUTHOR.name}, the independent maker behind ${SITE_NAME} — free planners and converters with transparent formulas and practical guides.`,
  path: "/about",
  keywords: ["about CalculioHub", "Mohit", "free converters", SITE_NAME],
});

export default function AboutPage() {
  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `About ${SITE_NAME}`,
    description: SITE_AUTHOR.shortBio,
    url: `${SITE_URL}/about`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      founder: personSchema(),
      contactPoint: {
        "@type": "ContactPoint",
        email: SITE_SUPPORT_EMAIL,
        contactType: "customer support",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <InfoPageShell
        eyebrow="About"
        title={`Built by ${SITE_AUTHOR.name}`}
        description={`${SITE_NAME} is an independent project: free money and fitness planners, everyday file converters, and written guides that explain when a result is useful—and when it is only an estimate.`}
      >
        <InfoSection title="Who runs this site">
          <p>
            {SITE_NAME} is designed, written, and maintained by{" "}
            <span className="font-medium text-[var(--foreground)]">
              {SITE_AUTHOR.name}
            </span>
            , {SITE_AUTHOR.role.toLowerCase()}. {SITE_AUTHOR.longBio}
          </p>
          <p>
            There is no anonymous content farm behind the pages. If something is
            wrong with a formula, a converter edge case, or a guide, you can
            reach a real person at{" "}
            <a
              href={`mailto:${SITE_SUPPORT_EMAIL}`}
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              {SITE_SUPPORT_EMAIL}
            </a>{" "}
            or via the{" "}
            <Link
              href="/contact"
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Contact page
            </Link>
            .
          </p>
        </InfoSection>

        <InfoSection title="What we publish">
          <p>
            The library focuses on three jobs people actually need done:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-[var(--foreground)]">
                Money & work planning
              </span>{" "}
              — emergency runway, debt payoff order, freelance true rate, SaaS
              burn, and related decision tools.
            </li>
            <li>
              <span className="font-medium text-[var(--foreground)]">
                Fitness phase planning
              </span>{" "}
              — bulk/cut macros, reverse diet, and calorie targets with clear
              caveats.
            </li>
            <li>
              <span className="font-medium text-[var(--foreground)]">
                Private-minded converters
              </span>{" "}
              — PDF, HEIC, and media tools that prefer in-browser processing so
              sensitive files are not casually uploaded.
            </li>
          </ul>
          <p>
            Alongside the tools we publish{" "}
            <Link
              href="/guides"
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              original guides
            </Link>{" "}
            with worked examples, pitfalls, and judgment calls calculators cannot
            make for you.
          </p>
        </InfoSection>

        <InfoSection title="How we think about accuracy">
          <p>
            Calculators show transparent relationships between inputs and
            outputs. They are planning aids—not tax filing software, lending
            approval, medical advice, or legal counsel. Guides and the{" "}
            <Link
              href="/disclaimer"
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Disclaimer
            </Link>{" "}
            spell out those limits. When a jurisdiction rule is simplified, we
            aim to say so on the tool page.
          </p>
        </InfoSection>

        <InfoSection title="What we stand for">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="font-medium text-[var(--foreground)]">
                Clarity:
              </span>{" "}
              readable formulas and editable inputs so you can sensitivity-test
              assumptions.
            </li>
            <li>
              <span className="font-medium text-[var(--foreground)]">
                Privacy:
              </span>{" "}
              no mandatory account for core tools; file work stays local when the
              architecture allows.
            </li>
            <li>
              <span className="font-medium text-[var(--foreground)]">
                Substance:
              </span>{" "}
              fewer hollow keyword pages; more explanations people can finish and
              use.
            </li>
            <li>
              <span className="font-medium text-[var(--foreground)]">Free:</span>{" "}
              core converters and planners without subscription walls or
              watermarks.
            </li>
          </ul>
        </InfoSection>

        <InfoSection title="Start here">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <Link
                href="/guides"
                className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              >
                Guides
              </Link>{" "}
              — editorial explainers
            </li>
            <li>
              <Link
                href="/hubs/money-milestones"
                className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              >
                Money milestones
              </Link>{" "}
              — runway and savings planners
            </li>
            <li>
              <Link
                href="/hubs/fitness-planners"
                className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              >
                Fitness planners
              </Link>{" "}
              — macros and phases
            </li>
            <li>
              <Link
                href="/tools/heic-jpg-converter"
                className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              >
                HEIC to JPG
              </Link>{" "}
              and{" "}
              <Link
                href="/tools/pdf-text-converter"
                className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
              >
                PDF ↔ text
              </Link>
            </li>
          </ul>
        </InfoSection>
      </InfoPageShell>
    </>
  );
}
