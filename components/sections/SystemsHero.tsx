import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { TechIcon } from "@/components/ui/TechIcon";
import type { Solution } from "@/lib/content";
import { Link } from "@/lib/i18n/navigation";

type Crumb = { label: string; href: string };
type Action = { label: string; href: string };

type Props = {
  eyebrow: string;
  title: string;
  lead: string;
  breadcrumbs: Crumb[];
  breadcrumbLabel: string;
  primary: Action;
  secondary: Action;
  groups: NonNullable<Solution["systemGroups"]>;
  /** Accessible name of the icon grid, which jumps to each system further down the page. */
  systemsLabel: string;
};

/** Dark showcase header: the promise on the left, every system as a shortcut tile on the right. */
export function SystemsHero({ eyebrow, title, lead, breadcrumbs, breadcrumbLabel, primary, secondary, groups, systemsLabel }: Props) {
  const items = groups.flatMap((group) => group.items);

  return (
    <div className="tech-grid text-white">
      <Container className="grid items-center gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div>
          <nav aria-label={breadcrumbLabel} className="mb-6 text-sm">
            <ol className="flex flex-wrap items-center gap-2 text-white/60">
              {breadcrumbs.map((crumb) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  <Link href={crumb.href} className="hover:text-white">
                    {crumb.label}
                  </Link>
                  <span aria-hidden="true">/</span>
                </li>
              ))}
            </ol>
          </nav>
          <p className="mb-3 text-sm font-semibold tracking-wide text-header-accent uppercase">{eyebrow}</p>
          <h1 className="text-4xl leading-tight font-extrabold tracking-tight text-white md:text-5xl">{title}</h1>
          <p className="mt-5 max-w-xl text-lg text-white/75">{lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={primary.href}>{primary.label}</Button>
            <Button href={secondary.href} variant="outlineInverse">
              {secondary.label}
            </Button>
          </div>
        </div>

        <nav aria-label={systemsLabel}>
          <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {items.map((item) => (
              <li key={item.icon}>
                <a
                  href={`#s-${item.icon}`}
                  className="flex h-full flex-col items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-2 py-3.5 text-center text-xs leading-snug text-white/85 backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-header-accent hover:text-white motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <TechIcon name={item.icon} className="size-6 text-header-accent" />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </div>
  );
}
