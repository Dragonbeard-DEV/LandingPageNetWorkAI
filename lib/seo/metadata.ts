import type { Metadata } from "next";
import { defaultLocale, locales, siteConfig, type Locale } from "@/site.config";

// Generated from networkai-logo-full.png on the --brand-soft background (1200x630, Open Graph size).
export const DEFAULT_OG_IMAGE = {
  url: "/images/brand/networkai-og-default.png",
  width: 1200,
  height: 630,
};

type PageMetadataInput = {
  locale: Locale;
  /** Path without locale prefix, e.g. "/solutions/data-center" or "/" for home. */
  path: string;
  title: string;
  description: string;
  image?: { src: string; alt: string };
  type?: "website" | "article";
  /** Home uses the brand title as-is instead of the "%s | NetworkAI" template. */
  absoluteTitle?: boolean;
};

export function localizedPath(locale: Locale, path: string): string {
  return `/${locale}${path === "/" ? "" : path}`;
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

/** Canonical, hreflang alternates and Open Graph for one page. */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  image,
  type = "website",
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((code) => [code, absoluteUrl(localizedPath(code, path))]),
  );
  languages["x-default"] = absoluteUrl(localizedPath(defaultLocale, path));
  const ogImage = image ? { url: image.src, alt: image.alt } : { ...DEFAULT_OG_IMAGE, alt: siteConfig.name };

  return {
    metadataBase: new URL(siteConfig.url),
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: absoluteUrl(localizedPath(locale, path)), languages },
    openGraph: {
      type,
      siteName: siteConfig.name,
      title,
      description,
      url: absoluteUrl(localizedPath(locale, path)),
      locale: locale === "vi" ? "vi_VN" : "en_US",
      alternateLocale: locales.filter((code) => code !== locale).map((code) => (code === "vi" ? "vi_VN" : "en_US")),
      images: [ogImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage.url] },
  };
}
