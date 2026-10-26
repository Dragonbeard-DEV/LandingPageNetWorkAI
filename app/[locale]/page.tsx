import { getTranslations } from "next-intl/server";
import { PageHeader } from "@/components/sections/PageHeader";
import { resolveLocale } from "@/lib/i18n/params";

// Replaced by the full home page in phase 5.
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  await resolveLocale(params);
  const t = await getTranslations("meta");
  return <PageHeader title={t("tagline")} lead={t("description")} />;
}
