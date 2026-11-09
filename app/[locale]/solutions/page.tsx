import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { SolutionGrid } from "@/components/sections/SolutionGrid";
import { SystemCatalog } from "@/components/sections/SystemCatalog";
import { SystemsHero } from "@/components/sections/SystemsHero";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getSolution, getSolutions } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";

/** The solution whose system catalogue this page showcases. */
const ELV_SOLUTION = "elv-systems";
/** Keys under solutions.capability in messages/<locale>.json, in delivery order. */
const CAPABILITIES = ["consult", "design", "deploy", "maintain"] as const;

export async function generateMetadata({ params }: PageProps<"/[locale]/solutions">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "solutions" });
  return buildMetadata({ locale, path: "/solutions", title: t("title"), description: t("metaDescription") });
}

export default async function SolutionsPage({ params }: PageProps<"/[locale]/solutions">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("solutions");
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");
  const systemGroups = getSolution(locale, ELV_SOLUTION)?.systemGroups;
  const breadcrumbs = [{ label: nav("home"), href: "/" }];

  return (
    <>
      {systemGroups ? (
        <SystemsHero
          eyebrow={t("eyebrow")}
          title={t("heroTitle")}
          lead={t("heroLead")}
          breadcrumbs={breadcrumbs}
          breadcrumbLabel={common("breadcrumb")}
          primary={{ label: t("heroPrimary"), href: "/contact" }}
          secondary={{ label: t("heroSecondary"), href: "/solutions#systems" }}
          groups={systemGroups}
          systemsLabel={t("heroSystemsLabel")}
        />
      ) : (
        <PageHeader eyebrow={t("eyebrow")} title={t("title")} lead={t("lead")} breadcrumbs={breadcrumbs} breadcrumbLabel={common("breadcrumb")} />
      )}

      <div className="border-b border-border-soft bg-card">
        <Container>
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((key) => (
              <div key={key} className="flex flex-col-reverse justify-end border-border-soft py-6 pr-5 lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0">
                <dd className="mt-1 text-sm text-muted">{t(`capability.${key}.text`)}</dd>
                <dt className="text-lg font-bold text-brand-500">{t(`capability.${key}.title`)}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </div>

      {systemGroups && (
        <Section id="systems" title={t("systemsTitle", { count: systemGroups.flatMap((group) => group.items).length, groups: systemGroups.length })} intro={t("systemsIntro")}>
          <SystemCatalog groups={systemGroups} pmsLabel={t("pmsLabel")} />
          <p className="mt-10 text-sm text-muted-tint">{t("pmsNote")}</p>
        </Section>
      )}

      <Section id="solutions-list" tone="alt" title={t("listTitle")} intro={t("listIntro")}>
        <SolutionGrid solutions={getSolutions(locale)} linkLabel={t("linkLabel")} />
      </Section>

      <CtaBand title={t("ctaTitle")} text={t("ctaText")} buttonLabel={common("cta.button")} />
    </>
  );
}
