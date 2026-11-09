import { Reveal } from "@/components/ui/Reveal";
import { TechIcon } from "@/components/ui/TechIcon";
import type { Solution } from "@/lib/content";

type Props = {
  groups: NonNullable<Solution["systemGroups"]>;
};

/** Compact overview of the system groups for the home page; the full catalogue lives on the solution page. */
export function SystemGroups({ groups }: Props) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {groups.map((group) => (
        <Reveal
          as="li"
          key={group.title}
          className="flex flex-col rounded-[var(--radius-card)] border border-t-4 border-border-soft border-t-brand-500 bg-card p-6 shadow-card"
        >
          <h3 className="text-lg font-bold">{group.title}</h3>
          <p className="mt-1 text-sm text-muted">{group.text}</p>
          <ul className="mt-5 space-y-3 border-t border-border-soft pt-5">
            {group.items.map((item) => (
              <li key={item.name} className="flex items-center gap-2 text-sm text-strong">
                <TechIcon name={item.icon} className="size-5 shrink-0 text-brand-500" />
                {item.name}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </ul>
  );
}
