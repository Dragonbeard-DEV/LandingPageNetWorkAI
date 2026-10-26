import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Hero } from "@/components/sections/Hero";
import { MdxContent } from "@/components/sections/MdxContent";
import { SolutionGrid } from "@/components/sections/SolutionGrid";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { getFeaturedProjects, getPage, getSolutions } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n/params";
import { organizationJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/site.config";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const page = getPage(locale, "home");
  const t = await getTranslations({ locale, namespace: "home" });
  if (!page) return {};
  return buildMetadata({
    locale,
    path: "/",
    title: t("metaTitle", { name: siteConfig.name }),
    description: page.description,
    absoluteTitle: true,
  });
}

// Block order follows the brief: hero, intro, solutions, capability, featured projects,
// packages, CTA band; the footer comes from the layout.
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await resolveLocale(params);
  const page = getPage(locale, "home");
  if (!page?.hero || !page.intro || !page.capability || !page.packages || !page.cta) notFound();

  const t = await getTranslations("home");
  const solutionsT = await getTranslations("solutions");
  const projectsT = await getTranslations("projects");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd(page.description)) }} />
      <Hero
        titleLine1={page.hero.titleLine1}
        titleLine2={page.hero.titleLine2}
        lead={page.hero.lead}
        image={page.hero.image}
        primary={{ label: t("heroPrimary"), href: "/contact" }}
        secondary={{ label: t("heroSecondary"), href: "/solutions" }}
      />

      <Section id="intro" tone="card" eyebrow={t("introEyebrow")} title={page.intro.title}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <MdxContent source={page.body} className="text-lg" />
          <Reveal>
            <ul className="flex flex-wrap content-start gap-3">
              {page.intro.chips.map((chip) => (
                <li key={chip}>
                  <Chip>{chip}</Chip>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section id="solutions" eyebrow={t("solutionsEyebrow")} title={t("solutionsTitle")}>
        <SolutionGrid solutions={getSolutions(locale).slice(0, 6)} linkLabel={solutionsT("linkLabel")} />
      </Section>

      <Section id="capability" tone="alt">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold tracking-wide text-brand-500 uppercase">{t("capabilityEyebrow")}</p>
          <blockquote className="mt-6">
            <p className="text-3xl leading-tight font-bold tracking-tight text-strong md:text-5xl">“{page.capability.quote}”</p>
          </blockquote>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-tint">{page.capability.text}</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/about" variant="secondary">
              {t("aboutButton")}
            </Button>
            <Button href="/contact">{t("contactButton")}</Button>
          </div>
        </Reveal>
      </Section>

      <FeaturedProjects
        projects={getFeaturedProjects(locale, 3)}
        eyebrow={t("projectsEyebrow")}
        title={t("projectsTitle")}
        linkLabel={projectsT("linkLabel")}
        viewAllLabel={projectsT("viewAll")}
      />

      <Section id="packages" tone="alt" eyebrow={t("packagesEyebrow")} title={t("packagesTitle")}>
        <ul className="grid gap-6 md:grid-cols-3">
          {page.packages.map((pkg) => (
            <Reveal as="li" key={pkg.name} className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-border-soft bg-card shadow-card">
              <div className="relative aspect-[16/10] bg-soft-strong">
                <Image src={pkg.image.src} alt={pkg.image.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h3 className="text-xl font-bold">{pkg.name}</h3>
                <p className="text-muted">{pkg.description}</p>
                <Button href="/contact" variant="secondary" className="mt-auto self-start">
                  {t("packageButton", { name: pkg.name })}
                </Button>
              </div>
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaBand title={page.cta.title} text={page.cta.text} buttonLabel={t("ctaButton")} />
    </>
  );
}
