import { MdxContent } from "@/components/sections/MdxContent";
import type { MdxSection } from "@/lib/content";

type Props = {
  sections: MdxSection[];
};

/** Expanding sections with the first one open. The shared `name` lets the browser keep one open at a time, with no client JS. */
export function AboutAccordion({ sections }: Props) {
  return (
    <div className="divide-y divide-border-soft border-b border-border-soft">
      {sections.map((section, index) => (
        <details key={section.title} name="about-sections" open={index === 0} className="group">
          <summary className="flex cursor-pointer list-none items-center gap-5 py-5 [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center bg-strong text-white transition-colors group-open:bg-brand-500">
              <svg viewBox="0 0 16 16" className="size-4">
                <path d="M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M8 2v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="group-open:hidden" />
              </svg>
            </span>
            <h2 className="text-2xl font-normal text-strong">{section.title}</h2>
          </summary>
          <MdxContent source={section.body} className="pb-8" />
        </details>
      ))}
    </div>
  );
}
