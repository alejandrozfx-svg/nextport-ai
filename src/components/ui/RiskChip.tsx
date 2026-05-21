import { cn } from "@/lib/utils";

interface RiskChipProps {
  kind: "risk" | "warn" | "review" | "ok" | "ready";
  label?: string;
  size?: "sm" | "md";
  pulse?: boolean;
}

const kindMap: Record<string, { color: string; bg: string; border: string; label: string }> = {
  risk: { color: "var(--risk)", bg: "var(--risk-soft)", border: "oklch(0.70 0.16 25 / 0.35)", label: "At Risk" },
  warn: { color: "var(--warn)", bg: "var(--warn-soft)", border: "oklch(0.82 0.14 78 / 0.35)", label: "Needs Review" },
  review: { color: "var(--warn)", bg: "var(--warn-soft)", border: "oklch(0.82 0.14 78 / 0.35)", label: "Needs Review" },
  ok: { color: "var(--ok)", bg: "var(--ok-soft)", border: "oklch(0.78 0.13 155 / 0.35)", label: "Ready" },
  ready: { color: "var(--ok)", bg: "var(--ok-soft)", border: "oklch(0.78 0.13 155 / 0.35)", label: "Ready" },
};

export function RiskChip({ kind, label, size = "md", pulse }: RiskChipProps) {
  const m = kindMap[kind] ?? kindMap.ok;
  const displayLabel = label ?? m.label;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs"
      )}
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}
    >
      <span
        className={cn("rounded-full flex-shrink-0", pulse && kind === "risk" ? "pulse-risk" : "")}
        style={{ width: 6, height: 6, background: m.color, display: "inline-block" }}
      />
      {displayLabel}
    </span>
  );
}
