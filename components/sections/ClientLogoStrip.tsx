import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import type { Partner } from "@/lib/content";

type Props = {
  label: string;
  clients: Partner[];
};

/** A quiet band of hotel-group logos right under the hero: proof before the visitor reads anything else. */
export async function ClientLogoStrip({ label, clients }: Props) {
  const t = await getTranslations("partners");

  return (
    <section aria-labelledby="clients-label" className="border-b border-border-soft bg-card py-8 md:py-10">
      <Container>
        <p id="clients-label" className="mb-6 text-center text-sm font-semibold tracking-wide text-muted uppercase">
          {label}
        </p>
        <ul className="grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-4 lg:grid-cols-8">
          {clients.map((client) => (
            <li key={client.name} className="relative h-10">
              <Image
                src={client.logo}
                alt={t("logoAlt", { name: client.name })}
                fill
                sizes="140px"
                className="object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
