import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { getPage } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/cookies">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const page = getPage(locale, "cookies");
  if (!page) return {};
  return buildMetadata({ locale, path: "/cookies", title: page.title, description: page.description });
}

export default async function CookiesPage({ params }: PageProps<"/[locale]/cookies">) {
  const locale = await resolveLocale(params);
  return <LegalPage locale={locale} slug="cookies" />;
}
