import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { getSegments } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/segments">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "segments" });
  return buildMetadata({ locale, path: "/segments", title: t("title"), description: t("metaDescription") });
}

export default async function SegmentsPage({ params }: PageProps<"/[locale]/segments">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("segments");
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");

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
        <ul className="grid gap-6 md:grid-cols-2">
          {getSegments(locale).map((segment) => (
            <Reveal as="li" key={segment.slug}>
              <Card
                href={`/segments/${segment.slug}`}
                title={segment.title}
                description={segment.summary}
                image={segment.image}
                imageSizes="(min-width: 768px) 50vw, 100vw"
                linkLabel={t("linkLabel")}
                headingLevel="h2"
              />
            </Reveal>
          ))}
        </ul>
      </Section>
      <CtaBand title={common("cta.title")} text={common("cta.text")} buttonLabel={common("cta.button")} />
    </>
  );
}
