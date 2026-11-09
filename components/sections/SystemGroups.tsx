import { Reveal } from "@/components/ui/Reveal";
import { TechIcon } from "@/components/ui/TechIcon";
import type { Page } from "@/lib/content";

type Props = {
  groups: NonNullable<Page["systems"]>["groups"];
  pmsLabel: string;
};

/** ELV systems in four domain columns; systems linked to the hotel PMS carry a small tag. */
export function SystemGroups({ groups, pmsLabel }: Props) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {groups.map((group) => (
        <Reveal
          as="li"
          key={group.title}
          className="rounded-[var(--radius-card)] border border-t-4 border-border-soft border-t-brand-500 bg-card px-5 pt-5 pb-2 shadow-card"
        >
          <h3 className="text-lg font-bold">{group.title}</h3>
          <p className="mt-1 mb-3 text-sm text-muted">{group.text}</p>
          <ul>
            {group.items.map((item) => (
              <li key={item.name} className="flex items-start gap-3 border-t border-border-soft py-3 text-[0.95rem] leading-snug">
                <TechIcon name={item.icon} className="size-6 shrink-0 text-brand-500" />
                <span className="flex flex-col items-start gap-1.5">
                  {item.name}
                  {item.pms && <span className="rounded-full bg-brand-soft px-2 py-0.5 text-xs font-medium text-brand-600">{pmsLabel}</span>}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </ul>
  );
}
