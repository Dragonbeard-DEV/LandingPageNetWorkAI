import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CtaBand } from "@/components/sections/CtaBand";
import { FallbackNotice } from "@/components/sections/FallbackNotice";
import { MdxContent } from "@/components/sections/MdxContent";
import { PageHeader } from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { getService, getServices, listSlugs } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return listSlugs("services").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/services/[slug]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const service = getService(locale, slug);
  if (!service) return {};
  return buildMetadata({ locale, path: `/services/${slug}`, title: service.title, description: service.description, image: service.image });
}

export default async function ServicePage({ params }: PageProps<"/[locale]/services/[slug]">) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const service = getService(locale, slug);
  if (!service) notFound();

  const t = await getTranslations("services");
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");
  const others = getServices(locale).filter((other) => other.slug !== slug);
  // Sections alternate backgrounds; the optional approaches block (tinted) shifts the pattern by one.
  const hasApproaches = Boolean(service.approaches?.length);
  const scopeTone = hasApproaches ? "page" : "alt";
  const processTone = hasApproaches ? "alt" : "page";

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={service.title}
        lead={service.description}
        breadcrumbs={[
          { label: nav("home"), href: "/" },
          { label: nav("services"), href: "/services" },
        ]}
        breadcrumbLabel={common("breadcrumb")}
      />
      <FallbackNotice isFallback={service.isFallback} />

      <Container className="py-12 md:py-16">
        <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-soft-strong shadow-card">
          <Image src={service.image.src} alt={service.image.alt} fill priority sizes="(min-width: 1216px) 1216px, 100vw" className="object-cover" />
        </div>
        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <MdxContent source={service.body} className="text-lg" />
          <aside aria-labelledby="service-highlights" className="h-fit rounded-[var(--radius-card)] border border-border-soft bg-card p-6 shadow-card">
            <h2 id="service-highlights" className="text-lg font-bold">
              {t("highlightsTitle")}
            </h2>
            <ul className="mt-4 space-y-3">
              {service.highlights.map((point) => (
                <li key={point} className="flex gap-3">
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-1 size-4 shrink-0 text-brand-500">
                    <path fill="currentColor" d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
                  </svg>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <Button href="/contact" className="mt-6 w-full">
              {common("cta.button")}
            </Button>
          </aside>
        </div>
      </Container>

      {hasApproaches && (
        <Section id="approaches" tone="alt" title={t("approachesTitle")}>
          <ul className="grid gap-6 md:grid-cols-2">
            {service.approaches?.map((item) => (
              <Reveal as="li" key={item.title} className="rounded-[var(--radius-card)] border border-border-soft bg-card p-6 shadow-card">
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-muted">{item.text}</p>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      <Section id="scope" tone={scopeTone} title={t("scopeTitle")}>
        <ul className="grid gap-6 md:grid-cols-2">
          {service.scope.map((item) => (
            <Reveal as="li" key={item.title} className="rounded-[var(--radius-card)] border border-border-soft bg-card p-6 shadow-card">
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-muted">{item.text}</p>
            </Reveal>
          ))}
        </ul>
        {service.gallery.length > 0 && (
          <ul aria-label={t("galleryLabel")} className="mt-10 grid gap-5 sm:grid-cols-3">
            {service.gallery.map((photo) => (
              <Reveal as="li" key={photo.src} className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-soft-strong shadow-card">
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
              </Reveal>
            ))}
          </ul>
        )}
      </Section>

      <Section id="process" tone={processTone} title={t("processTitle")}>
        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {service.process.map((step, index) => (
            <Reveal as="li" key={step.title} className="relative border-t-2 border-border-strong pt-7">
              <span aria-hidden="true" className="absolute -top-4 left-0 flex size-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                {index + 1}
              </span>
              <h3 className="text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-muted">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section id="other-services" tone={scopeTone} title={t("otherServices")}>
        <ul className="grid gap-6 md:grid-cols-3">
          {others.map((other) => (
            <Reveal as="li" key={other.slug}>
              <Card href={`/services/${other.slug}`} title={other.title} description={other.summary} icon={other.icon} linkLabel={t("linkLabel")} />
            </Reveal>
          ))}
        </ul>
      </Section>

      <CtaBand title={common("cta.title")} text={common("cta.text")} buttonLabel={common("cta.button")} />
    </>
  );
}
