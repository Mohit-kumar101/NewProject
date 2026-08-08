import type { Metadata } from "next";
import { InfoPageShell, InfoSection } from "@/components/InfoPageShell";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${SITE_NAME} — acceptable use, calculation disclaimers, and platform rules.`,
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <InfoPageShell
      eyebrow="Legal"
      title="Terms of Service"
      description={`These Terms govern your use of ${SITE_NAME}. By accessing or using our calculators and utilities, you agree to these Terms.`}
      updated="August 8, 2026"
    >
      <InfoSection title="Agreement to terms">
        <p>
          Welcome to {SITE_NAME} ({SITE_URL}). By using this website, you agree to
          these Terms of Service and our{" "}
          <a href="/privacy" className="font-medium text-[var(--accent)] underline-offset-2 hover:underline">
            Privacy Policy
          </a>
          . If you do not agree, please do not use the site.
        </p>
      </InfoSection>

      <InfoSection title="Description of service">
        <p>
          {SITE_NAME} provides free online calculators and utility tools for
          education, planning, and general informational purposes. Features may
          change, expand, or be discontinued at any time without notice.
        </p>
      </InfoSection>

      <InfoSection title="No professional advice — calculation disclaimer">
        <p>
          <span className="font-medium text-[var(--foreground)]">
            All results are estimates for informational and educational use only.
          </span>{" "}
          They are not financial, legal, tax, medical, accounting, engineering, or
          other professional advice. Always verify critical figures independently
          and consult a qualified professional before making decisions based on
          calculator output.
        </p>
        <p>
          While we strive for accuracy, formulas, rounding, assumptions, and
          browser floating-point arithmetic can produce imperfect results.{" "}
          {SITE_NAME} and its operator are not liable for decisions, losses, or
          damages arising from reliance on tool outputs.
        </p>
      </InfoSection>

      <InfoSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Use the site for unlawful, harmful, or abusive purposes</li>
          <li>Attempt to disrupt, scrape excessively, or overload our services</li>
          <li>Interfere with security, ads, or other users’ access</li>
          <li>Misrepresent affiliation with {SITE_NAME} or its operator</li>
          <li>Submit spam, malware, or harassing content via contact forms</li>
        </ul>
        <p>
          We may suspend or block access for conduct that violates these Terms or
          harms the platform.
        </p>
      </InfoSection>

      <InfoSection title="Intellectual property">
        <p>
          The {SITE_NAME} name, branding, layout, and original content are owned by
          the site operator unless otherwise noted. You may use the tools for
          personal or internal business planning. You may not copy, resell, or
          redistribute substantial portions of the site or its branding without
          permission.
        </p>
      </InfoSection>

      <InfoSection title="User submissions">
        <p>
          If you send reviews, suggestions, or contact messages, you grant us a
          non-exclusive right to use that feedback to operate and improve
          {SITE_NAME}. Do not submit confidential or sensitive personal data you
          do not want processed for support purposes.
        </p>
      </InfoSection>

      <InfoSection title="Third-party services & advertising">
        <p>
          The site may display advertisements and use third-party services
          (including Google). Those parties have their own terms and privacy
          policies. We are not responsible for third-party sites or services linked
          from {SITE_NAME}.
        </p>
      </InfoSection>

      <InfoSection title="Disclaimer of warranties">
        <p>
          The site and tools are provided “as is” and “as available,” without
          warranties of any kind, express or implied, including merchantability,
          fitness for a particular purpose, and non-infringement. We do not
          warrant uninterrupted or error-free operation.
        </p>
      </InfoSection>

      <InfoSection title="Limitation of liability">
        <p>
          To the fullest extent permitted by law, {SITE_NAME} and its operator
          shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages, or any loss of profits or data,
          arising from your use of the site or reliance on any calculation or
          content.
        </p>
      </InfoSection>

      <InfoSection title="Changes to these terms">
        <p>
          We may update these Terms periodically. The “Last updated” date will
          reflect changes. Continued use after updates means you accept the
          revised Terms.
        </p>
      </InfoSection>

      <InfoSection title="Contact">
        <p>
          Questions about these Terms? Reach us on the{" "}
          <a href="/contact" className="font-medium text-[var(--accent)] underline-offset-2 hover:underline">
            Contact page
          </a>{" "}
          or at{" "}
          <a
            href="mailto:hello@calculiohub.com"
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            hello@calculiohub.com
          </a>
          .
        </p>
      </InfoSection>
    </InfoPageShell>
  );
}
