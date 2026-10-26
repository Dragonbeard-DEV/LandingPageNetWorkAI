import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { FallbackNotice } from "@/components/sections/FallbackNotice";
import { MdxContent } from "@/components/sections/MdxContent";
import { PageHeader } from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getJob, listSlugs } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/site.config";

export const dynamicParams = false;

export function generateStaticParams() {
  return listSlugs("jobs").map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/jobs/[slug]">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const job = getJob(locale, slug);
  if (!job) return {};
  return buildMetadata({ locale, path: `/jobs/${slug}`, title: job.title, description: job.description });
}

export default async function JobPage({ params }: PageProps<"/[locale]/jobs/[slug]">) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  const job = getJob(locale, slug);
  if (!job) notFound();

  const t = await getTranslations("jobs");
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");
  const format = await getFormatter();
  const email = job.applyEmail ?? siteConfig.contact.email;
  const mailto = `mailto:${email}?subject=${encodeURIComponent(t("applySubject", { title: job.title }))}`;

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={job.title}
        lead={job.description}
        breadcrumbs={[
          { label: nav("home"), href: "/" },
          { label: nav("jobs"), href: "/jobs" },
        ]}
        breadcrumbLabel={common("breadcrumb")}
      />
      <FallbackNotice isFallback={job.isFallback} />

      <Container className="grid gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <MdxContent source={job.body} />
        <aside aria-labelledby="job-apply" className="h-fit rounded-[var(--radius-card)] border border-border-soft bg-card p-6 shadow-card">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-muted">{t("location")}</dt>
              <dd className="font-medium text-strong">{job.location}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">{t("type")}</dt>
              <dd className="font-medium text-strong">{job.type}</dd>
            </div>
            {job.postedAt && (
              <div>
                <dt className="text-sm text-muted">{t("postedAt")}</dt>
                <dd className="font-medium text-strong">
                  <time dateTime={job.postedAt.toISOString().slice(0, 10)}>{format.dateTime(job.postedAt, { dateStyle: "long" })}</time>
                </dd>
              </div>
            )}
          </dl>
          <h2 id="job-apply" className="sr-only">
            {t("apply")}
          </h2>
          <Button href={mailto} className="mt-6 w-full">
            {t("apply")}
          </Button>
          <p className="mt-3 text-sm text-muted">{t("applyNote", { email })}</p>
        </aside>
      </Container>
    </>
  );
}
