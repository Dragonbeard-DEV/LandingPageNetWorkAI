import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AboutAccordion } from "@/components/sections/AboutAccordion";
import { CtaBand } from "@/components/sections/CtaBand";
import { FallbackNotice } from "@/components/sections/FallbackNotice";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { getPage, splitMdxSections } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const page = getPage(locale, "about");
  if (!page) return {};
  return buildMetadata({ locale, path: "/about", title: page.title, description: page.description, image: page.hero?.image });
}

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const locale = await resolveLocale(params);
  const page = getPage(locale, "about");
  if (!page) notFound();

  const t = await getTranslations("about");
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");
  const title = page.hero ? `${page.hero.titleLine1} ${page.hero.titleLine2}` : page.title;

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={title}
        lead={page.hero?.lead}
        breadcrumbs={[{ label: nav("home"), href: "/" }]}
        breadcrumbLabel={common("breadcrumb")}
      />
      <FallbackNotice isFallback={page.isFallback} />

      <Container className="py-12 md:py-16">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          {page.hero && (
            <div className="relative aspect-[1179/946] overflow-hidden rounded-[var(--radius-card)] bg-soft-strong shadow-card">
              <Image src={page.hero.image.src} alt={page.hero.image.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
          )}
          <AboutAccordion sections={splitMdxSections(page.body)} />
        </div>
      </Container>

      {page.values && (
        <Section id="values" tone="alt" title={t("valuesTitle")}>
          <ul className="grid gap-6 md:grid-cols-3">
            {page.values.map((value) => (
              <Reveal as="li" key={value.title} className="rounded-[var(--radius-card)] border border-border-soft bg-card p-6 shadow-card">
                <h3 className="text-xl font-bold">{value.title}</h3>
                <p className="mt-3 text-muted">{value.text}</p>
              </Reveal>
            ))}
          </ul>
        </Section>
      )}

      {page.stats && (
        <Section id="stats" tone="card" title={t("statsTitle")} intro={t("statsNote")}>
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {page.stats.map((stat) => (
              <Reveal key={stat.label} className="rounded-[var(--radius-card)] bg-brand-soft p-6">
                <dt className="text-muted-tint">{stat.label}</dt>
                <dd className="mt-2 text-4xl font-extrabold text-brand-500">{stat.value}</dd>
              </Reveal>
            ))}
          </dl>
        </Section>
      )}

      <CtaBand title={common("cta.title")} text={common("cta.text")} buttonLabel={common("cta.button")} />
    </>
  );
}
