import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { getNews } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/news">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "news" });
  return buildMetadata({ locale, path: "/news", title: t("title"), description: t("metaDescription") });
}

export default async function NewsPage({ params }: PageProps<"/[locale]/news">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("news");
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");
  const format = await getFormatter();
  const items = getNews(locale);

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
        {items.length === 0 ? (
          <p className="text-muted-tint">{t("empty")}</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Reveal as="li" key={item.slug}>
                <Card
                  href={`/news/${item.slug}`}
                  title={item.title}
                  description={item.excerpt}
                  image={item.coverImage}
                  meta={format.dateTime(item.date, { dateStyle: "long" })}
                  linkLabel={t("linkLabel")}
                  headingLevel="h2"
                />
              </Reveal>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
