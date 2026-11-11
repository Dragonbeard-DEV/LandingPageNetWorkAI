"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/cn";
import { siteConfig, type NavLink } from "@/site.config";
import { LanguageSwitcher } from "./LanguageSwitcher";

export type HeaderSegment = { slug: string; title: string };

type Props = {
  segments: HeaderSegment[];
};

type ResolvedItem =
  | { kind: "link"; key: string; label: string; href: string }
  | { kind: "group"; key: string; label: string; children: { label: string; href: string }[] };

const SCROLLED_THRESHOLD_PX = 16;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

function navToneClass(isOnDark: boolean, isActive: boolean): string {
  if (isOnDark) return cn("hover:text-header-accent focus-visible:outline-white", isActive ? "text-header-accent" : "text-white");
  return cn("hover:text-brand-500", isActive ? "text-brand-500" : "text-strong");
}

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function useResolvedNav(segments: HeaderSegment[]): ResolvedItem[] {
  const t = useTranslations("nav");
  const label = (link: NavLink) => ({ label: t(link.key), href: link.href });

  return siteConfig.nav.map((item): ResolvedItem => {
    if (item.kind === "link") return { kind: "link", key: item.key, label: t(item.key), href: item.href };
    if (item.kind === "group") {
      return { kind: "group", key: item.key, label: t(item.key), children: item.children.map(label) };
    }
    return {
      kind: "group",
      key: item.key,
      label: t(item.key),
      children: [
        { label: t("allSegments"), href: item.href },
        ...segments.map((segment) => ({ label: segment.title, href: `${item.href}/${segment.slug}` })),
      ],
    };
  });
}

function Dropdown({ item, pathname, isOnDark }: { item: Extract<ResolvedItem, { kind: "group" }>; pathname: string; isOnDark: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // Set when a mouse hover opened the panel, so the following click does not immediately close it.
  const openedByHoverRef = useRef(false);
  const isActive = item.children.some((child) => isActivePath(pathname, child.href));

  useEffect(() => {
    if (!isOpen) return;
    const handlePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  return (
    <li
      ref={rootRef}
      className="relative"
      // Hover only for real mouse pointers; touch devices emulate mouseenter before click.
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse" || isOpen) return;
        openedByHoverRef.current = true;
        setIsOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        openedByHoverRef.current = false;
        setIsOpen(false);
      }}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setIsOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => {
          if (openedByHoverRef.current) {
            openedByHoverRef.current = false;
            return;
          }
          setIsOpen((open) => !open);
        }}
        className={cn("inline-flex min-h-10 items-center gap-1 rounded-lg px-3 text-[0.95rem] font-medium transition-colors", navToneClass(isOnDark, isActive))}
      >
        {item.label}
        <svg aria-hidden="true" viewBox="0 0 20 20" className={cn("size-4 transition-transform", isOpen && "rotate-180")}>
          <path fill="currentColor" d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z" />
        </svg>
      </button>
      <div id={panelId} hidden={!isOpen} className="absolute top-full left-0 z-50 pt-2">
        <ul className="min-w-60 rounded-[var(--radius-card)] border border-border-soft bg-card p-2 shadow-panel">
          {item.children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                aria-current={pathname === child.href ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-4 py-2.5 text-body hover:bg-soft hover:text-brand-500 aria-[current=page]:text-brand-500"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function MobileMenu({ items, pathname, onClose }: { items: ResolvedItem[]; pathname: string; onClose: () => void }) {
  const t = useTranslations("header");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Everything behind the dialog becomes inert, which keeps Tab and screen readers inside it.
    const background = [...document.body.children].filter((node): node is HTMLElement => node instanceof HTMLElement && !node.hasAttribute("data-mobile-menu"));
    background.forEach((node) => (node.inert = true));
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    // The overlay is hidden at lg and up, so close it if the viewport grows while it is open.
    const desktop = window.matchMedia("(min-width: 1024px)");
    const handleResize = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };
    document.addEventListener("keydown", handleKey);
    desktop.addEventListener("change", handleResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      background.forEach((node) => (node.inert = false));
      document.removeEventListener("keydown", handleKey);
      desktop.removeEventListener("change", handleResize);
    };
  }, [onClose]);

  const linkClass = "block rounded-lg px-3 py-3 text-lg font-semibold text-strong hover:bg-soft aria-[current=page]:text-brand-500";

  return (
    <div
      data-mobile-menu=""
      role="dialog"
      aria-modal="true"
      aria-label={t("menu")}
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-card lg:hidden"
    >
      <div className="flex h-[var(--header-height)] shrink-0 items-center justify-between border-b border-border-soft px-[var(--gutter)]">
        <LanguageSwitcher />
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t("closeMenu")}
          className="inline-flex size-11 items-center justify-center rounded-lg text-strong hover:bg-soft"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
            <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      <nav aria-label={t("mainNav")} className="px-[var(--gutter)] py-6">
        <ul className="space-y-1">
          {items.map((item) =>
            item.kind === "link" ? (
              <li key={item.key}>
                <Link href={item.href} onClick={onClose} aria-current={isActivePath(pathname, item.href) ? "page" : undefined} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ) : (
              <li key={item.key} className="py-2">
                <p className="px-3 pb-1 text-sm font-semibold tracking-wide text-muted uppercase">{item.label}</p>
                <ul>
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        onClick={onClose}
                        aria-current={pathname === child.href ? "page" : undefined}
                        className="block rounded-lg px-3 py-2.5 text-base font-medium text-body hover:bg-soft aria-[current=page]:text-brand-500"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            ),
          )}
        </ul>
      </nav>
    </div>
  );
}

export function Header({ segments }: Props) {
  const t = useTranslations("header");
  const pathname = usePathname();
  const items = useResolvedNav(segments);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const isOnDark = !useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > SCROLLED_THRESHOLD_PX,
    () => false,
  );
  const fadeClass = "transition-opacity duration-300 motion-reduce:transition-none";

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    // Wait for the background to leave the inert state before moving focus back.
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft bg-card">
      {/* A gradient cannot transition by itself, so it sits on its own layer and fades over the white header, covering its border too. */}
      <div data-header-dark-layer="" aria-hidden="true" className={cn("header-dark-layer absolute inset-x-0 top-0 -bottom-px -z-10", fadeClass, isOnDark ? "opacity-100" : "opacity-0")} />
      <div className="mx-auto flex h-[var(--header-height)] max-w-[var(--container-max)] items-center justify-between gap-4 px-[var(--gutter)]">
        <Link
          href="/"
          className={cn("relative shrink-0 rounded-lg", isOnDark && "focus-visible:outline-white")}
          aria-label={t("homeLink", { name: siteConfig.name })}
        >
          <Image src={siteConfig.logo.header} alt="" width={231} height={48} className={cn("h-10 md:h-12", fadeClass, isOnDark ? "opacity-0" : "opacity-100")} style={{ width: "auto" }} />
          <Image
            src={siteConfig.logo.headerOnDark}
            alt=""
            width={231}
            height={48}
            preload
            className={cn("absolute top-0 left-0 h-10 md:h-12", fadeClass, isOnDark ? "opacity-100" : "opacity-0")}
            style={{ width: "auto" }}
          />
        </Link>

        <nav aria-label={t("mainNav")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) =>
              item.kind === "link" ? (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                    className={cn("inline-flex min-h-10 items-center rounded-lg px-3 text-[0.95rem] font-medium transition-colors", navToneClass(isOnDark, isActivePath(pathname, item.href)))}
                  >
                    {item.label}
                  </Link>
                </li>
              ) : (
                <Dropdown key={item.key} item={item} pathname={pathname} isOnDark={isOnDark} />
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden lg:flex" isOnDark={isOnDark} />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-expanded={isMenuOpen}
            aria-label={t("openMenu")}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-lg transition-colors lg:hidden",
              isOnDark ? "text-white hover:bg-white/10 focus-visible:outline-white" : "text-strong hover:bg-soft",
            )}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6">
              <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Portal: the overlay must be a direct child of body so that everything else can become inert. */}
      {isMenuOpen && createPortal(<MobileMenu items={items} pathname={pathname} onClose={closeMenu} />, document.body)}
    </header>
  );
}
