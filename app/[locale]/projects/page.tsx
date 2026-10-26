import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { Section } from "@/components/ui/Section";
import { getProjects } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/projects">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "projects" });
  return buildMetadata({ locale, path: "/projects", title: t("title"), description: t("metaDescription") });
}

export default async function ProjectsPage({ params }: PageProps<"/[locale]/projects">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("projects");
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
        <ProjectGrid projects={getProjects(locale)} linkLabel={t("linkLabel")} headingLevel="h2" />
      </Section>
      <CtaBand title={common("cta.title")} text={common("cta.text")} buttonLabel={common("cta.button")} />
    </>
  );
}
