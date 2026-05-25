import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  active?: boolean;
  style?: CSSProperties;
}

export function SectionCard({ children, className, interactive, active, style }: SectionCardProps) {
  return (
    <section
      className={cn(
        "section-card",
        interactive && "interactive",
        active && "is-active",
        className
      )}
      style={style}
    >
      {children}
    </section>
  );
}
