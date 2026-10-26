import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "@/site.config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
