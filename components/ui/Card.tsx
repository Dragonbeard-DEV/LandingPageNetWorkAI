import Image from "next/image";
import type { ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/cn";
import type { TechIconName } from "@/lib/tech-icons";
import { TechIconTile } from "./TechIcon";

type Props = {
  title: string;
  description?: string;
  href?: string;
  image?: { src: string; alt: string };
  /** Shown instead of a photo on technology cards; the photo waits for the detail page. */
  icon?: TechIconName;
  /** Text before the title, e.g. a date or category. */
  meta?: string;
  /** Visible call to action at the bottom of a linked card. */
  linkLabel?: string;
  headingLevel?: "h2" | "h3";
  imageSizes?: string;
  children?: ReactNode;
  className?: string;
};

export function Card({
  title,
  description,
  href,
  image,
  icon,
  meta,
  linkLabel,
  headingLevel: Heading = "h3",
  imageSizes = "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw",
  children,
  className,
}: Props) {
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-border-soft bg-card shadow-card transition-shadow",
        href && "hover:shadow-panel",
        className,
      )}
    >
      {image && (
        <div className="relative aspect-[16/10] overflow-hidden bg-soft-strong">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={imageSizes}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {icon && <TechIconTile name={icon} className="mb-2" />}
        {meta &&<p className="text-sm font-medium text-muted">{meta}</p>}
        <Heading className="text-xl font-bold tracking-tight">
          {href ? (
            // The stretched link makes the whole card clickable while keeping one focus stop.
            <Link href={href} className="after:absolute after:inset-0 after:content-['']">
              {title}
            </Link>
          ) : (
            title
          )}
        </Heading>
        {description && <p className="text-muted">{description}</p>}
        {children}
        {href && linkLabel && (
          <p aria-hidden="true" className="mt-auto pt-2 font-semibold text-brand-500">
            {linkLabel} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
          </p>
        )}
      </div>
    </article>
  );
}
