import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/Reveal";
import type { Partner } from "@/lib/content";

type Props = {
  partners: Partner[];
};

export async function PartnerGrid({ partners }: Props) {
  const t = await getTranslations("partners");
  const footer = await getTranslations("footer");

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {partners.map((partner) => (
        <Reveal as="li" key={partner.name}>
          <a
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full flex-col items-center gap-4 rounded-[var(--radius-card)] border border-border-soft bg-card p-6 text-center shadow-card transition-shadow hover:shadow-panel"
          >
            <span className="relative block h-16 w-full">
              <Image src={partner.logo} alt={t("logoAlt", { name: partner.name })} fill sizes="200px" className="object-contain" />
            </span>
            <span className="text-sm font-semibold text-strong">{partner.name}</span>
            {partner.description && <span className="text-sm text-muted">{partner.description}</span>}
            <span className="sr-only">
              {t("visit", { name: partner.name })} ({footer("opensInNewTab")})
            </span>
          </a>
        </Reveal>
      ))}
    </ul>
  );
}
