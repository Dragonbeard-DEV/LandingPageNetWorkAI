// Single source for brand, navigation, contact and locale settings.
// Labels are message keys (messages/<locale>.json -> "nav"), never display text.

export const locales = ["en", "vi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type NavLink = { key: string; href: string };
export type NavItem =
  | (NavLink & { kind: "link" })
  | { kind: "group"; key: string; children: NavLink[] }
  | { kind: "segments"; key: string; href: string };

export const siteConfig = {
  name: "NetworkAI",
  legalName: "[Company legal name]",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  logo: {
    full: "/images/brand/networkai-logo-full.png",
    icon: "/images/brand/networkai-logo-icon.png",
    wordmark: "/images/brand/networkai-logo-wordmark.png",
  },
  contact: {
    email: "sales@networkai.vn",
    // Placeholder values: replace with the real office address and phone number.
    phone: "+84 (0)00 000 0000",
    address: "[Street address], [District], [City], Vietnam",
  },
  social: [
    { key: "linkedin", href: "https://www.linkedin.com/" },
    { key: "facebook", href: "https://www.facebook.com/" },
    { key: "youtube", href: "https://www.youtube.com/" },
  ],
  nav: [
    { kind: "link", key: "home", href: "/" },
    {
      kind: "group",
      key: "company",
      children: [
        { key: "about", href: "/about" },
        { key: "partners", href: "/partners" },
        { key: "news", href: "/news" },
        { key: "jobs", href: "/jobs" },
      ],
    },
    { kind: "segments", key: "segments", href: "/segments" },
    { kind: "link", key: "solutions", href: "/solutions" },
    { kind: "link", key: "projects", href: "/projects" },
    { kind: "link", key: "contact", href: "/contact" },
  ] satisfies NavItem[],
  footer: {
    main: [
      { key: "solutions", href: "/solutions" },
      { key: "segments", href: "/segments" },
      { key: "projects", href: "/projects" },
      { key: "contact", href: "/contact" },
    ],
    company: [
      { key: "about", href: "/about" },
      { key: "partners", href: "/partners" },
      { key: "news", href: "/news" },
      { key: "jobs", href: "/jobs" },
    ],
    legal: [
      { key: "privacy", href: "/privacy-policy" },
      { key: "cookies", href: "/cookies" },
      { key: "sitemap", href: "/sitemap" },
    ],
  },
} as const;
