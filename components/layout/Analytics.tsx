"use client";

import { useEffect, useState } from "react";
import { onConsentChange, readConsent } from "@/lib/consent";

const isEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true";

/**
 * Analytics slot. Renders nothing until NEXT_PUBLIC_ANALYTICS_ENABLED=true AND the visitor chose "Accept all".
 * To add a provider, render its script inside the `hasConsent` branch (e.g. with next/script).
 */
export function Analytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    if (!isEnabled) return;
    // Consent lives in localStorage, which only exists after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasConsent(readConsent() === "all");
    return onConsentChange((consent) => setHasConsent(consent === "all"));
  }, []);

  if (!isEnabled || !hasConsent) return null;
  // Provider script goes here once one is chosen.
  return null;
}
