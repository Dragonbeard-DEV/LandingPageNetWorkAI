import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { resolveLocale } from "@/lib/i18n/params";
import { buildMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/site.config";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const t = await getTranslations({ locale, namespace: "contact" });
  return buildMetadata({ locale, path: "/contact", title: t("title"), description: t("metaDescription") });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  await resolveLocale(params);
  const t = await getTranslations("contact");
  const common = await getTranslations("common");
  const nav = await getTranslations("nav");
  const { contact } = siteConfig;
  const linkClass = "font-medium text-brand-500 hover:underline";

  return (
    <>
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        lead={t("lead")}
        breadcrumbs={[{ label: nav("home"), href: "/" }]}
        breadcrumbLabel={common("breadcrumb")}
      />
      <Container className="grid gap-12 py-12 md:py-16 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div id="contact-form" />
        <aside aria-labelledby="contact-details" className="h-fit rounded-[var(--radius-card)] border border-border-soft bg-card p-6 shadow-card">
          <h2 id="contact-details" className="text-lg font-bold">
            {t("detailsTitle")}
          </h2>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm text-muted">{t("email")}</dt>
              <dd>
                <a href={`mailto:${contact.email}`} className={linkClass}>
                  {contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">{t("phone")}</dt>
              <dd>
                <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className={linkClass}>
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">{t("address")}</dt>
              <dd className="text-strong">{contact.address}</dd>
            </div>
          </dl>
        </aside>
      </Container>
    </>
  );
}
