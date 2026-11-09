import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ClientLogoStrip } from "@/components/sections/ClientLogoStrip";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { FieldworkGallery } from "@/components/sections/FieldworkGallery";
import { Hero } from "@/components/sections/Hero";
import { ServicePillars } from "@/components/sections/ServicePillars";
import { SystemGroups } from "@/components/sections/SystemGroups";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { getFeaturedProjects, getPage, getPartners } from "@/lib/content";
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

// Block order follows a visitor deciding whether to call: promise (hero), proof (client logos),
// what we do (services), how far it reaches (systems), who for (projects), how we work (fieldwork),
// why us (capability), then the CTA band. The footer comes from the layout.
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = await resolveLocale(params);
  const page = getPage(locale, "home");
  if (!page?.hero || !page.services || !page.systems || !page.fieldwork || !page.capability || !page.cta) {
    notFound();
  }

  const t = await getTranslations("home");
  const solutionsT = await getTranslations("solutions");
  const projectsT = await getTranslations("projects");

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
        <ServicePillars services={page.services} buttonLabel={t("serviceButton")} />
      </Section>

      <Section id="systems" tone="alt" eyebrow={t("systemsEyebrow")} title={t("systemsTitle")} intro={page.systems.intro}>
        <SystemGroups groups={page.systems.groups} pmsLabel={t("systemsPms")} />
        <p className="mt-5 text-sm text-muted-tint">{page.systems.pmsNote}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button href="/solutions/elv-systems">{t("systemsLink")}</Button>
          <Button href="/solutions" variant="secondary">
            {solutionsT("viewAll")}
          </Button>
        </div>
      </Section>

      <FeaturedProjects
        projects={getFeaturedProjects(locale, 3)}
        eyebrow={t("projectsEyebrow")}
        title={t("projectsTitle")}
        linkLabel={projectsT("linkLabel")}
        viewAllLabel={projectsT("viewAll")}
      />

      <Section id="fieldwork" tone="alt" eyebrow={t("fieldworkEyebrow")} title={t("fieldworkTitle")} intro={page.fieldwork.intro}>
        <FieldworkGallery photos={page.fieldwork.photos} />
      </Section>

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
