import { AlertOctagon, AlertTriangle, Info } from "lucide-react";
import type { ExceptionFlag } from "@/types";

const kindConfig = {
  risk: { icon: AlertOctagon, color: "var(--risk)", bg: "var(--risk-soft)", border: "oklch(0.70 0.16 25 / 0.25)", label: "Risk" },
  warn: { icon: AlertTriangle, color: "var(--warn)", bg: "var(--warn-soft)", border: "oklch(0.82 0.14 78 / 0.25)", label: "Warning" },
  review: { icon: Info, color: "var(--brand)", bg: "var(--brand-soft)", border: "oklch(0.78 0.09 235 / 0.25)", label: "Review" },
};

interface ExceptionCardProps {
  exception: ExceptionFlag;
}

export function ExceptionCard({ exception }: ExceptionCardProps) {
  const config = kindConfig[exception.kind] ?? kindConfig.review;
  const Icon = config.icon;

  return (
    <div
      className="p-3 rounded-xl"
      style={{ background: config.bg, border: `1px solid ${config.border}` }}
    >
      <div className="flex items-start gap-2">
        <Icon size={14} style={{ color: config.color, flexShrink: 0, marginTop: 2 }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded"
              style={{ background: config.color + "22", color: config.color }}
            >
              {config.label}
            </span>
            {exception.resolved && (
              <span className="text-xs" style={{ color: "var(--ok)" }}>✓ Resolved</span>
            )}
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "var(--ink)" }}>
            {exception.title}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--ink-3)" }}>
            {exception.detail}
          </p>
          {exception.refs.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {exception.refs.map((r) => (
                <span
                  key={r}
                  className="text-xs px-1.5 py-0.5 rounded font-mono"
                  style={{ background: "rgba(255,255,255,0.06)", color: "var(--ink-4)" }}
                >
                  {r}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
