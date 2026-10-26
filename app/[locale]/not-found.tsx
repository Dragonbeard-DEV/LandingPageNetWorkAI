import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="page-header">
      <Container className="flex min-h-[50vh] flex-col items-start justify-center py-20">
        <p className="text-sm font-semibold tracking-wide text-brand-500 uppercase">404</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-5xl">{t("title")}</h1>
        <p className="mt-4 text-lg text-muted-tint">{t("text")}</p>
        <Button href="/" className="mt-8">
          {t("home")}
        </Button>
      </Container>
    </div>
  );
}
