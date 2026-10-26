import { siteConfig } from "@/site.config";
import { absoluteUrl } from "./metadata";

/** schema.org Organization for the home page. */
export function organizationJsonLd(description: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logo.icon),
    description,
    email: siteConfig.contact.email,
    telephone: siteConfig.contact.phone,
    address: { "@type": "PostalAddress", streetAddress: siteConfig.contact.address, addressCountry: "VN" },
    sameAs: siteConfig.social.map((item) => item.href),
  };
}

/** Serializes JSON-LD for a <script> tag; escapes "<" so the data cannot close the tag. */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
