import { cn } from "@/lib/utils";

interface SectionCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  active?: boolean;
}

export function SectionCard({ children, className, interactive, active }: SectionCardProps) {
  return (
    <section
      className={cn(
        "section-card",
        interactive && "interactive",
        active && "is-active",
        className
      )}
    >
      {children}
    </section>
  );
}
