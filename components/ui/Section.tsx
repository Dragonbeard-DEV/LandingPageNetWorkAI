import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";
import { Reveal } from "./Reveal";

type Tone = "page" | "alt" | "card";

type Props = {
  children: ReactNode;
  id?: string;
  tone?: Tone;
  eyebrow?: string;
  title?: string;
  intro?: string;
  /** Element used for the title; pages that already have an h1 use h2 (default). */
  titleAs?: "h1" | "h2";
  className?: string;
};

const toneClass: Record<Tone, string> = {
  page: "bg-page",
  alt: "bg-page-alt",
  card: "bg-card",
};

export function Section({
  children,
  id,
  tone = "page",
  eyebrow,
  title,
  intro,
  titleAs: Title = "h2",
  className,
}: Props) {
  const hasHeading = Boolean(eyebrow || title || intro);
  const headingId = id && title ? `${id}-title` : undefined;
  // Tinted sections need the darker muted tone to keep 4.5:1 contrast.
  const introClass = tone === "card" ? "text-muted" : "text-muted-tint";

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("py-[var(--section-space)]", toneClass[tone], className)}
    >
      <Container>
        {hasHeading && (
          <Reveal className="mb-10 max-w-3xl md:mb-14">
            {eyebrow && (
              <p className="mb-3 text-sm font-semibold tracking-wide text-brand-500 uppercase">
                {eyebrow}
              </p>
            )}
            {title && (
              <Title id={headingId} className="text-3xl font-bold tracking-tight md:text-4xl">
                {title}
              </Title>
            )}
            {intro && <p className={cn("mt-4 text-lg", introClass)}>{intro}</p>}
          </Reveal>
        )}
        {children}
      </Container>
    </section>
  );
}
