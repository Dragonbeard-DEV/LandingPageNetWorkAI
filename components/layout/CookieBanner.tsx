"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { onOpenCookieSettings, openCookieSettings, readConsent, writeConsent, type Consent } from "@/lib/consent";

/**
 * Essential cookies only by default; nothing optional loads until the visitor chooses "Accept all".
 */
export function CookieBanner() {
  const t = useTranslations("cookie");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Consent lives in localStorage, which only exists after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVisible(readConsent() === null);
    return onOpenCookieSettings(() => setIsVisible(true));
  }, []);

  if (!isVisible) return null;

  const choose = (consent: Consent) => {
    writeConsent(consent);
    setIsVisible(false);
  };

  return (
    <section
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-0 bottom-0 z-40 p-[var(--gutter)] md:inset-x-auto md:right-6 md:bottom-6 md:max-w-md md:p-0"
    >
      <div className="rounded-[var(--radius-card)] border border-border-soft bg-card p-6 shadow-panel">
        <h2 id="cookie-banner-title" className="text-lg font-bold">
          {t("title")}
        </h2>
        <p className="mt-2 text-sm text-body">
          {t("text")}{" "}
          <Link href="/cookies" className="font-medium text-brand-500 underline underline-offset-2">
            {t("learnMore")}
          </Link>
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="min-h-11 flex-1 rounded-[var(--radius-control)] border border-border-strong px-4 text-sm font-semibold text-strong hover:border-border-strong-hover hover:bg-soft"
          >
            {t("essentialOnly")}
          </button>
          <button
            type="button"
            onClick={() => choose("all")}
            className="min-h-11 flex-1 rounded-[var(--radius-control)] bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
          >
            {t("acceptAll")}
          </button>
        </div>
      </div>
    </section>
  );
}

export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={openCookieSettings} className="hover:text-brand-500">
      {label}
    </button>
  );
}
