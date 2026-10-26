import type { ReactNode } from "react";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "inverse";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

type LinkProps = CommonProps & { href: string };
type ButtonProps = CommonProps & {
  href?: undefined;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-control)] px-6 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-brand-500 text-white hover:bg-brand-600",
  secondary:
    "border border-border-strong bg-card text-strong hover:border-border-strong-hover hover:bg-soft",
  inverse: "bg-white text-brand-500 hover:bg-brand-soft focus-visible:outline-white",
};

function isExternal(href: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(href);
}

export function Button(props: LinkProps | ButtonProps) {
  const className = cn(base, variants[props.variant ?? "primary"], props.className);

  if (props.href !== undefined) {
    if (isExternal(props.href)) {
      return (
        <a href={props.href} className={className}>
          {props.children}
        </a>
      );
    }
    return (
      <Link href={props.href} className={className}>
        {props.children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      disabled={props.disabled}
      onClick={props.onClick}
      className={className}
    >
      {props.children}
    </button>
  );
}
