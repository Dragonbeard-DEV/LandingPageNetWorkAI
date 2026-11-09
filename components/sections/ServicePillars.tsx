import { Reveal } from "@/components/ui/Reveal";
import { TechIconTile } from "@/components/ui/TechIcon";
import type { Entry, Service } from "@/lib/content";
import { Link } from "@/lib/i18n/navigation";

type Props = {
  services: Entry<Service>[];
  linkLabel: string;
};

/** The services overview: numbered cards with the main work each covers, linking to the detail page. */
export function ServicePillars({ services, linkLabel }: Props) {
  return (
    <ul className="grid gap-6 md:grid-cols-2">
      {services.map((service, index) => (
        <Reveal
          as="li"
          key={service.slug}
          className="group relative flex flex-col rounded-[var(--radius-card)] border border-border-soft bg-card p-6 shadow-card transition-shadow hover:shadow-panel md:p-8"
        >
          <div className="mb-5 flex items-center justify-between">
            <TechIconTile name={service.icon} />
            <span aria-hidden="true" className="text-sm font-semibold text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h2 className="text-xl font-bold">
            {/* The stretched link makes the whole card clickable while keeping one focus stop. */}
            <Link href={`/services/${service.slug}`} className="after:absolute after:inset-0 after:content-['']">
              {service.title}
            </Link>
          </h2>
          <p className="mt-2 text-muted">{service.description}</p>
          <ul className="mt-5 mb-6 divide-y divide-border-soft border-t border-border-soft">
            {service.highlights.map((point) => (
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
          <p aria-hidden="true" className="mt-auto font-semibold text-brand-500">
            {linkLabel} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </p>
        </Reveal>
      ))}
    </ul>
  );
}
