import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Link } from "@/lib/i18n/navigation";

type Crumb = { label: string; href: string };

type Props = {
  title: string;
  eyebrow?: string;
  lead?: string;
  breadcrumbs?: Crumb[];
  breadcrumbLabel?: string;
  children?: ReactNode;
};

/** Top band of every sub-page: light gradient, breadcrumb trail and the page h1. */
export function PageHeader({ title, eyebrow, lead, breadcrumbs, breadcrumbLabel, children }: Props) {
  return (
    <div className="page-header border-b border-border-soft">
      <Container className="py-12 md:py-20">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label={breadcrumbLabel} className="mb-6 text-sm">
            <ol className="flex flex-wrap items-center gap-2 text-muted-tint">
              {breadcrumbs.map((crumb) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  <Link href={crumb.href} className="hover:text-brand-500">
                    {crumb.label}
                  </Link>
                  <span aria-hidden="true">/</span>
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="mb-3 text-sm font-semibold tracking-wide text-brand-500 uppercase">{eyebrow}</p>}
        <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
        {lead && <p className="mt-5 max-w-3xl text-lg text-muted-tint md:text-xl">{lead}</p>}
        {children}
      </Container>
    </div>
  );
}
