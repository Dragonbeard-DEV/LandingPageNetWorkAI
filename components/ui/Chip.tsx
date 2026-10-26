import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
};

export function Chip({ children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border-soft bg-soft px-4 py-2 text-sm font-medium text-strong",
        className,
      )}
    >
      {children}
    </span>
  );
}
