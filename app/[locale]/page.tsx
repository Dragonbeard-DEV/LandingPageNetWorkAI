import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ClientLogoStrip } from "@/components/sections/ClientLogoStrip";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { FieldworkGallery } from "@/components/sections/FieldworkGallery";
import { Hero } from "@/components/sections/Hero";
import { SystemGroups } from "@/components/sections/SystemGroups";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { getFeaturedProjects, getPage, getPartners, getServices, getSolution } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n/params";
import { organizationJsonLd, serializeJsonLd } from "@/lib/seo/jsonld";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/site.config";

/** The solution whose system catalogue the home page previews. */
const ELV_SOLUTION = "elv-systems";
/** Site photos shown on the home page; the About page shows them all. */
const FIELDWORK_PREVIEW = 3;

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

// Block order follows a visitor deciding whether to call: promise (hero), proof (client logos),
// what we do (services), how far it reaches (systems), who for (projects), how we work (fieldwork),
// why us (capability), then the CTA band. The footer comes from the layout.
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await resolveLocale(params);
  const page = getPage(locale, "home");
  if (!page?.hero || !page.capability || !page.cta) notFound();

  // The home page only previews; the full content lives on the pages these blocks link to.
  const about = getPage(locale, "about");
  const systemGroups = getSolution(locale, ELV_SOLUTION)?.systemGroups;
  const fieldwork = about?.fieldwork;

  const t = await getTranslations("home");
  const solutionsT = await getTranslations("solutions");
  const projectsT = await getTranslations("projects");
  const servicesT = await getTranslations("services");

  return (
    <div className="home-motion">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd(page.description)) }} />
      <Hero
        titleLine1={page.hero.titleLine1}
        titleLine2={page.hero.titleLine2}
        lead={page.hero.lead}
        images={[page.hero.image, ...page.hero.slides]}
        slideshowLabels={{
          region: t("slideshow.region"),
          pause: t("slideshow.pause"),
          play: t("slideshow.play"),
          goToSlide: t("slideshow.goToSlide", { number: "{number}" }),
        }}
        primary={{ label: t("heroPrimary"), href: "/contact" }}
        secondary={{ label: t("heroSecondary"), href: "/solutions" }}
      />

      <ClientLogoStrip label={t("clientsLabel")} clients={getPartners(locale).filter((partner) => partner.group === "client")} />

      <Section id="services" eyebrow={t("servicesEyebrow")} title={t("servicesTitle")} intro={t("servicesIntro")}>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {getServices(locale).map((service) => (
            <Reveal as="li" key={service.slug}>
              <Card href={`/services/${service.slug}`} title={service.title} description={service.summary} icon={service.icon} linkLabel={servicesT("linkLabel")} />
            </Reveal>
          ))}
        </ul>
      </Section>

      {systemGroups && (
        <Section id="systems" tone="alt" eyebrow={t("systemsEyebrow")} title={t("systemsTitle")} intro={t("systemsIntro")}>
          <SystemGroups groups={systemGroups} />
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href={`/solutions/${ELV_SOLUTION}`}>{t("systemsLink")}</Button>
            <Button href="/solutions" variant="secondary">
              {solutionsT("viewAll")}
            </Button>
          </div>
        </Section>
      )}

      <FeaturedProjects
        projects={getFeaturedProjects(locale, 3)}
        eyebrow={t("projectsEyebrow")}
        title={t("projectsTitle")}
        linkLabel={projectsT("linkLabel")}
        viewAllLabel={projectsT("viewAll")}
      />

      {fieldwork && (
        <Section id="fieldwork" tone="alt" eyebrow={t("fieldworkEyebrow")} title={t("fieldworkTitle")} intro={fieldwork.intro}>
          <FieldworkGallery photos={fieldwork.photos.slice(0, FIELDWORK_PREVIEW)} />
          <div className="mt-10">
            <Button href="/about#fieldwork" variant="secondary">
              {t("fieldworkMore")}
            </Button>
          </div>
        </Section>
      )}

      <Section id="capability" tone="card" className="relative isolate overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -bottom-16 -z-10 w-64 md:-right-20 md:-bottom-20 md:w-[30rem]">
          <Reveal className="reveal-from-right">
            <Image src={siteConfig.logo.icon} alt="" width={1280} height={1132} sizes="(min-width: 768px) 30rem, 16rem" className="h-auto w-full opacity-10 grayscale" />
          </Reveal>
        </div>
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold tracking-wide text-brand-500 uppercase">{t("capabilityEyebrow")}</p>
          <blockquote className="mt-6">
            <p className="text-3xl leading-tight font-bold tracking-tight text-strong md:text-5xl">“{page.capability.quote}”</p>
          </blockquote>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-tint">{page.capability.text}</p>
          {about?.stats && (
            <dl className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-6 lg:grid-cols-4">
              {about.stats.map((stat) => (
                <div key={stat.label} className="flex flex-col-reverse justify-end">
                  <dt className="mt-1 text-sm text-muted">{stat.label}</dt>
                  <dd className="text-4xl font-extrabold text-brand-500">{stat.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/about" variant="secondary">
              {t("aboutButton")}
            </Button>
            <Button href="/contact">{t("contactButton")}</Button>
          </div>
        </Reveal>
      </Section>

      <CtaBand title={page.cta.title} text={page.cta.text} buttonLabel={t("ctaButton")} />
    </div>
  );
}
