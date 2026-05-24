import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = Math.max(max - min, 1);
  const d = points.map((point, index) => {
    const x = (index / Math.max(points.length - 1, 1)) * 100;
    const y = 24 - ((point - min) / span) * 20;
    return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(" ");

  return (
    <svg className="stat-sparkline" viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true">
      <path d={`${d} L 100 28 L 0 28 Z`} fill={color} opacity="0.08" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

interface MetricCardProps {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  color?: string;
  icon?: ReactNode;
  active?: boolean;
  onClick?: () => void;
  sparkPoints?: number[];
  className?: string;
}

export function MetricCard({
  label,
  value,
  sub,
  color = "var(--ink)",
  icon,
  active,
  onClick,
  sparkPoints,
  className,
}: MetricCardProps) {
  const fallbackSpark = typeof value === "number"
    ? [Math.max(0, value - 2), value + 1, Math.max(0, value - 1), value + 2, value + 1, value + 3]
    : [8, 9, 8, 11, 10, 12];
  const points = sparkPoints ?? fallbackSpark;

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={cn("metric-card p-4", onClick && "cursor-pointer", active && "is-active", className)}
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-[var(--ink-4)]">{label}</p>
        {icon && <span style={{ color }}>{icon}</span>}
      </div>
      <div className="mt-1 text-[24px] font-semibold leading-none tabular" style={{ color }}>
        {value}
      </div>
      {sub && <p className="mt-1 text-xs text-[var(--ink-4)]">{sub}</p>}
      <Sparkline points={points} color={color === "var(--ink)" ? "var(--brand)" : color} />
    </div>
  );
}
