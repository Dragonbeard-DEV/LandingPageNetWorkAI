// Icon names content files may reference; drawings live in components/ui/TechIcon.tsx.
export const techIconNames = [
  "design",
  "elv",
  "hospitality",
  "network",
  "datacenter",
  "smart-building",
  "supervision",
  "cabling",
  "operations",
  "compliance",
  "design-build",
  "smart-home",
  // ELV systems on the home page
  "server-room",
  "fiber",
  "storage",
  "data-security",
  "lan",
  "wifi",
  "hsia",
  "pbx",
  "tv",
  "signage",
  "av",
  "intercom",
  "cctv",
  "access-control",
  "public-address",
  "parking",
] as const;

export type TechIconName = (typeof techIconNames)[number];
