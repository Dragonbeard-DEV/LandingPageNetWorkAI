import { notFound } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getPage } from "@/lib/content";
import type { Locale } from "@/site.config";
import { FallbackNotice } from "./FallbackNotice";
import { MdxContent } from "./MdxContent";
import { PageHeader } from "./PageHeader";

type Props = {
  locale: Locale;
  slug: "privacy-policy" | "cookies";
};

/** Template legal page with a visible "needs legal review" notice. */
export async function LegalPage({ locale, slug }: Props) {
  const page = getPage(locale, slug);
  if (!page) notFound();
  const t = await getTranslations("legal");
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");
  const format = await getFormatter();

  return (
    <>
      <PageHeader
        title={page.title}
        lead={page.description}
        breadcrumbs={[{ label: nav("home"), href: "/" }]}
        breadcrumbLabel={common("breadcrumb")}
      >
        {page.updatedAt && (
          <p className="mt-6 text-sm text-muted-tint">{t("updated", { date: format.dateTime(page.updatedAt, { dateStyle: "long" }) })}</p>
        )}
      </PageHeader>
      <FallbackNotice isFallback={page.isFallback} />
      <Container className="py-12 md:py-16">
        <p role="note" className="mb-10 max-w-3xl rounded-[var(--radius-control)] border border-error-border bg-error-bg px-4 py-3 font-medium text-error-text">
          {t("reviewNotice")}
        </p>
        <MdxContent source={page.body} />
      </Container>
    </>
  );
}
