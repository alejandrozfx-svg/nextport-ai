const stages = [
  { key: "docs_received", label: "Docs Received", count: 7 },
  { key: "ai_review", label: "AI Review", count: 5 },
  { key: "exception_check", label: "Exception Check", count: 3 },
  { key: "human_review", label: "Human Review", count: 2 },
  { key: "ready", label: "Ready to Approve", count: 2 },
];

export function FlowStrip() {
  return (
    <div
      className="glass-panel-tight px-4 py-3 flex items-center gap-0"
      style={{ overflow: "hidden" }}
    >
      {stages.map((stage, i) => (
        <div key={stage.key} className="flex items-center flex-1">
          <div className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold"
              style={{
                background: i < 3 ? "var(--brand-soft)" : "var(--hair)",
                color: i < 3 ? "var(--brand)" : "var(--ink-4)",
                border: `1px solid ${i < 3 ? "oklch(0.78 0.09 235 / 0.3)" : "var(--hair-2)"}`,
              }}
            >
              {stage.count}
            </div>
            <p className="text-xs text-center leading-tight" style={{ color: "var(--ink-4)" }}>
              {stage.label}
            </p>
          </div>
          {i < stages.length - 1 && (
            <div
              className="h-px flex-shrink-0"
              style={{ width: 24, background: "var(--hair-2)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
