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
] as const;

export type TechIconName = (typeof techIconNames)[number];
