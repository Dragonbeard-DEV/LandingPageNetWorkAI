"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/lib/i18n/navigation";
import { onOpenCookieSettings, openCookieSettings, readConsent, writeConsent, type Consent } from "@/lib/consent";

/**
 * Essential cookies only by default; nothing optional loads until the visitor chooses "Accept all".
 */
export function CookieBanner() {
  const t = useTranslations("cookie");
  const [isVisible, setIsVisible] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Element that reopened the banner (footer button), to return focus to after a choice.
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Consent lives in localStorage, which only exists after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVisible(readConsent() === null);
    return onOpenCookieSettings(() => {
      returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setIsVisible(true);
      requestAnimationFrame(() => headingRef.current?.focus());
    });
  }, []);

  if (!isVisible) return null;

  const choose = (consent: Consent) => {
    writeConsent(consent);
    setIsVisible(false);
    returnFocusRef.current?.focus();
    returnFocusRef.current = null;
  };

  return (
    <section
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-0 bottom-0 z-40 p-[var(--gutter)] md:inset-x-auto md:right-6 md:bottom-6 md:max-w-md md:p-0"
    >
      <div className="rounded-[var(--radius-card)] border border-border-soft bg-card p-6 shadow-panel">
        <h2 id="cookie-banner-title" ref={headingRef} tabIndex={-1} className="text-lg font-bold focus:outline-none">
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
