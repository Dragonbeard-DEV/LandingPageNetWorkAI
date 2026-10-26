import type { MetadataRoute } from "next";
import { listSlugs, type ContentType } from "@/lib/content";
import { absoluteUrl, localizedPath } from "@/lib/seo/metadata";
import { defaultLocale, locales } from "@/site.config";

const STATIC_PATHS = ["/", "/about", "/partners", "/news", "/jobs", "/segments", "/solutions", "/projects", "/contact", "/privacy-policy", "/cookies", "/sitemap"];
const DETAIL_TYPES: ContentType[] = ["solutions", "projects", "segments", "news", "jobs"];

/** sitemap.xml with every localized URL and its hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...STATIC_PATHS, ...DETAIL_TYPES.flatMap((type) => listSlugs(type).map((slug) => `/${type}/${slug}`))];

  return paths.flatMap((path) => {
    const languages = Object.fromEntries([
      ...locales.map((locale) => [locale, absoluteUrl(localizedPath(locale, path))]),
      ["x-default", absoluteUrl(localizedPath(defaultLocale, path))],
    ]);
    return locales.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, path)),
      changeFrequency: path === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "/" ? 1 : 0.7,
      alternates: { languages },
    }));
  });
}
