"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { locales } from "@/site.config";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
};

export function LanguageSwitcher({ className }: Props) {
  const t = useTranslations("language");
  const current = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("label")} className={cn("flex items-center gap-1", className)}>
      {locales.map((locale) => {
        const isActive = locale === current;
        return (
          <Link
            key={locale}
            href={pathname}
            locale={locale}
            hrefLang={locale}
            lang={locale}
            aria-current={isActive ? "true" : undefined}
            aria-label={t(`switchTo.${locale}`)}
            className={cn(
              "inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg px-2 text-sm font-semibold uppercase",
              isActive ? "bg-brand-soft text-brand-500" : "text-body hover:bg-soft",
            )}
          >
            {locale}
          </Link>
        );
      })}
    </nav>
  );
}
