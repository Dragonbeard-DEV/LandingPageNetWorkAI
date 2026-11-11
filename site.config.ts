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
  legalName: "NetworkAI Technology Co., Ltd",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.networkai.vn",
  logo: {
    full: "/images/brand/networkai-logo-full-v2.png",
    header: "/images/brand/networkai-logo-header-v2.png",
    headerOnDark: "/images/brand/networkai-logo-header-on-dark-v2.png",
    icon: "/images/brand/networkai-logo-icon.png",
    wordmark: "/images/brand/networkai-logo-wordmark.png",
  },
  contact: {
    email: "sales@networkai.vn",
    phone: "+84 236 730 8188",
    address: "Floor 3, Kim Son Building, 18 Phan Thanh Tai, Hai Chau District, Da Nang City, Vietnam",
  },
  // No company profiles confirmed yet; add { key, href } entries and the footer column appears.
  social: [] as readonly { key: "linkedin" | "facebook" | "youtube"; href: string }[],
  nav: [
    { kind: "link", key: "home", href: "/" },
    {
      kind: "group",
      key: "services",
      children: [
        { key: "servicesAll", href: "/services" },
        { key: "serviceDesign", href: "/services/design-consultancy" },
        { key: "serviceDelivery", href: "/services/supply-installation-integration" },
        { key: "serviceSupport", href: "/services/maintenance-support" },
        { key: "serviceSmartHome", href: "/services/smart-home-design-build" },
      ],
    },
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
      { key: "services", href: "/services" },
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
