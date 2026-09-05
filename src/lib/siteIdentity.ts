import { SITE_NAME, SITE_SUPPORT_EMAIL, SITE_URL } from "@/lib/calculators";

/** Public operator identity for E-E-A-T / AdSense trust signals. */
export const SITE_AUTHOR = {
  name: "Mohit",
  role: "Founder & builder",
  shortBio:
    "Independent maker focused on clear, private browser tools for money planning, fitness macros, and everyday file conversion.",
  longBio:
    "Mohit designs and ships CalculioHub as a practical alternative to gated converter sites and opaque calculators. He prioritizes readable formulas, private in-browser processing, and guides that explain when a number is useful—and when it is not.",
  email: SITE_SUPPORT_EMAIL,
  sameAs: [] as string[],
} as const;

export const SITE_PUBLISHER = {
  name: SITE_NAME,
  url: SITE_URL,
  foundingDate: "2025",
  description:
    "Free planners and converters with transparent formulas, worked examples, and editorial guides—no subscription wall.",
} as const;

export function personSchema() {
  return {
    "@type": "Person",
    name: SITE_AUTHOR.name,
    jobTitle: SITE_AUTHOR.role,
    description: SITE_AUTHOR.shortBio,
    email: SITE_AUTHOR.email,
    url: `${SITE_URL}/about`,
    worksFor: {
      "@type": "Organization",
      name: SITE_PUBLISHER.name,
      url: SITE_PUBLISHER.url,
    },
  };
}
