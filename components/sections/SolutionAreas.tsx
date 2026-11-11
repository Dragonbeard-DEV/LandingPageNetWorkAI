import { Reveal } from "@/components/ui/Reveal";
import { TechIcon } from "@/components/ui/TechIcon";
import type { Solution } from "@/lib/content";
import { Link } from "@/lib/i18n/navigation";

type Props = {
  groups: NonNullable<Solution["systemGroups"]>;
  linkLabel: string;
};

/** The system groups as the main solution areas: each card lists its systems and links to the matching solution page. */
export function SolutionAreas({ groups, linkLabel }: Props) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {groups.map((group) => (
        <Reveal
          as="li"
          key={group.title}
          className="group relative flex flex-col rounded-[var(--radius-card)] border border-border-soft bg-card p-6 shadow-card transition-shadow hover:shadow-panel"
        >
          <h3 className="text-xl font-bold tracking-tight">
            {group.solution ? (
              // The stretched link makes the whole card clickable while keeping one focus stop.
              <Link href={`/solutions/${group.solution}`} className="after:absolute after:inset-0 after:content-['']">
                {group.title}
              </Link>
            ) : (
              group.title
            )}
          </h3>
          <p className="mt-2 text-muted">{group.text}</p>
          <ul className="mt-5 flex-1 divide-y divide-border-soft border-t border-border-soft">
            {group.items.map((item) => (
              <li key={item.name} className="flex items-center gap-3 py-3 text-strong">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand-500">
                  <TechIcon name={item.icon} className="size-5" />
                </span>
                {item.name}
              </li>
            ))}
          </ul>
          {group.solution && (
            <p aria-hidden="true" className="mt-4 font-semibold text-brand-500">
              {linkLabel} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </p>
          )}
        </Reveal>
      ))}
    </ul>
  );
}
