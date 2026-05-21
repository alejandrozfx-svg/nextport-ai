import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  color?: string;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ value, color, className, showLabel }: ProgressBarProps) {
  const clamp = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--hair)" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${clamp}%`, background: color ?? "var(--brand)" }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono" style={{ color: "var(--ink-3)" }}>
          {clamp}%
        </span>
      )}
    </div>
  );
}
