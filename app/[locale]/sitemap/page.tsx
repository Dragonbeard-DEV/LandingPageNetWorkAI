import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { getJobs, getNews, getProjects, getSegments, getSolutions } from "@/lib/content";
import { Link } from "@/lib/i18n/navigation";
import { resolveLocale } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/site.config";

type Group = { id: string; title: string; links: { label: string; href: string }[] };

export async function generateMetadata({ params }: PageProps<"/[locale]/sitemap">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "sitemap" });
  return buildMetadata({ locale, path: "/sitemap", title: t("title"), description: t("metaDescription") });
}

export default async function SitemapPage({ params }: PageProps<"/[locale]/sitemap">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("sitemap");
  const nav = await getTranslations("nav");
  const common = await getTranslations("common");
  const link = (key: string, href: string) => ({ label: nav(key), href });

  const groups: Group[] = [
    {
      id: "main",
      title: t("mainPages"),
      links: [
        link("home", "/"),
        ...siteConfig.footer.company.map((item) => link(item.key, item.href)),
        link("contact", "/contact"),
      ],
    },
    { id: "solutions", title: nav("solutions"), links: [link("solutions", "/solutions"), ...getSolutions(locale).map((item) => ({ label: item.title, href: `/solutions/${item.slug}` }))] },
    { id: "segments", title: nav("segments"), links: [link("allSegments", "/segments"), ...getSegments(locale).map((item) => ({ label: item.title, href: `/segments/${item.slug}` }))] },
    { id: "projects", title: nav("projects"), links: [link("projects", "/projects"), ...getProjects(locale).map((item) => ({ label: item.title, href: `/projects/${item.slug}` }))] },
    { id: "news", title: nav("news"), links: [link("news", "/news"), ...getNews(locale).map((item) => ({ label: item.title, href: `/news/${item.slug}` }))] },
    { id: "jobs", title: nav("jobs"), links: [link("jobs", "/jobs"), ...getJobs(locale).map((item) => ({ label: item.title, href: `/jobs/${item.slug}` }))] },
    { id: "legal", title: t("legalPages"), links: siteConfig.footer.legal.map((item) => link(item.key, item.href)) },
  ];

  return (
    <>
      <PageHeader title={t("title")} lead={t("lead")} breadcrumbs={[{ label: nav("home"), href: "/" }]} breadcrumbLabel={common("breadcrumb")} />
      <Container className="grid gap-10 py-12 sm:grid-cols-2 md:py-16 lg:grid-cols-3">
        {groups.map((group) => (
          <nav key={group.id} aria-labelledby={`sitemap-${group.id}`}>
            <h2 id={`sitemap-${group.id}`} className="text-lg font-bold">
              {group.title}
            </h2>
            <ul className="mt-4 space-y-2">
              {group.links.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-body hover:text-brand-500 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
    </>
  );
}
