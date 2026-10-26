import { Card } from "@/components/ui/Card";
import { Reveal } from "@/components/ui/Reveal";
import type { Entry, Project } from "@/lib/content";

type Props = {
  projects: Entry<Project>[];
  linkLabel: string;
  headingLevel?: "h2" | "h3";
};

export function ProjectGrid({ projects, linkLabel, headingLevel = "h3" }: Props) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <Reveal as="li" key={project.slug}>
          <Card
            href={`/projects/${project.slug}`}
            title={project.title}
            description={project.summary}
            image={project.coverImage}
            meta={`${project.location} · ${project.year}`}
            linkLabel={linkLabel}
            headingLevel={headingLevel}
          />
        </Reveal>
      ))}
    </ul>
  );
}
