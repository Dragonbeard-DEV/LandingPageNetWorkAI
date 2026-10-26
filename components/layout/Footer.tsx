import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/site.config";
import { CookieSettingsButton } from "./CookieBanner";

const linkClass = "text-body hover:text-brand-500";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");
  const social = await getTranslations("social");
  const year = new Date().getFullYear();
  const { contact } = siteConfig;

  const columns = [
    { key: "mainLinks", links: siteConfig.footer.main },
    { key: "company", links: siteConfig.footer.company },
  ] as const;

  return (
    <footer className="border-t border-border-soft bg-card">
      <Container className="py-14 md:py-16">
        <Link href="/" className="inline-block rounded-lg" aria-label={t("homeLink", { name: siteConfig.name })}>
          <Image src={siteConfig.logo.full} alt="" width={152} height={44} className="h-11" style={{ width: "auto" }} />
        </Link>
        <p className="mt-4 max-w-md text-muted">{t("tagline")}</p>

        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <nav key={column.key} aria-labelledby={`footer-${column.key}`}>
              <h2 id={`footer-${column.key}`} className="text-sm font-semibold tracking-wide uppercase">
                {t(column.key)}
              </h2>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {nav(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="text-sm font-semibold tracking-wide uppercase">{t("contact")}</h2>
            <address className="mt-4 space-y-3 not-italic">
              <p>
                <span className="sr-only">{t("email")}: </span>
                <a href={`mailto:${contact.email}`} className={linkClass}>
                  {contact.email}
                </a>
              </p>
              <p>
                <span className="sr-only">{t("phone")}: </span>
                <a href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`} className={linkClass}>
                  {contact.phone}
                </a>
              </p>
              <p className="text-muted">
                <span className="sr-only">{t("address")}: </span>
                {contact.address}
              </p>
            </address>
          </div>

          <nav aria-labelledby="footer-social">
            <h2 id="footer-social" className="text-sm font-semibold tracking-wide uppercase">
              {t("social")}
            </h2>
            <ul className="mt-4 space-y-3">
              {siteConfig.social.map((item) => (
                <li key={item.key}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {social(item.key)}
                    <span className="sr-only"> ({t("opensInNewTab")})</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>

      <div className="border-t border-border-soft">
        <Container className="flex flex-col gap-4 py-6 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p>{t("copyright", { year, name: siteConfig.name })}</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {siteConfig.footer.legal.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-brand-500">
                  {nav(link.key)}
                </Link>
              </li>
            ))}
            <li>
              <CookieSettingsButton label={t("manageCookies")} />
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
