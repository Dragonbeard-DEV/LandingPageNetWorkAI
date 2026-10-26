import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { FallbackNotice } from "@/components/sections/FallbackNotice";
import { MdxContent } from "@/components/sections/MdxContent";
import { PageHeader } from "@/components/sections/PageHeader";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { getNewsItem, listSlugs } from "@/lib/content";
import { Link } from "@/lib/i18n/navigation";
import { resolveLocale } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamicParams = false;

export function generateStaticParams() {
  return listSlugs("news").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/news/[slug]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const item = getNewsItem(locale, slug);
  if (!item) return {};
  return buildMetadata({
    locale,
    path: `/news/${slug}`,
    title: item.title,
    description: item.excerpt,
    image: item.coverImage,
    type: "article",
  });
}

export default async function NewsArticlePage({ params }: PageProps<"/[locale]/news/[slug]">) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const item = getNewsItem(locale, slug);
  if (!item) notFound();

  const t = await getTranslations("news");
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");
  const format = await getFormatter();

  return (
    <article>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={item.title}
        lead={item.excerpt}
        breadcrumbs={[
          { label: nav("home"), href: "/" },
          { label: nav("news"), href: "/news" },
        ]}
        breadcrumbLabel={common("breadcrumb")}
      >
        <p className="mt-6 text-sm text-muted-tint">
          {t("published")}: <time dateTime={item.date.toISOString().slice(0, 10)}>{format.dateTime(item.date, { dateStyle: "long" })}</time>
        </p>
      </PageHeader>
      <FallbackNotice isFallback={item.isFallback} />

      <Container className="max-w-4xl py-12 md:py-16">
        {item.coverImage && (
          <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-soft-strong shadow-card">
            <Image src={item.coverImage.src} alt={item.coverImage.alt} fill priority sizes="(min-width: 896px) 896px, 100vw" className="object-cover" />
          </div>
        )}
        <MdxContent source={item.body} />
        {item.tags.length > 0 && (
          <div className="mt-10">
            <h2 className="sr-only">{t("tags")}</h2>
            <ul className="flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <li key={tag}>
                  <Chip>{tag}</Chip>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-12">
          <Link href="/news" className="font-semibold text-brand-500 hover:underline">
            ← {t("backToList")}
          </Link>
        </p>
      </Container>
    </article>
  );
}
