import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { InfoPageShell, InfoSection } from "@/components/InfoPageShell";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${SITE_NAME} — send a message or email support for questions, feedback, and privacy requests.`,
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <InfoPageShell
      eyebrow="Support"
      title="Contact Us"
      description={`Have a question, privacy request, partnership idea, or tool suggestion? Reach the ${SITE_NAME} team directly—real humans read every message.`}
    >
      <InfoSection title="Email">
        <p>
          Prefer email? Write to{" "}
          <a
            href="mailto:hello@calculiohub.com"
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            hello@calculiohub.com
          </a>
          . We typically respond within a few business days.
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
            Tool results are estimates—see our{" "}
            <a href="/terms" className="font-medium text-[var(--accent)] underline-offset-2 hover:underline">
              Terms of Service
            </a>{" "}
            for calculation disclaimers.
          </li>
          <li>
            Privacy and cookie questions are covered in our{" "}
            <a href="/privacy" className="font-medium text-[var(--accent)] underline-offset-2 hover:underline">
              Privacy Policy
            </a>
            .
          </li>
          <li>
            For product ideas on a specific calculator, you can also use the
            suggestion box on that tool’s page.
          </li>
        </ul>
      </InfoSection>
    </InfoPageShell>
  );
}
