import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
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
  const footer = await getTranslations("footer");

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        breadcrumbs={[{ label: nav("home"), href: "/" }]}
        breadcrumbLabel={common("breadcrumb")}
      />
      <Section>
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {getPartners(locale).map((partner) => (
            <Reveal as="li" key={partner.name}>
              <a
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col items-center gap-4 rounded-[var(--radius-card)] border border-border-soft bg-card p-6 text-center shadow-card transition-shadow hover:shadow-panel"
              >
                <span className="relative block h-16 w-full">
                  <Image src={partner.logo} alt={t("logoAlt", { name: partner.name })} fill sizes="200px" className="object-contain" />
                </span>
                <span className="text-sm font-semibold text-strong">{partner.name}</span>
                {partner.description && <span className="text-sm text-muted">{partner.description}</span>}
                <span className="sr-only">
                  {t("visit", { name: partner.name })} ({footer("opensInNewTab")})
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
        <p className="mt-8 text-sm text-muted-tint">{t("trademarkNote")}</p>
      </Section>
      <CtaBand title={common("cta.title")} text={common("cta.text")} buttonLabel={common("cta.button")} />
    </>
  );
}
