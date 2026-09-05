import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { InfoPageShell, InfoSection } from "@/components/InfoPageShell";
import { SITE_NAME, SITE_SUPPORT_EMAIL } from "@/lib/calculators";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { SITE_AUTHOR } from "@/lib/siteIdentity";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact Us",
  description: `Contact ${SITE_AUTHOR.name} at ${SITE_NAME} — email ${SITE_SUPPORT_EMAIL} for tool feedback, privacy requests, and corrections.`,
  path: "/contact",
  keywords: ["contact CalculioHub", "support", SITE_SUPPORT_EMAIL, SITE_NAME],
});

export default function ContactPage() {
  return (
    <InfoPageShell
      eyebrow="Support"
      title="Contact Us"
      description={`${SITE_NAME} is run by ${SITE_AUTHOR.name}. Questions, formula corrections, privacy requests, and tool ideas all go to the same inbox—real messages get read.`}
    >
      <InfoSection title="Who you are writing to">
        <p>
          {SITE_AUTHOR.name} ({SITE_AUTHOR.role}) builds and maintains{" "}
          {SITE_NAME}. There is no ticket farm in between. For fastest help,
          include the tool URL and what you expected versus what you saw.
        </p>
      </InfoSection>

      <InfoSection title="Email">
        <p>
          Write to{" "}
          <a
            href={`mailto:${SITE_SUPPORT_EMAIL}`}
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            {SITE_SUPPORT_EMAIL}
          </a>
          . Typical reply window is a few business days.
        </p>
      </InfoSection>

      <div>
        <h2 className="mb-3 font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-[var(--foreground)]">
          Send a message
        </h2>
        <ContactForm />
      </div>

      <InfoSection title="Before you write">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Tool results are planning estimates—see{" "}
            <Link
              href="/terms"
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and the{" "}
            <Link
              href="/disclaimer"
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Disclaimer
            </Link>
            .
          </li>
          <li>
            Privacy and cookies:{" "}
            <Link
              href="/privacy"
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </li>
          <li>
            Prefer a walkthrough first? Browse{" "}
            <Link
              href="/guides"
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              Guides
            </Link>{" "}
            or{" "}
            <Link
              href="/about"
              className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            >
              About
            </Link>
            .
          </li>
        </ul>
      </InfoSection>
    </InfoPageShell>
  );
}
