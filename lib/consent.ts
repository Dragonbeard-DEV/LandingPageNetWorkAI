// Cookie consent state shared by the cookie banner and the analytics slot (client only).

export type Consent = "essential" | "all";

const STORAGE_KEY = "networkai-cookie-consent";
const CHANGE_EVENT = "networkai:consent-change";
const OPEN_EVENT = "networkai:open-cookie-settings";

export function readConsent(): Consent | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "essential" || value === "all" ? value : null;
  } catch {
    // Storage can be blocked (private mode, strict settings): behave as "not decided".
    return null;
  }
}

export function writeConsent(consent: Consent): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, consent);
  } catch {
    // Without storage the choice only lasts for this page view.
  }
  window.dispatchEvent(new CustomEvent<Consent>(CHANGE_EVENT, { detail: consent }));
}

export function onConsentChange(listener: (consent: Consent) => void): () => void {
  const handler = (event: Event) => listener((event as CustomEvent<Consent>).detail);
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
}

export function openCookieSettings(): void {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenCookieSettings(listener: () => void): () => void {
  window.addEventListener(OPEN_EVENT, listener);
  return () => window.removeEventListener(OPEN_EVENT, listener);
}
