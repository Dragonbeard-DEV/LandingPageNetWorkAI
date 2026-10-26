import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Analytics } from "@/components/layout/Analytics";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getSegments } from "@/lib/content";
import { routing } from "@/lib/i18n/routing";
import { siteConfig } from "@/site.config";
import "../globals.css";

const font = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  // Three weights keep the font payload small; 600/800 classes resolve to the 700 file.
  weight: ["400", "500", "700"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
  // Not preloaded: the LCP element is the hero photo, and preloading 6 font files competed with it on mobile.
  preload: false,
});

// Only the namespaces used by client components are sent to the browser.
const CLIENT_NAMESPACES = ["nav", "header", "language", "cookie", "form"] as const;

function pick(messages: Record<string, unknown>, keys: readonly string[]): Record<string, unknown> {
  return Object.fromEntries(keys.filter((key) => key in messages).map((key) => [key, messages[key]]));
}

export const viewport: Viewport = {
  themeColor: "#0f5bff",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: `${siteConfig.name} | ${t("tagline")}`, template: `%s | ${siteConfig.name}` },
    description: t("description"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("header");

  return (
    <html lang={locale} className={font.variable}>
      <body className="flex min-h-dvh flex-col">
        <NextIntlClientProvider messages={pick(await getMessages(), CLIENT_NAMESPACES)}>
          <a
            href="#main"
            className="sr-only z-[70] rounded-lg bg-brand-500 px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            {t("skipToContent")}
          </a>
          <Header segments={getSegments(locale).map(({ slug, title }) => ({ slug, title }))} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <CookieBanner />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
