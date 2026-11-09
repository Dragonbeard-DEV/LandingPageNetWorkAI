import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/sections/CtaBand";
import { FallbackNotice } from "@/components/sections/FallbackNotice";
import { MdxContent } from "@/components/sections/MdxContent";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { SystemCatalog } from "@/components/sections/SystemCatalog";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getProjects, getSolution, listSlugs, pickBySlug } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return listSlugs("solutions").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/solutions/[slug]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const solution = getSolution(locale, slug);
  if (!solution) return {};
  return buildMetadata({
    locale,
    path: `/solutions/${slug}`,
    title: solution.title,
    description: solution.summary,
    image: solution.image,
  });
}

export default async function SolutionPage({ params }: PageProps<"/[locale]/solutions/[slug]">) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const solution = getSolution(locale, slug);
  if (!solution) notFound();

  const t = await getTranslations("solutions");
  const projects = await getTranslations("projects");
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");
  const related = pickBySlug(getProjects(locale), solution.relatedProjects);
  const { systemGroups } = solution;

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={solution.title}
        lead={solution.tagline}
        breadcrumbs={[
          { label: nav("home"), href: "/" },
          { label: nav("solutions"), href: "/solutions" },
        ]}
        breadcrumbLabel={common("breadcrumb")}
      />
      <FallbackNotice isFallback={solution.isFallback} />

      <Container className="py-12 md:py-16">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-soft-strong shadow-card">
          <Image src={solution.image.src} alt={solution.image.alt} fill priority sizes="(min-width: 1216px) 1216px, 100vw" className="object-cover" />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <p className="max-w-3xl text-xl text-strong">{solution.summary}</p>
            <MdxContent source={solution.body} className="mt-8" />
          </div>
          <aside aria-labelledby="solution-features" className="h-fit rounded-[var(--radius-card)] border border-border-soft bg-card p-6 shadow-card lg:sticky lg:top-24">
            <h2 id="solution-features" className="text-lg font-bold">
              {t("features")}
            </h2>
            <ul className="mt-4 space-y-3">
              {solution.features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-1 size-4 shrink-0 text-brand-500">
                    <path fill="currentColor" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button href="/contact" className="mt-6 w-full">
              {common("cta.button")}
            </Button>
          </aside>
        </div>
      </Container>

      {systemGroups && (
        <Section
          id="systems"
          tone="alt"
          title={t("systemsTitle", { count: systemGroups.flatMap((group) => group.items).length, groups: systemGroups.length })}
          intro={t("systemsIntro")}
        >
          <SystemCatalog groups={systemGroups} pmsLabel={t("pmsLabel")} />
          <p className="mt-10 text-sm text-muted-tint">{t("pmsNote")}</p>
        </Section>
      )}

      {related.length > 0 && (
        <Section id="related-projects" tone={systemGroups ? "page" : "alt"} title={t("relatedProjects")}>
          <ProjectGrid projects={related} linkLabel={projects("linkLabel")} />
        </Section>
      )}
      <CtaBand title={common("cta.title")} text={common("cta.text")} buttonLabel={common("cta.button")} />
    </>
  );
}
