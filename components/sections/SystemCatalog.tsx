import { Reveal } from "@/components/ui/Reveal";
import { TechIconTile } from "@/components/ui/TechIcon";
import type { Solution } from "@/lib/content";

type Props = {
  groups: NonNullable<Solution["systemGroups"]>;
  pmsLabel: string;
};

/** Every system of a solution with a short description, one block per domain group. */
export function SystemCatalog({ groups, pmsLabel }: Props) {
  return (
    <div className="space-y-14">
      {groups.map((group) => (
        <section key={group.title} aria-label={group.title}>
          <Reveal className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-l-4 border-brand-500 pl-4">
            <h3 className="text-2xl font-bold">{group.title}</h3>
            <p className="text-muted-tint">{group.text}</p>
          </Reveal>
          <ul className="grid gap-4 md:grid-cols-2">
            {group.items.map((item) => (
              <Reveal as="li" key={item.name} id={`s-${item.icon}`} className="flex scroll-mt-28 gap-5 rounded-[var(--radius-card)] border border-border-soft bg-card p-5 shadow-card">
                <TechIconTile name={item.icon} className="size-12 rounded-xl" />
                <div>
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="mt-1 text-muted">{item.text}</p>
                  {item.pms && (
                    <span className="mt-3 inline-block rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand-600">{pmsLabel}</span>
                  )}
                </div>
              </Reveal>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
