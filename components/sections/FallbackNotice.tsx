import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";

type Props = {
  isFallback: boolean;
};

/** Shown when a record has no file for the current locale and the default-locale version is displayed. */
export async function FallbackNotice({ isFallback }: Props) {
  if (!isFallback) return null;
  const t = await getTranslations("common");
  return (
    <Container className="pt-6">
      <p role="note" className="rounded-[var(--radius-control)] border border-border-soft bg-brand-soft px-4 py-3 text-sm text-strong">
        {t("fallbackNotice")}
      </p>
    </Container>
  );
}
