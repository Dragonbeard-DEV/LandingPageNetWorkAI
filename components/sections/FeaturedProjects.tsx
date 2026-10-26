import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import type { Entry, Project } from "@/lib/content";
import { ProjectGrid } from "./ProjectGrid";

type Props = {
  projects: Entry<Project>[];
  eyebrow: string;
  title: string;
  linkLabel: string;
  viewAllLabel: string;
};

/** Home block: up to three featured projects and a link to the full list. */
export function FeaturedProjects({ projects, eyebrow, title, linkLabel, viewAllLabel }: Props) {
  if (projects.length === 0) return null;
  return (
    <Section id="featured-projects" eyebrow={eyebrow} title={title}>
      <ProjectGrid projects={projects} linkLabel={linkLabel} />
      <div className="mt-10">
        <Button href="/projects" variant="secondary">
          {viewAllLabel}
        </Button>
      </div>
    </Section>
  );
}
