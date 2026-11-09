import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { TechIconTile } from "@/components/ui/TechIcon";
import type { Page } from "@/lib/content";

type Props = {
  services: NonNullable<Page["services"]>;
  buttonLabel: string;
};

/** The four service pillars: numbered cards with the main work each one covers. */
export function ServicePillars({ services, buttonLabel }: Props) {
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {services.map((service, index) => (
        <Reveal
          as="li"
          key={service.name}
          className="flex flex-col rounded-[var(--radius-card)] border border-border-soft bg-card p-6 shadow-card md:p-8"
        >
          <div className="mb-5 flex items-center justify-between">
            <TechIconTile name={service.icon} />
            <span aria-hidden="true" className="text-sm font-semibold text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="text-xl font-bold">{service.name}</h3>
          <p className="mt-2 text-muted">{service.description}</p>
          <ul className="mt-5 mb-6 divide-y divide-border-soft border-t border-border-soft">
            {service.points.map((point) => (
              <li key={point} className="flex items-start gap-3 py-2.5">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mt-1 size-4 shrink-0 text-brand-500"
                >
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <Button href="/contact" variant="secondary" className="mt-auto self-start">
            {buttonLabel}
            <span className="sr-only">: {service.name}</span>
          </Button>
        </Reveal>
      ))}
    </ul>
  );
}
