import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageShell, InfoSection } from "@/components/InfoPageShell";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${SITE_NAME} — the free alternative to paid PDF, video, and image converters, plus fast transparent calculators. Built by Mohit.`,
  alternates: { canonical: `${SITE_URL}/about` },
};

export default function AboutPage() {
  return (
    <InfoPageShell
      eyebrow="Company"
      title="About CalculioHub"
      description={`${SITE_NAME} was designed and built by Mohit as the free alternative to paid converters and cluttered calculator sites — fast, private, and no gated signups.`}
    >
      <InfoSection title="Our mission">
        <p>
          Paid converters and cluttered calculator sites bury useful work behind
          subscriptions, watermarks, and uploads. {SITE_NAME} is the free
          alternative: clear inputs, instant results, readable formulas, and
          private in-browser tools that work in light and dark mode.
        </p>
        <p>
          Whether you are modeling a loan, checking a GPA, solving a scientific
          expression, or tracking personal expenses, the goal is the same—
          <span className="font-medium text-[var(--foreground)]">
            {" "}
            trustworthy utilities you can understand and reuse
          </span>
          .
        </p>
      </InfoSection>

      <InfoSection title="Built by Mohit">
        <p>
          {SITE_NAME} is designed and built by{" "}
          <span className="font-medium text-[var(--foreground)]">Mohit</span>, an
          independent maker focused on practical web tools. From architecture and
          formula transparency to accessibility and AdSense-ready publishing
          standards, the platform is crafted to stay useful as the tool library
          grows.
        </p>
      </InfoSection>

      <InfoSection title="What we stand for">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-[var(--foreground)]">Speed:</span>{" "}
            calculations run in your browser for instant feedback.
          </li>
          <li>
            <span className="font-medium text-[var(--foreground)]">Transparency:</span>{" "}
            formula explanations and variable definitions on tool pages.
          </li>
          <li>
            <span className="font-medium text-[var(--foreground)]">Clarity:</span>{" "}
            modern layout, cyan-to-blue accents, and full dark/light support.
          </li>
          <li>
            <span className="font-medium text-[var(--foreground)]">Free:</span>{" "}
            no subscriptions, watermarks, or daily caps — a real alternative to
            paid converters.
          </li>
          <li>
            <span className="font-medium text-[var(--foreground)]">Respect:</span>{" "}
            no mandatory account; files stay in your browser.
          </li>
        </ul>
      </InfoSection>

      <InfoSection title="Who it’s for">
        <p>
          Anyone leaving a paid PDF, video, or image converter — plus developers
          checking math, students studying formulas, freelancers planning rates,
          and homeowners comparing loans. One free hub instead of a stack of
          subscriptions.
        </p>
      </InfoSection>

      <InfoSection title="Get in touch">
        <p>
          Feedback and ideas help shape what we build next. Visit the{" "}
          <Link
            href="/contact"
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            Contact page
          </Link>{" "}
          or explore the full library on{" "}
          <Link
            href="/tools"
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            All Tools
          </Link>
          .
        </p>
      </InfoSection>
    </InfoPageShell>
  );
}
