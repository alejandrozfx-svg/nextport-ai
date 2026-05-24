import { cn } from "@/lib/utils";

type StatusTone = "risk" | "warn" | "ok" | "brand" | "neutral" | "review";

interface StatusChipProps {
  tone?: StatusTone;
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
}

export function StatusChip({ tone = "neutral", children, className, pulse }: StatusChipProps) {
  return (
    <span className={cn("chip", `chip-${tone}`, pulse && "pulse-risk", className)}>
      <span className="dot" />
      {children}
    </span>
  );
}
