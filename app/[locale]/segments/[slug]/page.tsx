import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/sections/CtaBand";
import { FallbackNotice } from "@/components/sections/FallbackNotice";
import { MdxContent } from "@/components/sections/MdxContent";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { SolutionGrid } from "@/components/sections/SolutionGrid";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getProjects, getSegment, getSolutions, listSlugs, pickBySlug } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return listSlugs("segments").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/segments/[slug]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const segment = getSegment(locale, slug);
  if (!segment) return {};
  return buildMetadata({ locale, path: `/segments/${slug}`, title: segment.title, description: segment.summary, image: segment.image });
}

export default async function SegmentPage({ params }: PageProps<"/[locale]/segments/[slug]">) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const segment = getSegment(locale, slug);
  if (!segment) notFound();

  const t = await getTranslations("segments");
  const solutionsT = await getTranslations("solutions");
  const projectsT = await getTranslations("projects");
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");
  const solutions = pickBySlug(getSolutions(locale), segment.solutions);
  const projects = getProjects(locale).filter((project) => project.segment === slug);

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={segment.title}
        lead={segment.summary}
        breadcrumbs={[
          { label: nav("home"), href: "/" },
          { label: nav("segments"), href: "/segments" },
        ]}
        breadcrumbLabel={common("breadcrumb")}
      />
      <FallbackNotice isFallback={segment.isFallback} />

      <Container className="py-12 md:py-16">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-soft-strong shadow-card">
            <Image src={segment.image.src} alt={segment.image.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <MdxContent source={segment.body} />
        </div>
      </Container>

      {solutions.length > 0 && (
        <Section id="segment-solutions" tone="alt" title={t("relatedSolutions")}>
          <SolutionGrid solutions={solutions} linkLabel={solutionsT("linkLabel")} />
        </Section>
      )}
      {projects.length > 0 && (
        <Section id="segment-projects" title={t("relatedProjects")}>
          <ProjectGrid projects={projects} linkLabel={projectsT("linkLabel")} />
        </Section>
      )}
      <CtaBand title={common("cta.title")} text={common("cta.text")} buttonLabel={common("cta.button")} />
    </>
  );
}
