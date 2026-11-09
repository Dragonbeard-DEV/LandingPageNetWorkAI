import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { PartnerGrid } from "@/components/sections/PartnerGrid";
import { Section } from "@/components/ui/Section";
import { getPartners } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/partners">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "partners" });
  return buildMetadata({ locale, path: "/partners", title: t("title"), description: t("metaDescription") });
}

export default async function PartnersPage({ params }: PageProps<"/[locale]/partners">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("partners");
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");
  const partners = getPartners(locale);

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        breadcrumbs={[{ label: nav("home"), href: "/" }]}
        breadcrumbLabel={common("breadcrumb")}
      />
      <Section id="clients" title={t("clientsTitle")} intro={t("clientsIntro")}>
        <PartnerGrid partners={partners.filter((partner) => partner.group === "client")} />
      </Section>
      <Section id="partners" tone="alt" title={t("partnersTitle")} intro={t("partnersIntro")}>
        <PartnerGrid partners={partners.filter((partner) => partner.group === "partner")} />
        <p className="mt-8 text-sm text-muted-tint">{t("trademarkNote")}</p>
      </Section>
      <CtaBand title={common("cta.title")} text={common("cta.text")} buttonLabel={common("cta.button")} />
    </>
  );
}
