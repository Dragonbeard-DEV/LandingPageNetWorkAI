import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { getJobs } from "@/lib/content";
import { resolveLocale } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: PageProps<"/[locale]/jobs">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "jobs" });
  return buildMetadata({ locale, path: "/jobs", title: t("title"), description: t("metaDescription") });
}

export default async function JobsPage({ params }: PageProps<"/[locale]/jobs">) {
  const locale = await resolveLocale(params);
  const t = await getTranslations("jobs");
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");
  const format = await getFormatter();
  const jobs = getJobs(locale);

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        breadcrumbs={[{ label: nav("home"), href: "/" }]}
        breadcrumbLabel={common("breadcrumb")}
      />
      <Section id="openings" title={t("openings")}>
        {jobs.length === 0 ? (
          <p className="text-muted-tint">{t("empty")}</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2">
            {jobs.map((job) => (
              <Reveal as="li" key={job.slug}>
                <Card
                  href={`/jobs/${job.slug}`}
                  title={job.title}
                  description={job.description}
                  meta={job.postedAt ? `${t("postedAt")}: ${format.dateTime(job.postedAt, { dateStyle: "medium" })}` : undefined}
                  linkLabel={t("linkLabel")}
                >
                  <div className="flex flex-wrap gap-2">
                    <Chip>{job.location}</Chip>
                    <Chip>{job.type}</Chip>
                  </div>
                </Card>
              </Reveal>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
