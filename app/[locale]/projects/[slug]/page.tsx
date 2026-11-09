import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/sections/CtaBand";
import { FallbackNotice } from "@/components/sections/FallbackNotice";
import { MdxContent } from "@/components/sections/MdxContent";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { getProject, getSegment, getSolutions, listSlugs, pickBySlug } from "@/lib/content";
import { Link } from "@/lib/i18n/navigation";
import { resolveLocale } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return listSlugs("projects").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const project = getProject(locale, slug);
  if (!project) return {};
  return buildMetadata({
    locale,
    path: `/projects/${slug}`,
    title: project.title,
    description: project.summary,
    image: project.coverImage,
    type: "article",
  });
}

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const project = getProject(locale, slug);
  if (!project) notFound();

  const t = await getTranslations("projects");
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");
  const segment = project.segment ? getSegment(locale, project.segment) : null;
  const solutions = pickBySlug(getSolutions(locale), project.solutions);
  const linkClass = "font-medium text-brand-500 hover:underline";

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={project.title}
        lead={project.summary}
        breadcrumbs={[
          { label: nav("home"), href: "/" },
          { label: nav("projects"), href: "/projects" },
        ]}
        breadcrumbLabel={common("breadcrumb")}
      />
      <FallbackNotice isFallback={project.isFallback} />

      <Container className="py-12 md:py-16">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-soft-strong shadow-card">
          <Image src={project.coverImage.src} alt={project.coverImage.alt} fill priority sizes="(min-width: 1216px) 1216px, 100vw" className="object-cover" />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <MdxContent source={project.body} />
          <aside aria-labelledby="project-facts" className="h-fit rounded-[var(--radius-card)] border border-border-soft bg-card p-6 shadow-card">
            <h2 id="project-facts" className="text-lg font-bold">
              {t("facts")}
            </h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm text-muted">{t("client")}</dt>
                <dd className="font-medium text-strong">{project.client}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">{t("location")}</dt>
                <dd className="font-medium text-strong">{project.location}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted">{t("year")}</dt>
                <dd className="font-medium text-strong">{project.period ?? project.year}</dd>
              </div>
              {segment && (
                <div>
                  <dt className="text-sm text-muted">{t("segment")}</dt>
                  <dd>
                    <Link href={`/segments/${segment.slug}`} className={linkClass}>
                      {segment.title}
                    </Link>
                  </dd>
                </div>
              )}
              {solutions.length > 0 && (
                <div>
                  <dt className="text-sm text-muted">{t("solutionsUsed")}</dt>
                  <dd>
                    <ul className="mt-1 space-y-1">
                      {solutions.map((solution) => (
                        <li key={solution.slug}>
                          <Link href={`/solutions/${solution.slug}`} className={linkClass}>
                            {solution.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </dl>
          </aside>
        </div>
      </Container>

      {project.gallery.length > 0 && (
        <Section id="project-gallery" tone="alt" title={t("gallery")}>
          <ul className="grid gap-6 sm:grid-cols-2">
            {project.gallery.map((image) => (
              <Reveal as="li" key={image.src}>
                <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] bg-soft-strong">
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
                </div>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}
      <CtaBand title={common("cta.title")} text={common("cta.text")} buttonLabel={common("cta.button")} />
    </>
  );
}
