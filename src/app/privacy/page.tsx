import type { Metadata } from "next";
import { InfoPageShell, InfoSection } from "@/components/InfoPageShell";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${SITE_NAME} — how we handle data, cookies, and advertising partners including Google.`,
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <InfoPageShell
      eyebrow="Legal"
      title="Privacy Policy"
      description={`${SITE_NAME} respects your privacy. This policy explains what information we collect, how it is used, and your choices—including disclosures required for advertising partners such as Google.`}
      updated="August 8, 2026"
    >
      <InfoSection title="Who we are">
        <p>
          {SITE_NAME} ({SITE_URL}) is an online calculator and utility platform
          operated by Mohit. This Privacy Policy applies to visitors and users of
          our website and tools.
        </p>
      </InfoSection>

      <InfoSection title="Information we collect">
        <p>We may collect the following categories of information:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <span className="font-medium text-[var(--foreground)]">Usage data:</span>{" "}
            pages viewed, tools used, approximate device/browser information, and
            general analytics needed to improve performance and content.
          </li>
          <li>
            <span className="font-medium text-[var(--foreground)]">Contact data:</span>{" "}
            name, email address, and message content when you submit a contact,
            review, or suggestion form.
          </li>
          <li>
            <span className="font-medium text-[var(--foreground)]">Local device data:</span>{" "}
            some tools (for example, the Personal Expense Tracker) store data only
            in your browser via localStorage and do not upload that ledger to our
            servers.
          </li>
          <li>
            <span className="font-medium text-[var(--foreground)]">Cookies and similar technologies:</span>{" "}
            used for site preferences (such as theme), analytics, and advertising
            as described below.
          </li>
        </ul>
      </InfoSection>

      <InfoSection title="How we use information">
        <p>We use information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Operate, maintain, and improve {SITE_NAME} tools and pages</li>
          <li>Respond to support requests, reviews, and suggestions</li>
          <li>Measure traffic and understand which tools are most useful</li>
          <li>Protect against abuse and ensure platform reliability</li>
          <li>Serve and measure advertising where enabled</li>
        </ul>
      </InfoSection>

      <InfoSection title="Advertising, cookies & Google">
        <p>
          We may use third-party advertising services, including{" "}
          <span className="font-medium text-[var(--foreground)]">Google AdSense</span>{" "}
          (or similar partners), to display ads on {SITE_NAME}.
        </p>
        <p>
          <span className="font-medium text-[var(--foreground)]">
            Third-party vendors, including Google, use cookies to serve ads based
            on a user’s prior visits to this website or other websites.
          </span>{" "}
          Google’s use of advertising cookies enables it and its partners to serve
          ads to users based on their visit to {SITE_NAME} and/or other sites on
          the Internet.
        </p>
        <p>
          Users may opt out of personalized advertising by visiting{" "}
          <a
            href="https://www.google.com/settings/ads"
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Ads Settings
          </a>
          . Alternatively, you can opt out of some third-party vendors’ use of
          cookies for personalized advertising by visiting{" "}
          <a
            href="https://www.aboutads.info/choices/"
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.aboutads.info
          </a>
          .
        </p>
        <p>
          For more information about how Google uses data when you use our sites
          or apps, see{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            How Google uses information from sites or apps that use our services
          </a>
          .
        </p>
      </InfoSection>

      <InfoSection title="Analytics">
        <p>
          We may use analytics tools (which can include Google Analytics or
          similar services) to understand aggregate traffic patterns. These
          providers may set cookies or collect truncated device and usage data
          under their own privacy policies.
        </p>
      </InfoSection>

      <InfoSection title="Data sharing">
        <p>
          We do not sell your personal information. We may share limited data
          with service providers who help us operate the site (for example, email
          delivery for contact forms, hosting, analytics, and advertising
          partners), only as needed to provide those services or as required by
          law.
        </p>
      </InfoSection>

      <InfoSection title="Data retention">
        <p>
          Contact and feedback messages are retained as needed to respond and
          improve the product. Browser-local tool data remains on your device
          until you clear it. Advertising and analytics partners retain data
          according to their own policies.
        </p>
      </InfoSection>

      <InfoSection title="Your rights & choices">
        <p>Depending on your location, you may have rights to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Request access to or deletion of personal information you provided</li>
          <li>Correct inaccurate contact details</li>
          <li>Opt out of personalized advertising via the links above</li>
          <li>Control cookies through your browser settings</li>
        </ul>
        <p>
          To make a privacy request, contact us via the{" "}
          <a href="/contact" className="font-medium text-[var(--accent)] underline-offset-2 hover:underline">
            Contact
          </a>{" "}
          page.
        </p>
      </InfoSection>

      <InfoSection title="Children’s privacy">
        <p>
          {SITE_NAME} is a general-audience utility site and is not directed at
          children under 13. We do not knowingly collect personal information from
          children under 13. If you believe a child has provided personal data,
          please contact us so we can delete it.
        </p>
      </InfoSection>

      <InfoSection title="Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. The “Last updated”
          date at the top of this page will change when we do. Continued use of
          {SITE_NAME} after updates constitutes acceptance of the revised policy.
        </p>
      </InfoSection>

      <InfoSection title="Contact">
        <p>
          Questions about privacy? Visit our{" "}
          <a href="/contact" className="font-medium text-[var(--accent)] underline-offset-2 hover:underline">
            Contact page
          </a>{" "}
          or email{" "}
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
