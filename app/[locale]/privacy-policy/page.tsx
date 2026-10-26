import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { getPage } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/privacy-policy">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const page = getPage(locale, "privacy-policy");
  if (!page) return {};
  return buildMetadata({ locale, path: "/privacy-policy", title: page.title, description: page.description });
}

export default async function PrivacyPolicyPage({ params }: PageProps<"/[locale]/privacy-policy">) {
  const locale = await resolveLocale(params);
  return <LegalPage locale={locale} slug="privacy-policy" />;
}
