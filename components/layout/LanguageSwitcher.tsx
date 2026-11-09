"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { locales } from "@/site.config";
import { cn } from "@/lib/cn";

type Props = {
  className?: string;
  isOnDark?: boolean;
};

const toneClasses = {
  light: { active: "bg-brand-soft text-brand-500", inactive: "text-body hover:bg-soft" },
  dark: { active: "bg-white/15 text-white focus-visible:outline-white", inactive: "text-white hover:bg-white/10 focus-visible:outline-white" },
};

export function LanguageSwitcher({ className, isOnDark = false }: Props) {
  const t = useTranslations("language");
  const current = useLocale();
  const pathname = usePathname();
  const tone = toneClasses[isOnDark ? "dark" : "light"];

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
              "inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg px-2 text-sm font-semibold uppercase transition-colors",
              isActive ? tone.active : tone.inactive,
            )}
          >
            {locale}
          </Link>
        );
      })}
    </nav>
  );
}
