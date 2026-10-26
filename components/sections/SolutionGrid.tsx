import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import type { Entry, Solution } from "@/lib/content";

type Props = {
  solutions: Entry<Solution>[];
  linkLabel: string;
  headingLevel?: "h2" | "h3";
};

export function SolutionGrid({ solutions, linkLabel, headingLevel = "h3" }: Props) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {solutions.map((solution) => (
        <Reveal as="li" key={solution.slug}>
          <Card
            href={`/solutions/${solution.slug}`}
            title={solution.title}
            description={solution.tagline}
            image={solution.image}
            linkLabel={linkLabel}
            headingLevel={headingLevel}
          />
        </Reveal>
      ))}
    </ul>
  );
}
