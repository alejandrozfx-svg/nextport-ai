import { AlertCircle, CheckCircle2 } from "lucide-react";

interface FieldRowProps {
  label: string;
  value: string;
  confidence: number;
  mismatch?: boolean;
  mismatchRef?: string | null;
}

export function FieldRow({ label, value, confidence, mismatch, mismatchRef }: FieldRowProps) {
  const confColor =
    confidence >= 0.9 ? "var(--ok)" : confidence >= 0.75 ? "var(--warn)" : "var(--risk)";

  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
      style={{
        background: mismatch ? "var(--risk-soft)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${mismatch ? "oklch(0.70 0.16 25 / 0.25)" : "var(--hair)"}`,
      }}
    >
      {/* Confidence indicator */}
      <div
        className="w-1 h-6 rounded-full flex-shrink-0"
        style={{ background: confColor }}
      />

      {/* Label + value */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium mb-0.5" style={{ color: "var(--ink-4)" }}>
          {label}
        </p>
        <p className="text-sm font-mono truncate" style={{ color: mismatch ? "var(--risk)" : "var(--ink)" }}>
          {value}
        </p>
        {mismatch && mismatchRef && (
          <p className="text-xs mt-0.5" style={{ color: "var(--risk)" }}>
            ⚠ Differs from: {mismatchRef}
          </p>
        )}
      </div>

      {/* Status icon */}
      {mismatch ? (
        <AlertCircle size={14} style={{ color: "var(--risk)", flexShrink: 0 }} />
      ) : (
        <CheckCircle2 size={14} style={{ color: confColor, flexShrink: 0 }} />
      )}

      {/* Confidence */}
      <span className="text-xs font-mono flex-shrink-0" style={{ color: confColor }}>
        {Math.round(confidence * 100)}%
      </span>
    </div>
  );
}
