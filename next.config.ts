import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

// Canonical URLs, hreflang, sitemap.xml and Open Graph all use this origin; warn loudly when it is missing.
if (process.env.NODE_ENV === "production" && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn("⚠ NEXT_PUBLIC_SITE_URL is not set: canonical URLs and sitemap.xml will point to https://example.com.");
}

const nextConfig: NextConfig = {
  images: {
    // 60 is used for the hero background (under a dark overlay), 75 everywhere else.
    qualities: [60, 75],
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
