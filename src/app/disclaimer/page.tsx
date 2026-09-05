import type { Metadata } from "next";
import Link from "next/link";
import { InfoPageShell, InfoSection } from "@/components/InfoPageShell";
import { SITE_NAME, SITE_SUPPORT_EMAIL } from "@/lib/calculators";
import { buildPageMetadata } from "@/lib/pageMetadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Disclaimer",
  description: `Disclaimer for ${SITE_NAME} — planning estimates only; not professional financial, tax, medical, or legal advice.`,
  path: "/disclaimer",
  keywords: ["disclaimer", "calculators not advice", SITE_NAME],
});

export default function DisclaimerPage() {
  return (
    <InfoPageShell
      eyebrow="Legal"
      title="Disclaimer"
      description={`${SITE_NAME} provides free calculators, converters, and educational guides for planning and learning. Outputs are estimates—not professional advice.`}
      updated="September 5, 2026"
    >
      <InfoSection title="General">
        <p>
          Tools on {SITE_NAME} are designed for education and personal planning.
          Results depend on the inputs you enter and simplified models. They may
          not match bank quotes, tax software, payroll systems, or clinical
          guidance.
        </p>
      </InfoSection>

      <InfoSection title="Not professional advice">
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-[var(--foreground)]">
              Finance & investing:
            </span>{" "}
            not investment, lending, or accounting advice.
          </li>
          <li>
            <span className="font-medium text-[var(--foreground)]">Tax:</span>{" "}
            not a substitute for a tax professional or filing software.
          </li>
          <li>
            <span className="font-medium text-[var(--foreground)]">
              Health & fitness:
            </span>{" "}
            not medical diagnosis or treatment advice.
          </li>
          <li>
            <span className="font-medium text-[var(--foreground)]">Legal:</span>{" "}
            not legal counsel for contracts, employment, or compliance.
          </li>
        </ul>
      </InfoSection>

      <InfoSection title="File converters">
        <p>
          Conversions run in your browser when possible. Always keep originals
          and verify output quality before deleting source files. We do not
          guarantee lossless results for every codec, container, or device.
        </p>
      </InfoSection>

      <InfoSection title="Accuracy & updates">
        <p>
          Formulas and rates change. Tax brackets, interest conventions, and
          product rules can differ by jurisdiction and over time. Cross-check
          important decisions with primary sources or a qualified professional.
        </p>
      </InfoSection>

      <InfoSection title="Contact">
        <p>
          Questions about this disclaimer:{" "}
          <a
            href={`mailto:${SITE_SUPPORT_EMAIL}`}
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            {SITE_SUPPORT_EMAIL}
          </a>{" "}
          or the{" "}
          <Link
            href="/contact"
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            Contact page
          </Link>
          .
        </p>
      </InfoSection>
    </InfoPageShell>
  );
}
