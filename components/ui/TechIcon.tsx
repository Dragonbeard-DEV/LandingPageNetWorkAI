import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { TechIconName } from "@/lib/tech-icons";

const drawings: Record<TechIconName, ReactNode> = {
  design: (
    <>
      <path d="M4 4h16v16H4z" />
      <path d="M4 9h5m-5 6h5M9 4v16" />
      <path d="m13 15 4-6 1.5 1-4 6-2 1z" />
    </>
  ),
  elv: (
    <>
      <path d="m3 8 13-4 2 6-13 4z" />
      <path d="m18 8 3-1v5l-3 1" />
      <path d="M8 13v3a2 2 0 0 1-2 2H3" />
      <path d="M3 15v6" />
    </>
  ),
  hospitality: (
    <>
      <path d="M3 19V6" />
      <path d="M3 15h18v4" />
      <path d="M21 15v-2a3 3 0 0 0-3-3h-7v5" />
      <circle cx="7" cy="11.5" r="2" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="5" cy="19" r="2.5" />
      <circle cx="19" cy="19" r="2.5" />
      <path d="M12 7.5V13m0 0-5.5 4M12 13l5.5 4" />
    </>
  ),
  datacenter: (
    <>
      <rect x="4" y="3" width="16" height="5" rx="1" />
      <rect x="4" y="10" width="16" height="5" rx="1" />
      <path d="M7.5 5.5h.01M7.5 12.5h.01M12 5.5h5M12 12.5h5" />
      <path d="M12 15v6M5 21h14" />
    </>
  ),
  "smart-building": (
    <>
      <path d="M5 21V9h9v12" />
      <path d="M3 21h13" />
      <path d="M8 12.5h3M8 16h3" />
      <path d="M17 8a3 3 0 0 1 3 3M17 4a7 7 0 0 1 7 7" transform="translate(-3 -1)" />
    </>
  ),
  supervision: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2H9z" />
      <path d="m9 13.5 2 2 4-4.5" />
    </>
  ),
  cabling: (
    <>
      <path d="M7 3v5M11 3v5" />
      <rect x="5" y="8" width="8" height="5" rx="1" />
      <path d="M9 13v3a4 4 0 0 0 4 4h2a4 4 0 0 0 4-4V9" />
      <rect x="16.5" y="4" width="5" height="5" rx="1" />
    </>
  ),
  operations: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="13" width="4" height="6" rx="1.5" />
      <rect x="17" y="13" width="4" height="6" rx="1.5" />
      <path d="M19 19a3 3 0 0 1-3 3h-3" />
    </>
  ),
  compliance: (
    <>
      <path d="M12 3 5 6v5.5c0 4.5 3 7.5 7 9.5 4-2 7-5 7-9.5V6z" />
      <path d="m9 12 2.2 2.2L15.5 10" />
    </>
  ),
  "design-build": (
    <>
      <path d="M3 21h18" />
      <path d="M5 21v-8l7-5 7 5v8" />
      <path d="M12 8V3" />
      <path d="M12 3h6l-2 2.5" />
      <path d="M10 21v-5h4v5" />
    </>
  ),
  "smart-home": (
    <>
      <path d="m3 11 9-7 9 7" />
      <path d="M5.5 9.5V20h13V9.5" />
      <path d="M9.5 13.5a3.6 3.6 0 0 1 5 0" />
      <path d="M11 16a1.5 1.5 0 0 1 2 0" />
      <path d="M12 18h.01" />
    </>
  ),
  "server-room": (
    <>
      <rect x="4" y="3" width="16" height="5" rx="1" />
      <rect x="4" y="10" width="16" height="5" rx="1" />
      <rect x="4" y="17" width="16" height="4" rx="1" />
      <path d="M7.5 5.5h.01M7.5 12.5h.01" />
    </>
  ),
  fiber: (
    <>
      <path d="M2 7h7l3 5h10M2 17h7l3-5" />
      <path d="m19 9 3 3-3 3" />
    </>
  ),
  storage: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" />
    </>
  ),
  "data-security": (
    <>
      <path d="M12 3 5 6v5.5c0 4.5 3 7.5 7 9.5 4-2 7-5 7-9.5V6z" />
      <circle cx="12" cy="11" r="1.6" />
      <path d="M12 12.6V15" />
    </>
  ),
  lan: (
    <>
      <rect x="9" y="3" width="6" height="5" rx="1" />
      <rect x="3" y="16" width="6" height="5" rx="1" />
      <rect x="15" y="16" width="6" height="5" rx="1" />
      <path d="M12 8v4M6 16v-4h12v4" />
    </>
  ),
  wifi: (
    <>
      <path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0" />
      <circle cx="12" cy="19.5" r="1" />
    </>
  ),
  hsia: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
    </>
  ),
  pbx: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  tv: (
    <>
      <rect x="3" y="7" width="18" height="11" rx="2" />
      <path d="m8 3 4 4 4-4M8 21h8" />
    </>
  ),
  signage: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4M7 12l3-3 3 2 4-4" />
    </>
  ),
  av: (
    <>
      <rect x="3" y="3" width="18" height="11" rx="1" />
      <path d="M12 14v4M8 21l4-3 4 3M7 9h4" />
    </>
  ),
  intercom: (
    <>
      <path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z" />
      <path d="M10 21h4" />
    </>
  ),
  cctv: (
    <>
      <rect x="3" y="7" width="13" height="10" rx="2" />
      <path d="m16 11 5-3v8l-5-3z" />
    </>
  ),
  "access-control": (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      <circle cx="12" cy="16" r="1.2" />
    </>
  ),
  "public-address": (
    <>
      <path d="M4 10v4h4l6 4V6l-6 4z" />
      <path d="M17 9a4 4 0 0 1 0 6M19.5 6.5a8 8 0 0 1 0 11" />
    </>
  ),
  parking: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M10 16V8h3a2.5 2.5 0 0 1 0 5h-3" />
    </>
  ),
};

type Props = {
  name: TechIconName;
  className?: string;
};

/** Line icon for a core technology. Decorative: the text next to it carries the meaning. */
export function TechIcon({ name, className }: Props) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-7", className)}
    >
      {drawings[name]}
    </svg>
  );
}

/** The icon on its tinted tile, as used on cards. */
export function TechIconTile({ name, className }: Props) {
  return (
    <span className={cn("flex size-14 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand-500", className)}>
      <TechIcon name={name} />
    </span>
  );
}
