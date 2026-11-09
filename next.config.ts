import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

// Canonical URLs, hreflang, sitemap.xml and Open Graph all use this origin; warn loudly when it is missing.
if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn("⚠ NEXT_PUBLIC_SITE_URL is not set: canonical URLs and sitemap.xml will point to https://www.networkai.vn.");
}

const nextConfig: NextConfig = {
  images: {
    // 60 is used for the hero background (under a dark overlay), 75 everywhere else.
    qualities: [60, 75],
  },
  // Keeps temporary test deployments out of search engines; leave SITE_NOINDEX unset on the real site.
  async headers() {
    if (process.env.SITE_NOINDEX !== "true") return [];
    return [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
